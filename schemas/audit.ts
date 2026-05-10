import { z } from "zod";

export const AuditToolSchema = z.object({
  id: z.string().optional(),
  toolName: z.string().min(1, "Tool name is required"),
  currentPlan: z.string().min(1, "Plan is required"),
  seats: z.number().min(1, "At least 1 seat required"),
  monthlySpend: z.number().min(0, "Spend must be 0 or more"),
  useCases: z.array(z.string()).min(1, "Select at least one use case"),
});

export const AuditFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companySize: z.number().min(1, "Company size is required"),
  industry: z.string().optional(),
  tools: z.array(AuditToolSchema).min(1, "Add at least one tool"),
});

// Email capture schema — separate, after results are shown
export const EmailCaptureSchema = z.object({
  email: z.string().email("Valid email is required"),
  companyName: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  teamSize: z.number().min(1, "Team size is required"),
});

export type AuditToolInput = z.infer<typeof AuditToolSchema>;
export type AuditFormInput = z.infer<typeof AuditFormSchema>;
export type EmailCaptureInput = z.infer<typeof EmailCaptureSchema>;

export interface AuditRecommendation {
  originalTool: string;
  originalPlan?: string;
  originalSeats?: number;
  originalMonthlyCost?: number;
  action: "KEEP" | "REPLACE" | "DOWNGRADE" | "CONSOLIDATE";
  suggestedTool?: string;
  suggestedPlan?: string;
  suggestedCostPerSeat?: number;
  suggestedTotalCost?: number;
  savings: number;
  newCost: number;
  reasoning: string;
}

export interface AuditResult {
  totalCurrentSpend: number;
  totalOptimizedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  recommendations: AuditRecommendation[];
}
