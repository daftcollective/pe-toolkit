import { useState, useRef } from "react";

const workflows = [
  {
    id: "competitor-intel",
    category: "Deal Sourcing",
    title: "Competitor Intelligence",
    description: "Live web scraping agent — researches competitors, market players, recent M&A and pricing for any target sector",
    icon: "🔍",
    estimatedTime: "3–5 min",
    useAgent: true,
    agentBadge: "LIVE WEB SEARCH",
    steps: [
      { label: "Input", instruction: "Enter sector, geography, and any known competitors or target company" },
      { label: "Searching", instruction: "Agent scrapes web for competitors, deals, pricing, news" },
      { label: "Analysis", instruction: "Claude synthesises findings into a structured competitive landscape" },
      { label: "Output", instruction: "Competitor map, market dynamics, roll-up targets, recent M&A" },
    ],
    prompt: `You are a PE analyst conducting live competitor research for a roll-up acquisition strategy in the $1M–$50M small business market. Use web search to actively research the competitive landscape described.

Your research tasks — search for each of these:
1. Named competitors in this sector and geography (search for top players, recent news, any PE-backed consolidators)
2. Recent M&A activity in this sector — who is buying, at what multiples, what roll-ups are underway
3. Any publicly known pricing or rate benchmarks for this type of business
4. PE firms or strategic acquirers actively rolling up companies in this space
5. Any industry association data, trade press articles, or market sizing estimates
6. Online reviews or reputation signals for key named competitors (Google, Yelp, BBB if relevant)

After searching, produce a structured Competitor Intelligence Report:

**1. Market Overview**
- Sector description and fragmentation level
- Estimated total addressable market and growth rate
- Key geographic dynamics

**2. Competitive Landscape Map**
| Company | Size (est.) | Geography | PE-Backed? | Key Strengths | Threat Level |
List all named competitors found, scored High / Medium / Low threat

**3. Active Roll-Up Platforms**
- Any PE-backed consolidators already operating in this space
- Their acquisition pace and recent add-ons
- Implications: are we late? Is there still fragmentation to capture?

**4. Recent M&A Activity**
- Deals found (company, buyer, date, size/multiple if available)
- Valuation trends — are multiples compressing or expanding?

**5. Pricing & Rate Benchmarks**
- Any publicly available pricing data for this type of service/product
- How does the target company's pricing compare?

**6. Online Reputation Scan**
- Review ratings for key competitors (if found)
- Any reputation issues or differentiators visible online

**7. Roll-Up Target Identification**
- Based on research, list any specific companies that appear to be potential acquisition targets (fragmented, no obvious PE backing, local/regional)

**8. Strategic Implications for Our Deal**
- What does this competitive landscape mean for the target's defensibility?
- Is this sector worth rolling up? What's the window?
- Key risks from competitive dynamics

RESEARCH BRIEF:
{{INPUT}}`,
    inputLabel: "Describe what to research",
    inputPlaceholder: "Sector: Residential HVAC services\nGeography: Dallas / Fort Worth metro\nTarget company: Smith Cooling & Heating (~$6M revenue)\nKnown competitors: ARS Rescue Rooter, One Hour Air\nKey questions: Are there PE roll-ups already active? What are HVAC businesses selling for? Any fragmented local players we could add-on?",
  },
  {
    id: "cim-summary",
    category: "Deal Sourcing",
    title: "CIM Summary",
    description: "Upload a CIM PDF or Excel file — Claude extracts key metrics and roll-up fit automatically",
    icon: "📄",
    estimatedTime: "2–3 min",
    useAgent: false,
    useFileUpload: true,
    steps: [
      { label: "Upload", instruction: "Upload CIM as PDF or Excel file" },
      { label: "Processing", instruction: "Claude extracts financials, roll-up fit, risks & thesis" },
      { label: "Output", instruction: "Structured 1-page summary ready for IC memo" },
    ],
    prompt: `You are a private equity analyst specialising in roll-up acquisitions targeting companies with $1M–$50M in annual revenue. Produce a structured deal summary calibrated for a roll-up strategy:

1. **Company Overview** – Name, HQ, founded, business description (2–3 sentences), years in operation
2. **Financial Snapshot**
   - Revenue (LTM and prior 2 years), revenue CAGR
   - EBITDA and EBITDA margin (LTM)
   - Owner compensation / add-backs (critical for sub-$50M — quantify SDE if available)
   - Working capital profile
3. **Business Model** – Revenue generation, recurring vs. project split, customer concentration, contract lengths
4. **Roll-Up Fit Assessment**
   - Geographic footprint and expansion potential
   - Service/product overlap or complementarity with a platform
   - Integration complexity (systems, staff, culture)
   - Owner dependency risk
5. **Market & Competitive Position** – Local/regional dynamics, key competitors, defensibility
6. **Management & Key People** – Who stays post-close? Key person risk? Transition offered?
7. **Investment Highlights** – Top 3–5 reasons to pursue
8. **Key Risks** – Top 3–5 risks (owner dependency, customer concentration, informal processes)
9. **Asking Price / Valuation** – EV, SDE multiple, EBITDA multiple, seller financing

Flag missing data with [DATA NEEDED]. Note: platform vs. add-on candidate.

Please analyse the uploaded CIM document above and produce the full structured summary.`,
    inputLabel: "Upload CIM file",
    inputPlaceholder: "",
  },
  {
    id: "platform-screen",
    category: "Deal Sourcing",
    title: "Roll-Up Platform Screen",
    description: "Score a target as Platform / Add-On / Pass across 8 roll-up-specific dimensions",
    icon: "🏗️",
    estimatedTime: "1–2 min",
    useAgent: false,
    steps: [
      { label: "Input", instruction: "Enter sector, revenue, geography, management, systems" },
      { label: "Processing", instruction: "Claude scores platform vs. add-on fit across 8 dimensions" },
      { label: "Output", instruction: "Scored assessment: Platform / Add-On / Pass with rationale" },
    ],
    prompt: `You are a PE associate evaluating whether a small business ($1M–$50M revenue) is suitable as a roll-up PLATFORM vs. ADD-ON vs. PASS.

Score across 8 dimensions (1–5), then give overall recommendation:

1. **Management depth** – Leadership team beyond founder? (1=owner-only, 5=full team)
2. **Scalable systems** – ERP, CRM, financials — can they absorb add-ons? (1=spreadsheets, 5=modern integrated)
3. **Geographic anchor** – Defensible home market? (1=single weak location, 5=strong regional presence)
4. **Fragmented sector** – Many small acquisition targets nearby? (1=consolidated, 5=very fragmented)
5. **Recurring revenue** – Cash flow predictability for acquisition debt? (1=project-based/lumpy, 5=contracted recurring)
6. **Brand & reputation** – Consolidation vehicle potential? (1=no brand, 5=strong known brand)
7. **Infrastructure headroom** – Can overhead absorb 3–5 add-ons? (1=at capacity, 5=lots of headroom)
8. **Owner transition** – Willing to stay / transition? (1=wants out immediately, 5=multi-year earnout)

For each: score, one sentence rationale, flag if deal-breaker.

Then:
- **Total Score** (out of 40)
- **Recommendation**: PLATFORM CANDIDATE / ADD-ON ONLY / PASS
- **Top 3 reasons**
- **Suggested next steps**

COMPANY INFORMATION:
{{INPUT}}`,
    inputLabel: "Enter company details",
    inputPlaceholder: "Sector: HVAC services\nRevenue: $8M\nEBITDA: $1.4M\nGeography: Dallas, TX\nManagement: Owner + 1 ops manager\nSystems: QuickBooks, paper scheduling\nCustomers: 60% residential, 40% commercial contracts\nOwner: 58 years old, wants to exit in 2 years",
  },
  {
    id: "market-sizing",
    category: "Deal Sourcing",
    title: "Market Sizing & Fragmentation",
    description: "Agent searches for TAM, sector fragmentation data, and roll-up opportunity sizing in any geography",
    icon: "🗺️",
    estimatedTime: "3–4 min",
    useAgent: true,
    agentBadge: "LIVE WEB SEARCH",
    steps: [
      { label: "Input", instruction: "Enter the sector and target geographies" },
      { label: "Searching", instruction: "Agent searches for market size, player counts, industry reports" },
      { label: "Analysis", instruction: "Claude quantifies the roll-up opportunity" },
      { label: "Output", instruction: "TAM, fragmentation map, # potential targets, acquisition pipeline estimate" },
    ],
    prompt: `You are a PE analyst sizing the roll-up opportunity in a specific sector and geography. Use web search to find real data.

Search for:
1. Total market size (TAM) for this sector in the target geography — industry reports, IBISWorld summaries, trade association data
2. Number of businesses operating in this sector/geography — census data, licensing databases, directory counts
3. Average revenue per business in this sector — to estimate how many fall in the $1M–$50M target range
4. Any existing PE-backed roll-ups or consolidators already active
5. Recent trade press or news on sector consolidation trends
6. Any publicly available data on deal multiples in this sector

Then produce a Roll-Up Opportunity Sizing Report:

**1. Market Size**
- TAM for the sector in target geography
- Growth rate and key demand drivers
- Source and reliability of data

**2. Fragmentation Analysis**
- Estimated total number of businesses in sector/geography
- Estimated number in the $1M–$50M revenue range (our target)
- Concentration: top 5 players' estimated market share
- Fragmentation score: Very High / High / Medium / Low

**3. Roll-Up Pipeline Estimate**
- Realistic number of add-on acquisition targets available
- Estimated acquisition pace (how many per year is feasible?)
- Geographic clustering — which sub-markets have the most density?

**4. Valuation Environment**
- Typical entry multiples for this sector (SDE or EBITDA)
- Any recent publicly disclosed transactions
- Multiple compression/expansion trend

**5. Competitive Dynamics for Roll-Up**
- Are there already active consolidators? How far along are they?
- Is there still a meaningful first-mover opportunity?
- Key barriers to consolidation

**6. Bottom Line**
- Is this sector worth building a roll-up platform in?
- Recommended geography to start
- Estimated platform size achievable in 4–5 years (revenue, EBITDA, # of companies)

SECTOR & GEOGRAPHY:
{{INPUT}}`,
    inputLabel: "Enter sector and geography",
    inputPlaceholder: "Sector: Commercial pest control services\nGeographies: Southeast US (TX, FL, GA, NC)\nTarget company size: $1M–$15M revenue\nQuestion: How fragmented is this market and how big could a roll-up platform get?",
  },
  {
    id: "loi-draft",
    category: "Deal Execution",
    title: "LOI Draft",
    description: "Generate a non-binding LOI with roll-up-specific terms: seller note, earnout, non-compete",
    icon: "✍️",
    estimatedTime: "1–2 min",
    useAgent: false,
    steps: [
      { label: "Input", instruction: "Enter company, EV, structure, earnout, seller note terms" },
      { label: "Processing", instruction: "Claude drafts an LOI with small-business acquisition terms" },
      { label: "Output", instruction: "Editable LOI draft — review with legal before sending" },
    ],
    prompt: `You are a senior associate at a PE firm specialising in roll-up acquisitions of small businesses ($1M–$50M revenue). Draft a non-binding Letter of Intent with roll-up-specific terms:

1. **Introduction** – Buyer identity, target company, intent to acquire
2. **Purchase Price & Structure**
   - Total Enterprise Value
   - Cash at close
   - Seller note (typical: 10–20% of EV, 3–5 year term)
   - Earnout provisions (tied to EBITDA or revenue targets)
   - Management rollover equity if applicable
3. **Transaction Structure** – Asset vs. stock purchase
4. **Working Capital** – Peg, target, normalisation methodology
5. **Key Conditions** – Financing, DD period (60–90 days), key employee retention, seller non-compete
6. **Non-Compete / Non-Solicit** – Seller: 3–5 years, specify geography and scope
7. **Exclusivity** – 30–45 days
8. **Transition Assistance** – Seller consulting period (3–12 months)
9. **Confidentiality** – Reference NDA or include clause
10. **Binding vs. Non-Binding** – Clearly distinguish
11. **Timeline & Next Steps**
12. **Signature block**

Note assumptions made. Flag anything requiring legal review.

DEAL PARAMETERS:
{{INPUT}}`,
    inputLabel: "Enter deal parameters",
    inputPlaceholder: "Company: Smith Plumbing LLC\nEV: $4.2M (~4.5x EBITDA)\nCash at close: $3.2M\nSeller note: $600K at 6%, 4 years\nEarnout: $400K if Year 1 EBITDA >$950K\nStructure: Asset purchase\nNon-compete: 4 years, 50-mile radius\nTransition: 6-month consulting agreement\nExclusivity: 45 days",
  },
  {
    id: "dd-checklist",
    category: "Due Diligence",
    title: "DD Checklist — Small Business",
    description: "Tailored DD checklist for owner-operated $1M–$50M businesses with roll-up integration focus",
    icon: "✅",
    estimatedTime: "1 min",
    useAgent: false,
    steps: [
      { label: "Input", instruction: "Describe the company: sector, size, business model, known issues" },
      { label: "Processing", instruction: "Claude generates a small-business-specific DD checklist" },
      { label: "Output", instruction: "Checklist across 6 workstreams with [CRITICAL] flags" },
    ],
    prompt: `You are a PE DD lead specialising in owner-operated small businesses ($1M–$50M). Generate a comprehensive DD checklist with [CRITICAL] flags for common deal-breakers at this size:

1. **Financial Due Diligence**
   - [CRITICAL] QofE — normalise owner salary, personal expenses, one-time items
   - SDE vs. EBITDA bridge
   - 3 years tax returns vs. management accounts reconciliation
   - [CRITICAL] Revenue by customer (flag if top 3 >40%)
   - AR aging, bad debt history, seasonality, working capital normalisation
   - Off-balance-sheet liabilities, deferred revenue, equipment leases

2. **Legal Due Diligence**
   - Corporate structure, ownership, cap table
   - [CRITICAL] Litigation, disputes, regulatory issues
   - Material contracts — assignable? Change of control provisions?
   - Licenses/permits, real estate lease assignability, IP ownership

3. **Operational Due Diligence**
   - [CRITICAL] Key person dependency — what happens if owner leaves Day 1?
   - Org chart, role clarity, documented processes
   - Equipment condition, capex requirements, supplier concentration

4. **Commercial Due Diligence**
   - [CRITICAL] Customer concentration and relationship mapping
   - Contract terms, renewal rates, churn, pricing history, pipeline/backlog

5. **HR & Compensation**
   - [CRITICAL] Employee flight risk post-close
   - Compensation benchmarking
   - Informal arrangements, non-competes, benefits/PTO liabilities

6. **Integration Readiness**
   - Systems compatibility with platform
   - Culture fit, integration timeline and cost estimate
   - Quick wins available in first 90 days

COMPANY DESCRIPTION:
{{INPUT}}`,
    inputLabel: "Describe the target company",
    inputPlaceholder: "Landscaping business, $6M revenue, $1.1M EBITDA, owner-operated 18 years, 3 commercial contracts + residential, owner does all sales, QuickBooks, 12 full-time employees...",
  },
  {
    id: "mgmt-ref-check",
    category: "Due Diligence",
    title: "Management Reference Check",
    description: "Structured reference call guide for owner-operators staying on post-close in a roll-up",
    icon: "🤝",
    estimatedTime: "1 min",
    useAgent: false,
    steps: [
      { label: "Input", instruction: "Describe the person, their role post-close, and specific concerns" },
      { label: "Processing", instruction: "Claude generates targeted reference questions and red flags" },
      { label: "Output", instruction: "Call guide with questions, red flags, and scoring sheet" },
    ],
    prompt: `You are a PE associate preparing management reference checks for a small business acquisition ($1M–$50M) in a roll-up. Key concerns: will this person perform post-close, are they the sole reason the business works, any integrity or culture issues?

Structure a reference check guide:

**Opening** – How to introduce the call and frame for honest responses (2 min)

**Section 1: Relationship & Context** (5 questions)
**Section 2: Leadership & Management Style** (5 questions)
**Section 3: Business & Operational Performance** (5 questions)
**Section 4: Integrity & Character** (4 questions)
**Section 5: Roll-Up / Integration Specific** (4 questions)

**Section 6: The Key Questions**
- "Would you go into business with this person again?"
- "Is there anything about them I should know that I haven't asked?"
- "What's their biggest weakness relevant to this role?"

**Red Flags to Note** — 8–10 specific red flags for owner-operators in roll-up contexts

**Scoring Sheet** — 1–5 grid: Integrity | Leadership | Operational competence | Cultural fit | Roll-up suitability

PERSON/ROLE DETAILS:
{{INPUT}}`,
    inputLabel: "Describe the person and context",
    inputPlaceholder: "Role: Owner/operator staying on as GM post-close for 18 months\nCompany: $8M HVAC services\nConcerns: Very owner-centric, all customer relationships are personal, no formal team\nReferences: 2 former employees, 1 major customer, 1 supplier",
  },
  {
    id: "ic-memo",
    category: "Investment Committee",
    title: "IC Memo — Roll-Up Acquisition",
    description: "Structure an IC memo for a platform or add-on acquisition in the $1M–$50M range",
    icon: "🏛️",
    estimatedTime: "3–4 min",
    useAgent: false,
    steps: [
      { label: "Input", instruction: "Paste deal notes, financial model outputs, DD findings" },
      { label: "Processing", instruction: "Claude structures a full IC memo with roll-up value creation logic" },
      { label: "Output", instruction: "IC memo with integration plan, returns attribution, risks table" },
    ],
    prompt: `You are a VP at a PE firm preparing an IC memo for a roll-up acquisition of a small business ($1M–$50M revenue). Write in concise, data-backed PE style.

1. **Executive Summary** — Recommendation, deal type (platform/add-on), 3-bullet thesis, entry valuation and returns
2. **Company Overview** — Business, history, geography, products/services
3. **Roll-Up Thesis** — Why this sector, fragmentation opportunity, this company's role
4. **Financial Performance** — Revenue and EBITDA (3yr + LTM), SDE bridge, owner add-backs
5. **Financial Projections & Value Creation** — Organic growth + add-on assumptions
6. **Valuation & Returns** — Entry, exit, MoM / IRR, Base / Upside / Downside sensitivity
7. **Due Diligence Summary** — Key findings by workstream
8. **Key Risks & Mitigants** — Table: Risk | Likelihood | Impact | Mitigation
9. **Transaction Structure** — Sources & uses, debt structure, earnout, non-compete
10. **Integration & 100-Day Plan** — Day 1 priorities, systems integration, key hires
11. **Recommendation** — Buy / Pass / Re-price with rationale

DEAL INFORMATION:
{{INPUT}}`,
    inputLabel: "Paste deal notes & financial data",
    inputPlaceholder: "Paste deal notes, model outputs, DD findings, management meeting notes...",
  },
  {
    id: "portfolio-update",
    category: "Portfolio Management",
    title: "Portfolio Company Update",
    description: "Transform raw management reporting into a board-ready update with roll-up integration status",
    icon: "📊",
    estimatedTime: "2 min",
    useAgent: false,
    steps: [
      { label: "Input", instruction: "Paste raw management report, financials, or call notes" },
      { label: "Processing", instruction: "Claude structures update with variance analysis and integration callouts" },
      { label: "Output", instruction: "Board update: actuals vs. budget, KPIs, integration status, risks" },
    ],
    prompt: `You are a PE portfolio management associate preparing a board-ready update for a roll-up platform company. Transform the raw data into a structured update:

1. **Headline Summary** — 3 bullets: on track 🟢, behind 🔴, one key risk 🟡
2. **Financial Performance** — Revenue and EBITDA: Actual vs. Budget vs. Prior Period 🟢🟡🔴
3. **Roll-Up / M&A Pipeline** — Add-ons in diligence, LOIs outstanding, recently closed
4. **Integration Scorecard** — Systems %, team retention, synergy capture
5. **Operating KPIs** — Key metrics (flag gaps with [DATA NEEDED])
6. **Commercial Update** — Pipeline, wins, churn, pricing
7. **Operational Update** — Headcount, key hires/departures
8. **Issues & Risks** — Table: Issue | Owner | Status | Target Resolution
9. **Actions Required from Board**
10. **Outlook** — Updated guidance

RAW DATA / NOTES:
{{INPUT}}`,
    inputLabel: "Paste management report or call notes",
    inputPlaceholder: "Paste raw management report, financial data, or call notes...",
  },
  {
    id: "covenant-monitoring",
    category: "Portfolio Management",
    title: "Covenant Monitoring Report",
    description: "Calculate covenant headroom, flag near-breaches, and draft lender talking points",
    icon: "⚖️",
    estimatedTime: "1–2 min",
    useAgent: false,
    steps: [
      { label: "Input", instruction: "Paste loan covenant terms and current financial data" },
      { label: "Processing", instruction: "Claude calculates headroom and flags breaches / near-misses" },
      { label: "Output", instruction: "RAG compliance table, headroom calcs, recommended actions" },
    ],
    prompt: `You are a PE portfolio monitoring analyst tracking debt covenant compliance for a roll-up platform.

Produce a covenant compliance report:

1. **Compliance Summary Table**
   | Covenant | Requirement | Actual | Headroom | Status | Trend |
   Status: 🟢 COMPLIANT | 🟡 WATCH (within 15% of limit) | 🔴 BREACH / NEAR BREACH

2. **Covenants to Check:**
   - Total Leverage Ratio (Debt/EBITDA)
   - DSCR (EBITDA/Debt Service)
   - Fixed Charge Coverage
   - Minimum Liquidity / Cash
   - Maximum Capex
   - Acquisition approval thresholds

3. **Breach / Near-Breach Analysis** — What drove it, remediation options, timeline

4. **Recommended Actions** — Lender communications, amendment conversations

5. **Next Test Date & Key Deadlines**

6. **Notes for CFO / Board**

COVENANT TERMS & FINANCIAL DATA:
{{INPUT}}`,
    inputLabel: "Paste covenant terms and financials",
    inputPlaceholder: "Credit facility: $12M senior term loan\nCovenants:\n- Max leverage: 4.5x Total Debt/EBITDA\n- Min DSCR: 1.25x\n- Min cash: $500K\n\nCurrent financials (LTM):\n- EBITDA: $2.1M\n- Total debt: $9.8M\n- Annual debt service: $1.7M\n- Cash: $620K\nNext test: March 31",
  },
  {
    id: "lp-update",
    category: "LP Relations",
    title: "LP Update Letter",
    description: "Draft a quarterly LP letter covering fund performance, roll-up progress and portfolio highlights",
    icon: "📬",
    estimatedTime: "2–3 min",
    useAgent: false,
    steps: [
      { label: "Input", instruction: "Enter fund metrics, portfolio highlights, deal activity, outlook" },
      { label: "Processing", instruction: "Claude drafts a professional quarterly LP letter" },
      { label: "Output", instruction: "LP letter — verify all numbers before sending" },
    ],
    prompt: `You are a Partner at a PE firm specialising in roll-up acquisitions. Draft a quarterly LP update letter. Be professional, transparent, and address issues head-on.

1. **Opening from Managing Partner** — Quarter in brief, roll-up progress, honest assessment vs. plan
2. **Fund Performance Summary** — Deployed capital, # platforms / add-ons, Gross MOIC and IRR
3. **Portfolio Company Highlights** — Revenue/EBITDA vs. budget, key wins, integration status, challenges
4. **M&A Activity** — Add-ons closed, LOIs outstanding, pipeline, sector valuation trends
5. **Value Creation Initiatives** — Cross-portfolio initiatives, shared services, key hires
6. **Market Commentary** — Small business M&A conditions, financing environment, macro headwinds
7. **Outlook for Next Quarter** — Expected deal activity, key milestones
8. **Capital Account / Admin Notes**
9. **Closing**

FUND & PORTFOLIO DATA:
{{INPUT}}`,
    inputLabel: "Enter fund metrics and portfolio data",
    inputPlaceholder: "Fund: $45M Fund II, vintage 2023\nDeployed: $28M across 2 platforms + 4 add-ons\nPlatform 1: HVAC services, $18M revenue, $3.1M EBITDA\nPlatform 2: Landscaping, $9M revenue, $1.4M EBITDA\nGross MOIC: 1.4x (unrealised)...",
  },
  {
    id: "exit-memo",
    category: "Exit & Realisation",
    title: "Exit Memo",
    description: "Draft an exit memo covering the roll-up build story, value creation, returns attribution and lessons learned",
    icon: "🚀",
    estimatedTime: "2–3 min",
    useAgent: false,
    steps: [
      { label: "Input", instruction: "Enter entry details, add-ons completed, exit terms and returns" },
      { label: "Processing", instruction: "Claude drafts a full exit memo for IC records and LP reporting" },
      { label: "Output", instruction: "Exit memo with returns attribution and lessons learned" },
    ],
    prompt: `You are a senior PE professional drafting an exit memo for LP reporting on a completed roll-up investment.

1. **Transaction Overview** — Platform name, entry/exit dates, hold period, exit type, buyer, # add-ons
2. **Investment Thesis at Entry** — Original roll-up thesis, sector rationale
3. **The Roll-Up Story** — Platform at entry → add-ons list → platform at exit
4. **Financial Returns** — Entry / Exit / Returns (Gross MoM, IRR, Net MoM, IRR) / Attribution
5. **Thesis Scorecard** — Each original thesis point: ✅ Achieved / ⚠️ Partial / ❌ Did Not Materialise
6. **What Worked** — Top 5 value creation drivers
7. **What We'd Do Differently** — Honest lessons
8. **Key People** — Deal team, operating partners, management
9. **LP Communication Points** — 3–5 key messages

DEAL INFORMATION:
{{INPUT}}`,
    inputLabel: "Enter deal details and returns",
    inputPlaceholder: "Platform: Southwest HVAC Services\nEntry: March 2021, $3.8M equity, 5x EBITDA\nAdd-ons: 4 completed (2022–2024), $6.2M additional equity\nExit: January 2025, strategic sale\nExit EV: $28M (~10x combined EBITDA $2.8M)\nTotal equity: $10M invested, $22M proceeds",
  },
];

