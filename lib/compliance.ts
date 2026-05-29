/**
 * lib/compliance.ts
 * B2B Enterprise Security & Compliance Registry.
 * Houses verified credentials (SOC 2, GDPR, HIPAA, SSO, Data Retention policies) for major AI vendors.
 * Enables risk profile assessment during tool transition recommendations.
 */

export interface SecurityProfile {
  vendorName: string;
  soc2Type2: boolean;
  gdpr: boolean;
  hipaa: boolean;
  samlSso: boolean;
  zeroDataRetention: boolean; // strict guarantee that inputs are not trained on
}

export const COMPLIANCE_REGISTRY: Record<string, SecurityProfile> = {
  "GitHub Copilot": {
    vendorName: "GitHub Copilot",
    soc2Type2: true,
    gdpr: true,
    hipaa: false,
    samlSso: true, // available on Business/Enterprise
    zeroDataRetention: true,
  },
  "Cursor": {
    vendorName: "Cursor",
    soc2Type2: true,
    gdpr: true,
    hipaa: false,
    samlSso: true, // Business/Enterprise only
    zeroDataRetention: true, // with Privacy Mode enabled
  },
  "ChatGPT": {
    vendorName: "ChatGPT",
    soc2Type2: true, // Team/Enterprise only (Plus is NOT SOC 2 Type II compliant!)
    gdpr: true,
    hipaa: true, // under BAA on Enterprise plan
    samlSso: true, // Team/Enterprise only
    zeroDataRetention: true, // Team/Enterprise only, or with history disabled in Plus
  },
  "Claude": {
    vendorName: "Claude",
    soc2Type2: true, // Team/Enterprise only
    gdpr: true,
    hipaa: true, // under BAA on Enterprise plan
    samlSso: true, // Team/Enterprise only
    zeroDataRetention: true, // Team/Enterprise only
  },
  "OpenAI API": {
    vendorName: "OpenAI API",
    soc2Type2: true,
    gdpr: true,
    hipaa: true, // with BAA signed
    samlSso: true,
    zeroDataRetention: true,
  },
  "Anthropic API": {
    vendorName: "Anthropic API",
    soc2Type2: true,
    gdpr: true,
    hipaa: true, // with BAA signed
    samlSso: true,
    zeroDataRetention: true,
  },
  "Jasper": {
    vendorName: "Jasper",
    soc2Type2: true,
    gdpr: true,
    hipaa: false,
    samlSso: true,
    zeroDataRetention: true,
  },
  "API Gateway (TypingMind)": {
    vendorName: "API Gateway (TypingMind)",
    soc2Type2: false, // self-hosted or BYOK gateway risk
    gdpr: false,
    hipaa: false,
    samlSso: false, // unless enterprise license purchased
    zeroDataRetention: false, // dependent entirely on upstream API keys
  }
};

export interface SecurityImpact {
  lost: string[];
  gained: string[];
  riskRating: "LOW" | "MEDIUM" | "HIGH";
}

/**
 * Computes the compliance delta when migrating from one tool to another.
 * Helps CFOs and security officers evaluate trade-offs transparently.
 */
export function getTransitionSecurityImpact(
  fromTool: string,
  toTool: string
): SecurityImpact {
  const defaultProfile: SecurityProfile = {
    vendorName: "Generic Tool",
    soc2Type2: false,
    gdpr: false,
    hipaa: false,
    samlSso: false,
    zeroDataRetention: false,
  };

  const fromProfile = COMPLIANCE_REGISTRY[fromTool] || defaultProfile;
  const toProfile = COMPLIANCE_REGISTRY[toTool] || defaultProfile;

  const lost: string[] = [];
  const gained: string[] = [];

  // Compare individual security vectors
  const checkVector = (
    vectorName: string,
    key: keyof Omit<SecurityProfile, "vendorName">
  ) => {
    if (fromProfile[key] && !toProfile[key]) {
      lost.push(vectorName);
    } else if (!fromProfile[key] && toProfile[key]) {
      gained.push(vectorName);
    }
  };

  checkVector("SOC 2 Type II Compliance", "soc2Type2");
  checkVector("GDPR Compliance", "gdpr");
  checkVector("HIPAA Compliance", "hipaa");
  checkVector("SAML SSO", "samlSso");
  checkVector("Zero-Data Retention (ZDR) Guarantees", "zeroDataRetention");

  // Assess composite migration risk rating
  let riskRating: SecurityImpact["riskRating"] = "LOW";
  if (lost.includes("SOC 2 Type II Compliance") || lost.includes("SAML SSO")) {
    riskRating = "HIGH";
  } else if (lost.length > 0) {
    riskRating = "MEDIUM";
  }

  return {
    lost,
    gained,
    riskRating,
  };
}
