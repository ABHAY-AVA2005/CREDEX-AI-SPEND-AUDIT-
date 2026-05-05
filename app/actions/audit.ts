"use server"

import { AuditFormInput, AuditFormSchema, AuditResult } from "@/schemas/audit";
import { runAuditEngine } from "@/core/audit-engine";
import { generateAuditSummary } from "@/lib/gemini";
import { Resend } from "resend";
import { nanoid } from "nanoid";

let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

export interface ProcessedAuditResult extends AuditResult {
  aiSummary: string;
  publicSlug: string;
  companyName: string;
}

export async function processAuditAction(data: AuditFormInput): Promise<ProcessedAuditResult> {
  // Validate input
  const parsed = AuditFormSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid form data");
  }

  // 1. Run deterministic engine
  const result = runAuditEngine(parsed.data);

  // 2. Generate Gemini Summary
  const aiSummary = await generateAuditSummary(parsed.data.companyName, result);

  // 3. Generate a unique public slug for shareable URL
  const publicSlug = nanoid(10);

  // 4. Persist to database (Prisma)
  try {
    const { getPrismaClient } = await import("@/lib/prisma");
    const prisma = getPrismaClient();
    await prisma.audit.create({
      data: {
        companySize: parsed.data.companySize,
        industry: parsed.data.industry,
        totalSpend: result.totalCurrentSpend,
        optimizedSpend: result.totalOptimizedSpend,
        savings: result.monthlySavings,
        aiSummary,
        isPublic: true,
        publicSlug,
        tools: {
          create: result.recommendations.map((rec) => ({
            toolName: rec.originalTool,
            currentPlan: rec.originalPlan ?? "",
            seats: rec.originalSeats ?? 1,
            monthlySpend: rec.originalMonthlyCost ?? 0,
            useCases: [],
            suggestedTool: rec.suggestedTool,
            suggestedPlan: rec.suggestedPlan,
            suggestedSpend: rec.suggestedTotalCost,
            reasoning: rec.reasoning,
          })),
        },
      },
    });
  } catch (dbError) {
    // DB not available locally — continue without saving
    console.warn("DB save skipped:", dbError);
  }

  return {
    ...result,
    aiSummary,
    publicSlug,
    companyName: parsed.data.companyName,
  };
}

// Called AFTER results shown — email gate
export async function captureLeadEmail(
  email: string,
  companyName: string,
  publicSlug: string,
  monthlySavings: number,
  annualSavings: number,
  aiSummary: string,
  role?: string
): Promise<{ success: boolean }> {
  // Save lead to DB
  try {
    const { getPrismaClient } = await import("@/lib/prisma");
    const prisma = getPrismaClient();

    const lead = await prisma.lead.upsert({
      where: { email },
      update: { name: companyName, role: role || undefined },
      create: { email, company: companyName, role: role || undefined },
    });

    // Link lead to audit
    await prisma.audit.updateMany({
      where: { publicSlug },
      data: { leadId: lead.id },
    });
  } catch (dbError) {
    console.warn("DB lead save skipped:", dbError);
  }

  // Send email report
  if (resend) {
    try {
      await resend.emails.send({
        from: "Credex Audit <onboarding@resend.dev>",
        to: [email],
        subject: `Your Credex AI Spend Audit: Save $${annualSavings.toLocaleString()}/yr`,
        html: `
          <h2>AI Spend Audit Complete</h2>
          <p>Hi ${companyName},</p>
          <p>Your audit is ready! We found that you can save <strong>$${monthlySavings.toLocaleString()}/mo</strong> on AI tools.</p>
          <p><strong>Executive Summary:</strong><br/>${aiSummary}</p>
          <p><strong>View & share your full report:</strong><br/>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/results/${publicSlug}">
            ${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/results/${publicSlug}
          </a></p>
          <p><a href="https://credex.rocks">Click here to visit Credex.rocks</a> to start reselling your unused AI and cloud credits.</p>
        `,
      });
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  return { success: true };
}
