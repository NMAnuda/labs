# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- Agile Delivery Guide (`docs/09_Agile_Delivery_Guide.md`)
- UAT Signoff Template (`docs/11_UAT_Signoff_Template.md`)
- Agile Backlog Templates (`docs/agile/`)
- GitHub CI workflows, Dependabot config, and CODEOWNERS.
- Epic Issue Template (`.github/ISSUE_TEMPLATE/epic.md`)
- Boilerplate `docker-compose.yml` for local development.
- Infrastructure directory structure (`terraform`, `docker`, `kubernetes`, `ci-cd`) with `.gitkeep`.
- Boilerplate GCP Terraform configuration (`infrastructure/terraform/main.tf`).
- GCP Cloud Build CI/CD boilerplate (`cloudbuild.yaml`).
- Root `package.json` for repository-level tooling (Husky, lint-staged, commitlint).
- Commit linting configuration (`.commitlintrc.json`).
- Root `Makefile` for unified task execution.
- Code quality formatting configurations (`.editorconfig`, `.prettierrc`).
- ADR Index generator script (`scripts/utils/generate_adr_index.sh`).
- Automated Template Sync script (`scripts/utils/sync_master_to_projects.sh`) to push governance updates to ongoing repositories.
- GitHub Actions workflow (`sync-template.yml`) to automatically run the sync script on pushes to `main`.

### Changed
- 

### Fixed
- 

### Removed
- Removed AI & Vibe Coding Guide template (Consolidated into `.Agents/` knowledge base).

---

## [0.1.0] — YYYY-MM-DD

### Added
- Initial project setup from `madlabs-saas-template`
- Business Requirements Document (BRD) template
- Product Requirements Document (PRD) template
- Functional Specification Document (FSD) template
- Software Design Document (SDD) template
- API Documentation template
- Deployment Guide template
- Test Strategy template
- Security & Compliance template
- Architecture Decision Records (ADR) folder and template
- Runbooks folder and guide
- Onboarding documentation
- Meeting notes folder and template
- Scripts folder and conventions
- Infrastructure folder and guide
- GitHub Issue and Pull Request templates
- Contributing guidelines
- Security policy

---

<!--
## Template for new releases:

## [X.Y.Z] — YYYY-MM-DD

### Added
- New features

### Changed
- Changes to existing features

### Deprecated
- Features that will be removed in upcoming releases

### Removed
- Features that have been removed

### Fixed
- Bug fixes

### Security
- Vulnerability fixes
-->
