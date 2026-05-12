# MADLABS MASTER Template

> **Standardized GitHub Template Repository** for all MADLABS SaaS, Web, and Utility projects.

**Video Walkthrough:** [Insert Link to Loom/Screen Recording Here]

---

## Overview

This repository is the **master template** for all new MADLABS projects—whether an ASP.NET Core backend, a Python service, or a frontend application. Every new repository should be generated from this template to ensure consistent structure, documentation, and standards across the organization.

---

## Standards & Governance

All projects at MADLABS must follow the centralized engineering and management standards located in the **[MADLABS Operations Center](https://github.com/Theekshana-Gimhan/madlabs-operations)**.

Key documents to review:
- [MADLABS Engineering Standards](https://github.com/Theekshana-Gimhan/madlabs-operations/blob/main/MADLABS_STANDARDS.md)
- [The Life of a Task](https://github.com/Theekshana-Gimhan/madlabs-operations/blob/main/LIFE_OF_A_TASK.md)
- [TDD Workflow](https://github.com/Theekshana-Gimhan/madlabs-operations/blob/main/CONTRIBUTING.md)

---

## Repository Structure

```
madlabs-saas-template/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md              # Bug report issue template
│   │   └── feature_request.md         # Feature request issue template
│   └── PULL_REQUEST_TEMPLATE.md       # Standard PR checklist
├── docs/
│   ├── 01_BRD_Template.md             # Business Requirements Document
│   ├── 02_PRD_Template.md             # Product Requirements Document
│   ├── 03_FSD_Template.md             # Functional Specification Document
│   ├── 04_SDD_Template.md             # Software Design Document
│   ├── 05_API_Documentation_Template.md  # API Documentation
│   ├── 06_Deployment_Guide_Template.md   # Deployment & Infrastructure Guide
│   ├── 07_Test_Strategy_Template.md      # Test Strategy Document
│   ├── 08_Security_Compliance_Template.md # Security & Compliance
│   ├── architecture_diagrams/         # Architecture diagrams (PNG, SVG, etc.)
│   ├── adr/                           # Architecture Decision Records
│   ├── runbooks/                      # Operational runbooks
│   ├── onboarding/                    # Team onboarding documentation
│   └── meeting_notes/                 # Sprint & meeting notes
├── src/                               # Application source code
├── tests/                             # Automated tests
├── scripts/                           # Utility & automation scripts
├── infrastructure/                    # Infrastructure as Code (Docker, Terraform, K8s)
├── .env.example                       # Environment variable reference (never commit .env)
├── .gitignore                         # Standardized ignore rules (.NET / Python / Node)
├── CHANGELOG.md                       # Project changelog
├── CONTRIBUTING.md                    # Contribution guidelines
├── SECURITY.md                        # Security vulnerability reporting policy
└── README.md                          # This file
```

---

## Getting Started

### 1. Use This Template

Click **"Use this template"** (or **"New repository"** → select `madlabs-saas-template`) to create a new repository pre-populated with this structure.

### 2. Fill in the Documentation

Work through the docs in order:

| # | Document | Purpose |
|---|----------|---------|
| 1 | `docs/01_BRD_Template.md` | Define business objectives and requirements |
| 2 | `docs/02_PRD_Template.md` | Define the product and user stories |
| 3 | `docs/03_FSD_Template.md` | Specify functional behavior in detail |
| 4 | `docs/04_SDD_Template.md` | Design the software architecture and APIs |
| 5 | `docs/05_API_Documentation_Template.md` | Document API endpoints, auth, and usage |
| 6 | `docs/06_Deployment_Guide_Template.md` | Document deployment and infrastructure |
| 7 | `docs/07_Test_Strategy_Template.md` | Define testing levels, tools, and CI gates |
| 8 | `docs/08_Security_Compliance_Template.md` | Document security policies and compliance |

> **Tip:** Every document has a **Video Walkthrough** placeholder.
 Record a short Loom or screen recording to explain your decisions—this dramatically speeds up onboarding.

### 3. Configure Your Environment

```bash
cp .env.example .env
# Fill in the values in .env — never commit this file
```

### 4. Add Your Code

Place application source code in `src/` and tests in `tests/`. See the README files in each directory for suggested organization.

---

## Contributing

1. Read the [Contributing Guidelines](CONTRIBUTING.md)
2. Fork or branch from `main`
3. Follow the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md)
4. Use [Issue Templates](.github/ISSUE_TEMPLATE/) for bug reports and feature requests
5. Keep documentation up to date alongside code changes
6. Record significant technical decisions in `docs/adr/`

---

## Standards

- All documents must include a **Video Walkthrough** link before being considered complete
- Secrets must never be committed — use `.env.example` as a reference only
- Architecture diagrams belong in `docs/architecture_diagrams/`
- Architecture decisions must be recorded in `docs/adr/`
- Operational procedures must be documented in `docs/runbooks/`
- Infrastructure changes must be reviewed via Pull Request
- The `.gitignore` covers .NET, Python, and Node.js projects out of the box
- See [SECURITY.md](SECURITY.md) for vulnerability reporting policy
- See [CHANGELOG.md](CHANGELOG.md) for release history
