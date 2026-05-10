import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPrismaClient } from "@/lib/prisma";
import ResultsClient from "./ResultsClient";
import { ProcessedAuditResult } from "@/app/actions/audit";

interface Props {
  params: { slug: string };
}

// Dynamic Open Graph metadata per audit
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let savings = 12000;
  let company = "Startup";

  if (slug === "sample-demo") {
    savings = 96096;
    company = "Acme Corp (Demo)";
  } else {
    try {
      const prisma = getPrismaClient();
      const audit = await prisma.audit.findFirst({ where: { publicSlug: slug } });
      if (audit) {
        savings = audit.savings * 12; // annual
        company = "Your AI Stack";
      }
    } catch (err) {
      console.error("Metadata error:", err);
      // DB unavailable — use defaults
    }
  }

  const title = `AI Spend Audit — Save $${savings.toLocaleString()}/yr | Credex`;
  const description = `See exactly where ${company} is overspending on AI tools and how to save $${savings.toLocaleString()} annually. Powered by Credex.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/results/${slug}`,
      siteName: "Credex AI Spend Audit",
      type: "website",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/results/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ResultsPage({ params }: Props) {
  const { slug } = await params;

  if (slug === "sample-demo") {
    const sampleResult: ProcessedAuditResult = {
      companyName: "Acme Corp (Demo)",
      totalCurrentSpend: 18245,
      totalOptimizedSpend: 10237,
      monthlySavings: 8008,
      annualSavings: 96096,
      publicSlug: "sample-demo",
      aiSummary: "Your AI stack analysis shows significant overlap between ChatGPT Enterprise and Claude Team. By consolidating to a unified platform and reclaiming 72 inactive seats, you can recover over $8,000 monthly without impacting productivity.",
      recommendations: [
        {
          originalTool: "ChatGPT Enterprise",
          originalPlan: "Enterprise",
          originalSeats: 120,
          originalMonthlyCost: 4320,
          action: "REPLACE",
          suggestedTool: "Credex Exchange",
          suggestedPlan: "Standard",
          suggestedTotalCost: 1728,
          savings: 2592,
          newCost: 1728,
          reasoning: "Reclaim 72 inactive ChatGPT Enterprise seats. Downsize or resell via Credex Exchange."
        },
        {
          originalTool: "AWS Credits",
          originalPlan: "Reserved Instances",
          originalMonthlyCost: 8400,
          action: "REPLACE",
          suggestedTool: "Optimized AWS",
          suggestedPlan: "On-Demand/Spot",
          suggestedTotalCost: 5200,
          savings: 3200,
          newCost: 5200,
          reasoning: "Redeploy $3,200 in expiring AWS reserved credits before 38-day deadline."
        }
      ]
    };
    return <ResultsClient result={sampleResult} isShared={true} />;
  }
  try {
    const prisma = getPrismaClient();
    const audit = await prisma.audit.findFirst({
      where: { publicSlug: slug, isPublic: true },
      include: { tools: true },
    });

    if (!audit) return notFound();

    // Reconstruct result shape for the client component
    const result = {
      publicSlug: slug,
      companyName: "Your Company",
      totalCurrentSpend: audit.totalSpend,
      totalOptimizedSpend: audit.optimizedSpend,
      monthlySavings: audit.savings,
      annualSavings: audit.savings * 12,
      aiSummary: audit.aiSummary ?? "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recommendations: audit.tools.map((t: any) => ({
        originalTool: t.toolName,
        originalPlan: t.currentPlan,
        originalSeats: t.seats,
        originalMonthlyCost: t.monthlySpend,
        action: t.suggestedTool ? "REPLACE" as const : "KEEP" as const,
        suggestedTool: t.suggestedTool ?? undefined,
        suggestedPlan: t.suggestedPlan ?? undefined,
        suggestedTotalCost: t.suggestedSpend ?? undefined,
        savings: t.monthlySpend - (t.suggestedSpend ?? t.monthlySpend),
        newCost: t.suggestedSpend ?? t.monthlySpend,
        reasoning: t.reasoning ?? "",
      })),
    };

    return <ResultsClient result={result} isShared={true} />;
  } catch (err) {
    console.error("Results page error:", err);
    return notFound();
  }
}