const categoryColors = {
  "Deal Sourcing":        { bg: "#0A1628", accent: "#C9A84C", light: "#1a2840" },
  "Deal Execution":       { bg: "#1a0a28", accent: "#9B6FCC", light: "#2a1a40" },
  "Due Diligence":        { bg: "#0a2010", accent: "#4CAF7A", light: "#1a3020" },
  "Investment Committee": { bg: "#280a0a", accent: "#CC4C4C", light: "#401a1a" },
  "Portfolio Management": { bg: "#0a1e28", accent: "#4C9BCC", light: "#1a2e40" },
  "LP Relations":         { bg: "#1e280a", accent: "#8FCC4C", light: "#2a3a1a" },
  "Exit & Realisation":   { bg: "#1e1a0a", accent: "#CC9B4C", light: "#302a1a" },
};

async function runAgentLoop(userPrompt, onStatusUpdate) {
  const messages = [{ role: "user", content: userPrompt }];
  const tools = [{ type: "web_search_20250305", name: "web_search" }];
  let iterations = 0;
  const MAX_ITER = 8;

  while (iterations < MAX_ITER) {
    iterations++;
    onStatusUpdate(`Searching… (pass ${iterations})`);
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4000, tools, messages }),
    });
    const data = await res.json();
    if (!data.content) throw new Error(data.error?.message || "API error");
    const textBlocks = data.content.filter(b => b.type === "text");
    const toolBlocks = data.content.filter(b => b.type === "tool_use");
    if (toolBlocks.length === 0 || data.stop_reason === "end_turn") {
      return textBlocks.map(b => b.text).join("\n");
    }
    messages.push({ role: "assistant", content: data.content });
    const toolResults = toolBlocks.map(tb => ({
      type: "tool_result",
      tool_use_id: tb.id,
      content: tb.input ? `Search executed for: ${JSON.stringify(tb.input)}` : "Search completed",
    }));
    messages.push({ role: "user", content: toolResults });
  }
  const lastRes = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4000, messages }),
  });
  const lastData = await lastRes.json();
  return lastData.content?.filter(b => b.type === "text").map(b => b.text).join("\n") || "No output.";
}

