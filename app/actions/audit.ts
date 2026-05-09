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
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your AI Spend Audit Results</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
    .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
    .content { padding: 40px 30px; }
    .savings-card { background: #ecfdf5; border: 1px solid #d1fae5; border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center; }
    .savings-amount { font-size: 36px; font-weight: 800; color: #059669; margin: 10px 0; }
    .savings-label { font-size: 16px; color: #065f46; font-weight: 600; }
    .summary-section { background: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #059669; }
    .summary-title { font-size: 18px; font-weight: 700; color: #1f2937; margin: 0 0 15px 0; }
    .summary-text { color: #4b5563; line-height: 1.6; margin: 0; }
    .cta-button { display: inline-block; background: #059669; color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; text-align: center; }
    .cta-button:hover { background: #047857; }
    .secondary-cta { text-align: center; margin: 30px 0; }
    .secondary-cta a { color: #059669; text-decoration: none; font-weight: 600; }
    .footer { background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { margin: 0; color: #6b7280; font-size: 14px; }
    .footer a { color: #059669; text-decoration: none; }
    @media (max-width: 600px) {
      .header { padding: 30px 20px; }
      .header h1 { font-size: 24px; }
      .content { padding: 30px 20px; }
      .savings-card { padding: 20px; }
      .savings-amount { font-size: 28px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Your AI Spend Audit is Ready</h1>
      <p>Hi ${companyName}, we've analyzed your AI tool stack</p>
    </div>

    <div class="content">
      <div class="savings-card">
        <div style="font-size: 48px; margin-bottom: 10px;">💰</div>
        <div class="savings-amount">$${monthlySavings.toLocaleString()}/mo</div>
        <div class="savings-label">Potential Monthly Savings</div>
        <div style="font-size: 14px; color: #065f46; margin-top: 10px;">
          That's $${annualSavings.toLocaleString()} annually on your AI tools
        </div>
      </div>

      <div class="summary-section">
        <div class="summary-title">📊 Executive Summary</div>
        <div class="summary-text">
          ${aiSummary.split('\n').filter(p => p.trim()).map(paragraph => 
            `<p style="margin: 0 0 12px 0; line-height: 1.6;">${paragraph.trim()}</p>`
          ).join('')}
        </div>
      </div>

      <div style="text-align: center; margin: 40px 0;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/results/${publicSlug}" class="cta-button">
          📈 View Your Full Audit Report
        </a>
        <p style="color: #6b7280; font-size: 14px; margin: 15px 0 0 0;">
          Shareable link: ${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/results/${publicSlug}
        </p>
      </div>

      <div class="secondary-cta">
        <p style="color: #4b5563; margin-bottom: 15px;">
          Ready to optimize your AI spending? Start reselling unused credits on Credex.
        </p>
        <a href="https://credex.rocks" class="cta-button" style="background: #1f2937;">
          🚀 Visit Credex.rocks
        </a>
      </div>
    </div>

    <div class="footer">
      <p>
        <strong>Credex</strong> - The marketplace for AI and cloud credits<br>
        Optimize your tech stack • Maximize your budget
      </p>
      <p style="margin-top: 15px;">
        Questions? Reply to this email or visit <a href="https://credex.rocks">credex.rocks</a>
      </p>
    </div>
  </div>
</body>
</html>
        `,
      });
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  return { success: true };
}
