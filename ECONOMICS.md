# My "Back of the Napkin" Economics for Fluxora

## 1. How much is a Lead actually worth? (LTV)
If Credex uses Fluxora to find leads, they basically fall into two buckets:
1. **The Buyer:** They find out they’re overspending and decide to buy cheaper credits on Credex instead.
   - *Typical deal:* $5k in credits.
   - *Our cut (15%):* $750.
   - *Repeat:* Maybe twice a year?
   - **Total Annual Value:** ~$1,500.
2. **The Seller:** They realize they have $20k in credits they’ll never use and want to liquidate.
   - *Our cut (10%):* $2,000.
   - **Total Annual Value:** ~$2,000.

**Blended LTV:** Let's call it **$1,750 per lead**.

## 2. CAC (Cost to get a user)
I’m aiming for a $0 CAC by being scrappy:
- **X/LinkedIn Outbound:** $0 (just my time).
- **Organic Viral Loop:** $0 (this is the big one). 
When a founder shares their audit link with a VC or on Twitter, we get free traffic. If the viral factor is even 1.1, the CAC effectively drops to near zero.

## 3. What does one Audit cost us? (COGS)
I’ve optimized the tech stack to be super cheap. 
- **The Logic:** $0 (it’s just TypeScript).
- **Gemini Summary:** ~$0.03 per hit.
- **Database/Prisma:** ~$0.02.
- **Emails (Resend):** $0.01.
**Total COGS:** **$0.06 per audit.**

If even 0.5% of people who run an audit end up doing a deal on Credex, each audit is worth about **$8.75 in revenue**. That’s a 14,000% ROI on the compute cost. The math is definitely there.

## 4. The Path to $1M+ ARR
To hit $1M ARR, we need to be doing about 50 marketplace deals a month. That sounds like a lot, but if the viral loop works:

| Month | Audits | Leads (3% conv) | Deals (5% conv) | Rev ($1,750/deal) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 200 | 6 | 0 | $0 |
| 6 | 4,000 | 120 | 6 | $10,500 |
| 12 | 15,000 | 450 | 22 | $38,500 |
| 18 | 40,000 | 1,200 | 60 | **$105,000** |

**Run Rate at 18 months:** ~$1.2M ARR. 
This assumes we can keep the viral loop going and that VCs start "mandating" the tool for their portfolio companies to save cash.

## 5. Who would buy this?
- **Fintechs (Brex/Mercury):** They’d love to have this audit tool inside their dashboard to keep users from churning due to high bills.
- **Cloud Providers:** AWS/Google could use it to help customers spend their credits more "efficiently" (and stay on their platform longer).