// ── File upload component ─────────────────────────────────────────
function FileUploadZone({ onFileReady, colors }) {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const inputRef = useRef(null);

  const ACCEPTED = ["application/pdf", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
  const ACCEPTED_EXT = [".pdf", ".xls", ".xlsx", ".csv"];

  const processFile = (file) => {
    setFileError("");
    const isAccepted = ACCEPTED.includes(file.type) || ACCEPTED_EXT.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!isAccepted) {
      setFileError("Please upload a PDF or Excel file (.pdf, .xlsx, .xls, .csv)");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setFileError("File too large — maximum 20MB");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(",")[1];
      const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      onFileReady({ base64, isPDF, name: file.name, type: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 10, letterSpacing: 2, color: "#8a9aaa", textTransform: "uppercase", marginBottom: 8 }}>
        Upload CIM File (PDF or Excel)
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? colors.accent : fileName ? colors.accent + "88" : "#2e3a4a"}`,
          borderRadius: 10,
          padding: "32px 24px",
          textAlign: "center",
          cursor: "pointer",
          background: dragOver ? `${colors.accent}08` : fileName ? `${colors.accent}05` : "#0a1020",
          transition: "all 0.2s",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.xlsx,.xls,.csv"
          style={{ display: "none" }}
          onChange={(e) => { if (e.target.files[0]) processFile(e.target.files[0]); }}
        />
        {fileName ? (
          <div>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
            <p style={{ margin: "0 0 4px", fontSize: 13, color: colors.accent, fontWeight: "bold" }}>{fileName}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#5a6a7a" }}>Click to replace</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⬆️</div>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#c8c0b0" }}>Drop your CIM here or click to browse</p>
            <p style={{ margin: 0, fontSize: 11, color: "#4a5a6a" }}>Accepts PDF, Excel (.xlsx, .xls), CSV — max 20MB</p>
          </div>
        )}
      </div>
      {fileError && <p style={{ margin: "8px 0 0", fontSize: 11, color: "#CC4C4C" }}>{fileError}</p>}
    </div>
  );
}

export default function PEWorkflowLibrary() {
  const [selected, setSelected]       = useState(null);
  const [input, setInput]             = useState("");
  const [fileData, setFileData]       = useState(null);
  const [output, setOutput]           = useState("");
  const [loading, setLoading]         = useState(false);
  const [activeStep, setActiveStep]   = useState(0);
  const [filter, setFilter]           = useState("All");
  const [copied, setCopied]           = useState(false);
  const [agentStatus, setAgentStatus] = useState("");

  const categories = ["All", ...Array.from(new Set(workflows.map(w => w.category)))];
  const filtered   = filter === "All" ? workflows : workflows.filter(w => w.category === filter);
  const agentWorkflows = workflows.filter(w => w.useAgent).length;

  const runWorkflow = async () => {
    const isFileBased = selected.useFileUpload;
    if (isFileBased && !fileData) return;
    if (!isFileBased && !input.trim()) return;

    setLoading(true);
    setOutput("");
    setActiveStep(1);
    setAgentStatus("");

    try {
      let text;

      if (isFileBased && fileData) {
        // PDF upload path — send document to Claude
        const messages = fileData.isPDF
          ? [{
              role: "user",
              content: [
                {
                  type: "document",
                  source: { type: "base64", media_type: "application/pdf", data: fileData.base64 },
                },
                { type: "text", text: selected.prompt },
              ],
            }]
          : [{
              role: "user",
              content: `The user has uploaded a file named "${fileData.name}". Unfortunately Excel files cannot be read directly — please inform the user to save the file as PDF or copy/paste the key financial data as text instead.\n\n${selected.prompt}`,
            }];

        const res = await fetch("/api/claude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4000, messages }),
        });
        const data = await res.json();
        text = data.content?.map(b => b.text || "").join("") || "No output received.";

      } else if (selected.useAgent) {
        const finalPrompt = selected.prompt.replace("{{INPUT}}", input);
        setAgentStatus("Initialising web search agent…");
        text = await runAgentLoop(finalPrompt, (status) => setAgentStatus(status));
        setAgentStatus("Analysis complete");

      } else {
        const finalPrompt = selected.prompt.replace("{{INPUT}}", input);
        const res = await fetch("/api/claude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4000,
            messages: [{ role: "user", content: finalPrompt }],
          }),
        });
        const data = await res.json();
        text = data.content?.map(b => b.text || "").join("") || "No output received.";
      }

      setOutput(text);
      setActiveStep(2);
    } catch (e) {
      setOutput(`Error: ${e.message}`);
    }
    setLoading(false);
  };

  const openWorkflow = (w) => {
    setSelected(w);
    setInput(""); setOutput(""); setActiveStep(0);
    setLoading(false); setCopied(false); setAgentStatus("");
    setFileData(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colors = selected ? categoryColors[selected.category] : null;
  const canRun = selected?.useFileUpload ? !!fileData : !!input.trim();

  return (
    <div style={{ fontFamily: "'Georgia','Palatino Linotype',serif", background: "#07090f", minHeight: "100vh", color: "#e8e0d0", width: "100%", boxSizing: "border-box" }}>

      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(135deg,#07090f 0%,#0d1420 60%,#07090f 100%)", borderBottom: "1px solid #1e2a3a", padding: "28px 48px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 20% 50%,rgba(201,168,76,0.06) 0%,transparent 60%),radial-gradient(ellipse at 80% 50%,rgba(74,139,201,0.04) 0%,transparent 60%)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 10, letterSpacing: 5, color: "#C9A84C", textTransform: "uppercase" }}>Claude · Workflow Library</p>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: "normal", color: "#f0e8d8" }}>PE Roll-Up Toolkit</h1>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#7a8a9a", fontStyle: "italic" }}>Standardised AI workflows for $1M–$50M roll-up acquisitions</p>
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: 11, color: "#5a6a7a" }}>
            <span><span style={{ color: "#C9A84C", fontWeight: "bold" }}>{workflows.length}</span> workflows</span>
            <span><span style={{ color: "#4CAF7A", fontWeight: "bold" }}>{agentWorkflows}</span> with live search</span>
            <span><span style={{ color: "#C9A84C", fontWeight: "bold" }}>{categories.length - 1}</span> categories</span>
          </div>
        </div>
      </div>

      {selected ? (
        /* ══ RUNNER — full width ══ */
        <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", padding: "32px 48px", boxSizing: "border-box" }}>
          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#C9A84C", cursor: "pointer", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", padding: 0, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>← Back to Library</button>

          {/* two-column layout: left = input, right = output */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}>

            {/* LEFT COLUMN */}
            <div>
              {/* header card */}
              <div style={{ background: `linear-gradient(135deg,${colors.bg} 0%,${colors.light} 100%)`, border: `1px solid ${colors.accent}33`, borderRadius: 12, padding: "24px 28px", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <span style={{ fontSize: 28 }}>{selected.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <p style={{ margin: 0, fontSize: 10, letterSpacing: 3, color: colors.accent, textTransform: "uppercase" }}>{selected.category}</p>
                      {selected.useAgent && (
                        <span style={{ fontSize: 8, background: "#0a2810", border: "1px solid #4CAF7A55", color: "#4CAF7A", borderRadius: 4, padding: "2px 7px", letterSpacing: 1 }}>⚡ {selected.agentBadge}</span>
                      )}
                    </div>
                    <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: "normal", color: "#f0e8d8" }}>{selected.title}</h2>
                    <p style={{ margin: 0, fontSize: 12, color: "#8a9aaa", lineHeight: 1.6 }}>{selected.description}</p>
                  </div>
                  <div style={{ background: `${colors.accent}18`, border: `1px solid ${colors.accent}33`, borderRadius: 6, padding: "5px 10px", fontSize: 10, color: colors.accent, whiteSpace: "nowrap" }}>⏱ {selected.estimatedTime}</div>
                </div>

                {/* steps */}
                <div style={{ display: "flex", marginTop: 20 }}>
                  {selected.steps.map((step, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", alignItems: "center" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontFamily: "monospace", fontWeight: "bold", background: activeStep >= i ? colors.accent : "#1e2a3a", color: activeStep >= i ? "#07090f" : "#4a5a6a", transition: "all 0.3s", flexShrink: 0 }}>
                            {activeStep > i ? "✓" : i + 1}
                          </div>
                          <span style={{ fontSize: 9, fontWeight: "bold", color: activeStep >= i ? colors.accent : "#4a5a6a", letterSpacing: 1, textTransform: "uppercase" }}>{step.label}</span>
                        </div>
                        <p style={{ margin: "4px 0 0 27px", fontSize: 9, color: "#5a6a7a", lineHeight: 1.5 }}>{step.instruction}</p>
                      </div>
                      {i < selected.steps.length - 1 && <div style={{ width: 16, height: 1, background: activeStep > i ? colors.accent : "#1e2a3a", margin: "0 3px -14px", flexShrink: 0 }} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* agent notice */}
              {selected.useAgent && (
                <div style={{ background: "#0a1e10", border: "1px solid #4CAF7A44", borderRadius: 8, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>⚡</span>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: "bold", color: "#4CAF7A", letterSpacing: 1 }}>LIVE WEB SEARCH AGENT</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#5a8a6a", lineHeight: 1.5 }}>This workflow uses an AI agent that actively searches the web in real time. Results are live and current. Takes 3–5 minutes. Do not close this window while it runs.</p>
                  </div>
                </div>
              )}

              {/* input area */}
              {selected.useFileUpload ? (
                <FileUploadZone onFileReady={setFileData} colors={colors} />
              ) : (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 10, letterSpacing: 2, color: "#8a9aaa", textTransform: "uppercase", marginBottom: 8 }}>{selected.inputLabel}</label>
                  <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={selected.inputPlaceholder} rows={10}
                    style={{ width: "100%", boxSizing: "border-box", background: "#0d1420", border: `1px solid ${input ? colors.accent + "66" : "#1e2a3a"}`, borderRadius: 8, padding: "14px", color: "#d0c8b8", fontSize: 12, fontFamily: "'Georgia',serif", lineHeight: 1.7, resize: "vertical", outline: "none", transition: "border-color 0.2s" }} />
                </div>
              )}

              <button onClick={runWorkflow} disabled={loading || !canRun}
                style={{ background: loading || !canRun ? "#1e2a3a" : `linear-gradient(135deg,${colors.accent} 0%,${colors.accent}cc 100%)`, border: "none", borderRadius: 8, padding: "13px 32px", color: loading || !canRun ? "#3a4a5a" : "#07090f", fontSize: 12, fontWeight: "bold", letterSpacing: 1, textTransform: "uppercase", cursor: loading || !canRun ? "not-allowed" : "pointer", transition: "all 0.2s", width: "100%" }}>
                {loading ? (selected.useAgent ? `⚡ ${agentStatus || "Agent running…"}` : "Running…") : `Run ${selected.title} →`}
              </button>
            </div>

            {/* RIGHT COLUMN — output */}
            <div>
              <div style={{ background: "#0a1020", border: `1px solid ${colors.accent}44`, borderRadius: 12, overflow: "hidden", minHeight: 400 }}>
                <div style={{ background: `${colors.accent}14`, borderBottom: `1px solid ${colors.accent}33`, padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: loading ? "#f0a030" : output ? "#4CAF7A" : "#2a3a4a", animation: loading ? "pulse 1s infinite" : "none" }} />
                  <span style={{ fontSize: 10, letterSpacing: 2, color: colors.accent, textTransform: "uppercase", flex: 1 }}>
                    {loading ? (selected.useAgent ? `⚡ ${agentStatus}` : "Claude is working…") : output ? "Output — Review before use in live processes" : "Output will appear here"}
                  </span>
                </div>
                <div style={{ padding: "20px", maxHeight: 640, overflowY: "auto" }}>
                  {loading
                    ? <div style={{ color: "#4a5a6a", fontSize: 12, fontStyle: "italic" }}>{selected.useAgent ? `Agent is searching the web… ${agentStatus}` : "Generating output…"}</div>
                    : output
                      ? <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 12, lineHeight: 1.8, color: "#c8c0b0", fontFamily: "'Georgia',serif" }}>{output}</pre>
                      : <div style={{ color: "#2a3a4a", fontSize: 12, fontStyle: "italic", paddingTop: 40, textAlign: "center" }}>
                          <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>{selected.icon}</div>
                          <p style={{ margin: 0 }}>{selected.useFileUpload ? "Upload a CIM file and click Run to generate your summary" : "Fill in the input and click Run to generate output"}</p>
                        </div>
                  }
                </div>
                {output && (
                  <div style={{ padding: "10px 18px", borderTop: `1px solid ${colors.accent}22`, display: "flex", gap: 10 }}>
                    <button onClick={handleCopy} style={{ background: copied ? "#1a3a1a" : "#1e2a3a", border: `1px solid ${copied ? "#4CAF7A" : "#2e3a4a"}`, borderRadius: 6, padding: "7px 14px", color: copied ? "#4CAF7A" : "#8a9aaa", fontSize: 10, cursor: "pointer", letterSpacing: 1, textTransform: "uppercase", transition: "all 0.2s" }}>
                      {copied ? "✓ Copied" : "Copy Output"}
                    </button>
                    <button onClick={() => { setOutput(""); setInput(""); setActiveStep(0); setAgentStatus(""); setFileData(null); }} style={{ background: "none", border: "1px solid #2e3a4a", borderRadius: 6, padding: "7px 14px", color: "#5a6a7a", fontSize: 10, cursor: "pointer", letterSpacing: 1, textTransform: "uppercase" }}>Reset</button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      ) : (
        /* ══ GRID — full width ══ */
        <div style={{ width: "100%", padding: "28px 48px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} style={{ background: filter === cat ? "#C9A84C" : "#0d1420", border: `1px solid ${filter === cat ? "#C9A84C" : "#1e2a3a"}`, borderRadius: 20, padding: "6px 14px", color: filter === cat ? "#07090f" : "#6a7a8a", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>{cat}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
            {filtered.map(w => {
              const c = categoryColors[w.category];
              return (
                <div key={w.id} onClick={() => openWorkflow(w)}
                  style={{ background: `linear-gradient(145deg,${c.bg} 0%,${c.light} 100%)`, border: `1px solid ${c.accent}22`, borderRadius: 12, padding: "22px", cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
                  onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${c.accent}66`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${c.accent}22`; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ position: "absolute", top: -16, right: -16, fontSize: 72, opacity: 0.04, pointerEvents: "none", userSelect: "none" }}>{w.icon}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <span style={{ fontSize: 22 }}>{w.icon}</span>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {w.useAgent && <span style={{ fontSize: 8, background: "#0a2810", border: "1px solid #4CAF7A55", color: "#4CAF7A", borderRadius: 4, padding: "2px 6px", letterSpacing: 0.5 }}>⚡ LIVE</span>}
                      {w.useFileUpload && <span style={{ fontSize: 8, background: "#0a1828", border: "1px solid #4C9BCC55", color: "#4C9BCC", borderRadius: 4, padding: "2px 6px", letterSpacing: 0.5 }}>📎 PDF</span>}
                      <span style={{ fontSize: 9, color: c.accent, background: `${c.accent}18`, border: `1px solid ${c.accent}33`, borderRadius: 4, padding: "3px 7px", letterSpacing: 0.5 }}>{w.estimatedTime}</span>
                    </div>
                  </div>
                  <p style={{ margin: "0 0 3px", fontSize: 9, letterSpacing: 3, color: c.accent, textTransform: "uppercase" }}>{w.category}</p>
                  <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: "normal", color: "#f0e8d8" }}>{w.title}</h3>
                  <p style={{ margin: "0 0 16px", fontSize: 11, color: "#6a7a8a", lineHeight: 1.6 }}>{w.description}</p>
                  <div style={{ display: "flex", gap: 5 }}>
                    {w.steps.map((s, i) => (
                      <div key={i} style={{ flex: 1, background: `${c.accent}12`, borderRadius: 4, padding: "4px 0", textAlign: "center", fontSize: 8, color: c.accent, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
                    ))}
                  </div>
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${c.accent}18`, fontSize: 10, color: c.accent, letterSpacing: 1, textTransform: "uppercase" }}>Open workflow →</div>
                </div>
              );
            })}
          </div>
          <p style={{ textAlign: "center", marginTop: 44, fontSize: 10, color: "#2a3a4a", letterSpacing: 1 }}>ALL OUTPUTS ARE AI-GENERATED — REVIEW CAREFULLY BEFORE USE IN LIVE DEAL PROCESSES</p>
        </div>
      )}

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#07090f}
        ::-webkit-scrollbar-thumb{background:#1e2a3a;border-radius:3px}
        html, body, #root { width: 100%; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}
