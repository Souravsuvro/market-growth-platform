# Market Flick AI — Product Specification

## Product promise
Market Flick AI turns multi-source market, company, academic, and first-party data into traceable research, forecasts, investor narratives, and prioritized growth actions. The workflow is Insight → Evidence → Decision → Deliverable → Follow-up.

## Product areas
1. Intelligence Hub: saved markets, live signals, data freshness, watchlists, alerts, and a conversational research copilot.
2. Research Suite: market sizing; demand, competitor, geographic, historical, customer, regulatory, and literature analysis.
3. Investor Research: company profiles, bull/base/bear thesis, comparable companies, risks, milestones, and a clearly labelled evidence-based—not financial—recommendation.
4. Predictive Analysis: scenario forecasts with assumptions, confidence intervals, back-test metrics, model/version metadata, and a human-readable explanation.
5. Report Builder: reusable templates, data visualisations, inline citations, recommendation cards, branding, PDF/PPTX export, and share permissions.
6. Pitch Deck Studio: research brief → slide outline → editable deck → proposal package → share/download/send tracking.
7. Growth Command Center: opportunities ranked by impact, confidence, effort, urgency, owner, and 30/60/90-day execution horizon.

## Trust and research provenance
Every claim stores source title, publisher, URL, publication date, retrieval time, source type, excerpt, reliability tier, and citation location. Academic content must retain study design, population, endpoints, limitations, and conflicts/industry funding where available. NEJM, The BMJ, and other licensed sources are linked and cited; access-controlled full text is never copied or scraped. Predictions must show assumptions, methods, horizon, uncertainty, and last validation date. Investment outputs must include a non-advisory disclaimer and never promise returns.

## Core domain model
Workspace owns Projects. Projects own ResearchRuns, Signals, Sources, Forecasts, Reports, Recommendations, PitchDecks, Proposals, and ShareLinks. A ResearchRun produces an immutable evidence snapshot; reports and decks reference snapshot IDs so shared outputs remain reproducible.

## Integrations
Start with user-authorised Google Analytics, Search Console, Google Ads, Google Business Profile, DataForSEO, Similarweb, and uploaded CSV/XLSX. Add public metadata/literature connectors with provider-compliant access. Each connector records consent, scope, sync status, retention policy, and freshness.

## API boundaries
Research endpoints create asynchronous runs and return run IDs. Forecast endpoints require a metric, geographic scope, horizon, and scenario assumptions. Report/deck creation accepts a research snapshot and template. Sharing is permissioned, revocable, expiration-aware, and audit logged.

## Acceptance criteria
- A user can produce a cited market brief from a saved project.
- A user can compare base/bull/bear forecasts and inspect assumptions.
- A user can convert approved research into an editable report or deck without retyping data.
- A recipient can view a protected share link while the workspace can revoke it and view engagement events.
- Every AI recommendation exposes its evidence, confidence, expected impact, effort, and next action.
