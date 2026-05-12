# UAT Sign-off Template

**Video Walkthrough:** [Insert Link to Loom/Screen Recording Here]

---

## 1. Release Information

| Property | Details |
| :--- | :--- |
| **Project Name** | [Insert Project Name] |
| **Release / Sprint** | [e.g., Sprint 4 / v1.2.0] |
| **Date of Testing** | [YYYY-MM-DD] |
| **Environment** | Staging / UAT |

## 2. Tested Epics / Features

> List the major features and user stories covered in this UAT cycle. Link to specific GitHub Issues/PRs if possible.

1. **[Feature 1]:** [Brief description or Issue #]
2. **[Feature 2]:** [Brief description or Issue #]
3. **[Feature 3]:** [Brief description or Issue #]

---

## 3. Acceptance Criteria Verification

| Feature / Issue # | AC Description | Status (Pass/Fail) | Notes / Bug ID |
| :--- | :--- | :--- | :--- |
| #102 - Login | User can login with valid credentials | Pass | |
| #102 - Login | User sees error on invalid password | Pass | |
| #105 - Dashboard | Metrics load within 2 seconds | Fail | #110 created for slow query |

---

## 4. Known Issues & Defects

> Document any bugs or regressions found during UAT that are accepted to go into production (Known Issues) or block the release.

| Bug ID | Description | Severity | Target Fix (Sprint/Release) | Blocker? |
| :--- | :--- | :--- | :--- | :--- |
| #110 | Dashboard metric slow query | Medium | Next Sprint | No |

---

## 5. Sign-off

By signing below, the stakeholders agree that the features tested meet the business requirements and are approved for deployment to the Production environment, subject to the resolution of any blocking defects listed above.

| Role | Name | Signature / Approval Status | Date |
| :--- | :--- | :--- | :--- |
| **Product Owner / Client** | | | |
| **QA Lead** | | | |
| **Tech Lead** | | | |
