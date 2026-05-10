import { ImageResponse } from "next/og";
import { getPrismaClient } from "@/lib/prisma";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  let monthlySavings = 0;
  let annualSavings = 0;
  let toolCount = 0;

  try {
    const prisma = getPrismaClient();
    const audit = await prisma.audit.findUnique({
      where: { publicSlug: slug },
      include: { tools: true },
    });
    if (audit) {
      monthlySavings = audit.savings;
      annualSavings = audit.savings * 12;
      toolCount = audit.tools.length;
    }
  } catch {
    // fallback values
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0f172a",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "48px" }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            backgroundColor: "#3b82f6",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginRight: 16,
          }}>
            <span style={{ color: "white", fontSize: 24, fontWeight: 900 }}>F</span>
          </div>
          <span style={{ color: "#94a3b8", fontSize: 28, fontWeight: 700 }}>Fluxora AI Spend Audit</span>
        </div>

        {/* Headline */}
        <div style={{ color: "white", fontSize: 56, fontWeight: 900, lineHeight: 1.1, marginBottom: 32 }}>
          Your AI stack could save
          <span style={{ color: "#22c55e", display: "block" }}>
            ${annualSavings.toLocaleString()}/year
          </span>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 32, marginBottom: 48 }}>
          {[
            { label: "Monthly Savings", value: `$${monthlySavings.toLocaleString()}` },
            { label: "Annual Savings",  value: `$${annualSavings.toLocaleString()}` },
            { label: "Tools Analyzed",  value: `${toolCount}` },
          ].map((stat, i) => (
            <div key={i} style={{
              backgroundColor: "#1e293b",
              borderRadius: 16,
              padding: "20px 32px",
              display: "flex",
              flexDirection: "column",
            }}>
              <span style={{ color: "#64748b", fontSize: 18, marginBottom: 8 }}>{stat.label}</span>
              <span style={{ color: "white", fontSize: 36, fontWeight: 900 }}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "auto", color: "#475569", fontSize: 22 }}>
          credex.rocks · AI Spend Audit · Free Tool
        </div>
      </div>
    ),
    { ...size }
  );
}
