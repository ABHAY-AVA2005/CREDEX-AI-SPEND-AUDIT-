# Metrics & Instrumentation

## 🌟 The North Star Metric: "Identified Annual Recovery (IAR)"
**Definition**: The total dollar amount of annual savings identified across all completed audits.
**Why**: As a B2B lead-gen tool, our value isn't "Daily Active Users" (no one audits their spend every day). Our value is the **Financial Impact** we reveal. If IAR is high, our "Consultation" leads become extremely valuable to the Fluxora sales team.

## 📈 3 Driver (Input) Metrics
1. **Audit Completion Rate (ACR)**: The % of users who start the form and reach the results page. This measures the "Friction" of our ingestion flow.
2. **Average Tools per Audit (TPA)**: If users only enter 1 tool, we can't find "Overlap." We need >3 tools to provide a high-value audit.
3. **Share-to-View Ratio (SVR)**: The % of audits that generate a public URL. This measures the "Confidence" and "Aha!" moment of the user.

## 🛠️ Instrumentation Plan (What we track first)
1. **Segment/PostHog Event: `audit_started`**: Tracked when the first tool is added.
2. **Segment/PostHog Event: `lead_captured`**: Tracked when the email/role form is submitted on the results page.
3. **Funnel Tracking**: Landing Page -> Step 1 (Company Info) -> Step 2 (Tools) -> Results -> Lead Capture.

## 🚦 The Pivot Decision
**The Trigger**: If after 500 audits, the **Average Savings Identified per Audit** is less than $200/mo.
**The Decision**: This would mean AI tools are either too cheap to matter or users are already perfectly optimized. We would pivot the tool from a "Cost Savings" audit to a **"Security & Compliance"** audit (focusing on *where* the data is going, rather than how much it costs).
