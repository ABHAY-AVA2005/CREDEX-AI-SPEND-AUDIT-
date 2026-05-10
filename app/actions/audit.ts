"use server"

/**
 * audit.ts
 * Core server actions for processing audits and capturing leads.
 * I've kept this strictly deterministic for the math part—CFOs don't like AI hallucinations.
 */

import { AuditFormInput, AuditFormSchema, AuditResult } from "@/schemas/audit";
import { runAuditEngine } from "@/core/audit-engine";
import { generateAuditSummary } from "@/lib/gemini";
import { Resend } from "resend";
import { nanoid } from "nanoid";

// Initialize Resend only if the key is there. 
// Prevents the whole app from crashing if someone forgets their env vars.
let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

export interface ProcessedAuditResult extends AuditResult {
  aiSummary: string;
  publicSlug: string;
  companyName: string;
}

/**
 * Main action to run the audit.
 * 1. Validates inputs
 * 2. Runs the hard-math engine
 * 3. Asks Gemini to write a nice human summary
 * 4. Saves to Postgres via Prisma
 */
export async function processAuditAction(data: AuditFormInput): Promise<ProcessedAuditResult> {
  console.log("[AuditAction] Incoming Data:", JSON.stringify(data));
  
  // Always validate on the server. Never trust the client.
  const parsed = AuditFormSchema.safeParse(data);
  if (!parsed.success) {
    console.error("[AuditAction] Validation Failed:", parsed.error.format());
    throw new Error("Validation failed: Please ensure all tool names and spend amounts are valid.");
  }

  // 1. Run our deterministic engine (The 'Hard Math' layer)
  const result = runAuditEngine(parsed.data);

  // 2. Generate Gemini Summary (The 'Friendly Human' layer)
  // We only use AI for words, never for the actual math.
  const aiSummary = await generateAuditSummary(parsed.data.companyName, result);

  // 3. Generate a unique public slug for the shareable URL
  // nanoid(10) is plenty for our collision needs.
  const publicSlug = nanoid(10);

  // 4. Persist to database (Background Task - non-blocking for user results)
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
            // Mapping back to the original index to preserve useCases
            useCases: parsed.data.tools[result.recommendations.indexOf(rec)]?.useCases || [],
            suggestedTool: rec.suggestedTool,
            suggestedPlan: rec.suggestedPlan,
            suggestedSpend: rec.suggestedTotalCost,
            reasoning: rec.reasoning,
          })),
        },
      },
    });
    console.log(`[AuditAction] Successfully persisted audit ${publicSlug}`);
  } catch (dbError) {
    // If the DB fails (e.g., connection issue on Vercel), we log it but DON'T kill the user's results.
    // The user will still see the 'Aha!' moment on the dashboard from the returned object.
    console.error("[AuditAction] Critical Database Error (Persist Failed):", dbError);
  }

  return {
    ...result,
    aiSummary,
    publicSlug,
    companyName: parsed.data.companyName,
  };
}

/**
 * Secondary action for the email gate / lead capture.
 * Saves the user info and sends the pretty HTML report.
 */
export async function captureLeadEmail(
  email: string,
  companyName: string,
  publicSlug: string,
  monthlySavings: number,
  annualSavings: number,
  aiSummary: string,
  role?: string,
  teamSize?: number
): Promise<{ success: boolean }> {
  
  // 1. Save or Update Lead in DB
  try {
    const { getPrismaClient } = await import("@/lib/prisma");
    const prisma = getPrismaClient();

    const lead = await prisma.lead.upsert({
      where: { email },
      update: { 
        name: companyName, 
        role: role || undefined, 
        teamSize: teamSize || undefined 
      },
      create: { 
        email, 
        company: companyName, 
        role: role || undefined, 
        teamSize: teamSize || undefined 
      },
    });

    // Link this specific audit to the lead for our CRM view
    await prisma.audit.updateMany({
      where: { publicSlug },
      data: { leadId: lead.id },
    });
  } catch (dbError) {
    // If the DB fails, we still want to try sending the email. 
    // Don't kill the user's "Aha!" moment.
    console.warn("Soft-failure: DB lead save skipped:", dbError);
  }

  // 2. Send the Email Report
  if (resend) {
    try {
      await resend.emails.send({
        from: "Fluxora Audit <onboarding@resend.dev>",
        to: [email],
        subject: `Your Fluxora AI Spend Audit: Save $${annualSavings.toLocaleString()}/yr`,
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
          Ready to optimize your AI spending? Start reselling unused credits on Fluxora.
        </p>
        <a href="https://credex.rocks" class="cta-button" style="background: #1f2937;">
          🚀 Visit Credex Marketplace
        </a>
      </div>
    </div>

    <div class="footer">
      <p>
        <strong>Fluxora</strong> - The marketplace for AI and cloud credits<br>
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
      console.error("Critical error sending report email:", error);
    }
  }

  return { success: true };
}
