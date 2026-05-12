# Contributing to This Project

Thank you for your interest in contributing! This document outlines the process and standards for contributing to this project.

**Video Walkthrough:** [Insert Link to Loom/Screen Recording Here]

---

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Code Style](#code-style)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)

---

## Getting Started

1. **Fork** the repository (or create a branch if you have write access)
2. **Clone** your fork locally
3. **Set up** your development environment:
   ```bash
   cp .env.example .env
   # Fill in the values in .env
   ```
4. **Read the documentation** in `docs/` to understand the project context

---

## Development Workflow: TDD-First (MANDATORY)

MADLABS operates on a strict **Test-Driven Development (TDD)** basis. No implementation code is to be written without a corresponding failing test.

### The TDD Cycle:
1. **RED:** Write a small, failing unit or integration test that reflects the **Acceptance Criteria**.
2. **GREEN:** Write the minimum amount of code required to make the test pass. Do not "over-engineer" here.
3. **REFACTOR:** Clean up the code, remove duplication, and ensure it follows **Clean Architecture** patterns while keeping the test passing.

### Testing Requirements:
- **Unit Tests:** For all individual business logic, calculations, and utility functions.
- **Integration Tests:** For all API endpoints and database operations (scoping `companyId`).
- **End-to-End Tests:** For critical "Happy Path" user journeys only.

---

## Branch Naming

Use the following prefixes for branches:

| Prefix      | Purpose                         | Example                        |
|-------------|---------------------------------|--------------------------------|
| `feature/`  | New features                    | `feature/user-authentication`  |
| `bugfix/`   | Bug fixes                       | `bugfix/login-redirect-loop`   |
| `hotfix/`   | Urgent production fixes         | `hotfix/payment-crash`         |
| `docs/`     | Documentation changes           | `docs/update-api-guide`        |
| `refactor/` | Code refactoring (no new features) | `refactor/extract-service`  |
| `test/`     | Adding or updating tests        | `test/auth-integration-tests`  |
| `chore/`    | Maintenance and tooling changes | `chore/update-dependencies`    |

---

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type       | Description                     |
|------------|---------------------------------|
| `feat`     | A new feature                   |
| `fix`      | A bug fix                       |
| `docs`     | Documentation changes           |
| `style`    | Formatting, whitespace changes  |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test`     | Adding or updating tests        |
| `chore`    | Maintenance, dependencies, tooling |
| `ci`       | CI/CD configuration changes     |

### Examples

```
feat(auth): add JWT refresh token support
fix(api): handle null response from payment gateway
docs(readme): update getting started instructions
```

---

## Pull Requests

1. Use the [Pull Request Template](/.github/PULL_REQUEST_TEMPLATE.md)
2. Include a **Video Walkthrough** (Loom or screen recording) for significant changes
3. Link the related Issue (e.g., `Fixes #42`)
4. Ensure the PR checklist is complete before requesting review
5. Request review from at least one team member
6. Address all review comments before merging

### PR Size Guidelines

| Size  | Lines Changed | Guideline                        |
|-------|---------------|----------------------------------|
| Small | < 100         | Ideal — quick to review          |
| Medium| 100 – 300     | Acceptable — split if possible   |
| Large | 300+          | Should be split into smaller PRs |

---

## Code Style

- Follow the established patterns in the codebase
- Use linting tools configured for the project
- Write self-documenting code with clear naming
- Add comments only where the **why** is not obvious from the code
- Keep functions and methods focused (single responsibility)

---

## Documentation

- **All documents** must include a **Video Walkthrough** link
- Update relevant `docs/` files when making changes that affect behavior
- Add Architecture Decision Records for significant technical decisions (see `docs/adr/`)
- Keep the README and other guides current

---

## Issue Reporting

Use the appropriate GitHub Issue template:

- [Bug Report](/.github/ISSUE_TEMPLATE/bug_report.md) — for bugs and defects
- [Feature Request](/.github/ISSUE_TEMPLATE/feature_request.md) — for new feature suggestions

### Issue Labels

| Label          | Purpose                    |
|----------------|----------------------------|
| `bug`          | Something isn't working    |
| `enhancement`  | New feature or improvement |
| `documentation`| Documentation updates      |
| `good-first-issue` | Suitable for new contributors |
| `help-wanted`  | Extra attention is needed  |
| `priority:high`| Urgent issue               |

---

## Questions?

If you have questions about contributing, reach out to the Tech Lead or open a Discussion on the repository.
