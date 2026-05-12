# Agile Delivery Guide

**Video Walkthrough:** [Insert Link to Loom/Screen Recording Here]

---

## 1. Introduction

This guide outlines the agile delivery mechanics at MADLABS. It bridges the gap between high-level Product Requirements (PRD) and daily engineering tasks.

## 2. The Backlog Structure

### 2.1 Product Backlog
The Product Backlog is a prioritized list of everything that is known to be needed in the product. It is the single source of requirements for any changes to be made.
- **Owner:** Product Manager (PM) / Business Analyst (BA)
- **Format:** Epics and high-level User Stories.
- **Location:** GitHub Projects / `docs/agile/Product_Backlog.md`

### 2.2 Sprint Backlog
The Sprint Backlog is the set of Product Backlog items selected for the Sprint, plus a plan for delivering the product Increment and realizing the Sprint Goal.
- **Owner:** The Development Team
- **Format:** Granular tasks with strict Acceptance Criteria (AC).
- **Location:** GitHub Projects / `docs/agile/Sprint_Backlog.md`

## 3. Epics and User Stories

- **Epics:** Large bodies of work that can be broken down into a number of smaller tasks (User Stories). (Use the `epic.md` GitHub issue template).
- **User Stories:** Short, simple descriptions of a feature told from the perspective of the person who desires the new capability.
  - *Format:* "As a [persona], I want to [action] so that [benefit/value]."

## 4. Estimation & Velocity

- We use **Story Points** based on the Fibonacci sequence (1, 2, 3, 5, 8, 13) to estimate complexity, effort, and risk—not just time.
- If a story is estimated at an 8 or 13, it **must** be broken down into smaller stories.
- **Velocity:** The amount of work the team can successfully complete during a Sprint, calculated by summing the Story Points of all *completed* stories.

## 5. Sprint Ceremonies

| Ceremony | Duration | Purpose |
| :--- | :--- | :--- |
| **Sprint Planning** | 2 Hours | Define the Sprint Goal and select items from the Product Backlog. |
| **Daily Standup** | 15 Mins | Quick sync: What did I do yesterday? What will I do today? Any blockers? |
| **Sprint Review** | 1 Hour | Demo the working software (Increment) to stakeholders. |
| **Retrospective** | 1 Hour | Discuss what went well, what didn't, and how to improve. |

## 6. Definition of Ready (DoR)
A User Story is "Ready" for a sprint when:
1. The story is clearly defined and understood by the team.
2. Acceptance Criteria are written in Gherkin format (Given/When/Then).
3. Dependencies are identified and resolved.
4. UI/UX designs are attached (if applicable).
5. The story has been estimated by the engineering team.

## 7. Delivery Board States

As defined in the `MADLABS_OPERATIONS.md`, tasks move through:
1. **Backlog**
2. **Ready**
3. **In Progress**
4. **QA / UAT**
5. **Done**
