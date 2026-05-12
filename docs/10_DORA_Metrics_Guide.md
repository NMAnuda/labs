# DORA Metrics: Measuring Success at MADLABS

**Video Walkthrough:** [Insert Link to Loom/Screen Recording Here]

---

## 1. Introduction
At MADLABS, we don't measure success by "lines of code" or "number of commits." We follow the **DORA Metrics** framework—the industry standard for measuring high-performing software engineering teams.

---

## 2. The Four Key Metrics

### 1. Deployment Frequency (DF)
*How often do we successfully release to production?*
- **Target:** On-demand (multiple times per day/week).
- **Goal:** Smaller, more frequent releases reduce risk.

### 2. Lead Time for Changes (LTTC)
*How long does it take from the first commit to that code running in production?*
- **Target:** Less than 1 day for small fixes; 1 week for major features.
- **Goal:** Faster feedback loops for our clients.

### 3. Change Failure Rate (CFR)
*What percentage of our production deployments result in a failure or regression?*
- **Target:** Less than 15%.
- **Goal:** Maintain stability through TDD and automated testing.

### 4. Time to Restore Service (TTRS)
*When a production incident occurs, how long does it take us to recover?*
- **Target:** Less than 1 hour.
- **Goal:** Robust infrastructure and clear **Runbooks**.

---

## 3. How We Track Metrics (GitHub Actions)
Our **MADLABS Master Portfolio** board tracks these metrics automatically through:
1. **Ready to Done Duration:** Measuring Lead Time.
2. **Issues per Week:** Measuring Delivery Frequency.
3. **Rollback Counts:** Measuring Change Failure.

---

## 4. Why This Matters
By focusing on these metrics, we avoid "burnout" and "technical debt." We prioritize **Flow** and **Quality** over raw speed. If our Change Failure Rate is high, we stop new features and focus on **Track A (Stabilization)**.

---
*Last Updated: 2026-03-18*
*Owner: CTO / Staff PM*
