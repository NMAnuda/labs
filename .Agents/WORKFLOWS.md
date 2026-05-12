# MADLABS Agent Development Workflows

All development MUST follow the **Research -> Strategy -> Execution** lifecycle.

---

## 🏗️ 1. The Research Phase (Empirical Discovery)
- **Goal:** Systematically map the codebase and validate assumptions.
- **Action:** Use `grep_search` and `glob` to understand existing patterns. 
- **Requirement:** For bug fixes, YOU MUST reproduce the failure with a test case first.

---

## 📐 2. The Strategy Phase (The Plan)
- **Goal:** Formulate a grounded plan BEFORE writing code.
- **Mandate:** For any change > 5 lines or > 1 file, use `enter_plan_mode` and get user approval.
- **Gherkin AC:** Every task must have Acceptance Criteria in **Given/When/Then** format.

---

## 🛠️ 3. The Execution Phase (TDD-First)
Iterative **Plan -> Act -> Validate** cycle:
1. **Plan:** Define the implementation approach and verification strategy.
2. **Act:** Apply targeted, surgical changes.
3. **Validate:** Run tests and standards (lint/typecheck) to confirm success.

---

## 🧪 4. TDD Protocol (The Constitution)
- **Step 1 (RED):** Write a failing test based on the Gherkin AC.
- **Step 2 (GREEN):** Implement minimum code to pass the test.
- **Step 3 (REFACTOR):** Optimize while keeping the test passing.
- **Finality:** A task is ONLY complete when Behavioral Correctness is verified and Structural Integrity is confirmed.

---
*Last Updated: 2026-03-23*
*Reference: ../MADLABS_OPERATIONS.md*
