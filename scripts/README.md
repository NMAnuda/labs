# Scripts

Utility and automation scripts for development, deployment, and maintenance tasks.

## Purpose

This directory contains scripts that automate common tasks across the project lifecycle. All scripts should be well-documented with usage instructions and examples.

## Organization

```
scripts/
├── setup/          # Environment and project setup scripts
├── build/          # Build and packaging scripts
├── deploy/         # Deployment automation scripts
├── db/             # Database migration and seed scripts
├── ci/             # CI/CD helper scripts
└── utils/          # General utility scripts
```

## Conventions

1. **Add a shebang line** to shell scripts (e.g., `#!/usr/bin/env bash`)
2. **Use `set -euo pipefail`** at the top of Bash scripts for safer execution
3. **Include a usage comment** at the top of each script describing what it does
4. **Make scripts executable** with `chmod +x script.sh`
5. **Keep scripts idempotent** — running them multiple times should produce the same result
6. **Never hardcode secrets** — use environment variables from `.env`

## Example Script Header

```bash
#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# Script: setup_dev.sh
# Purpose: Set up the local development environment
# Usage: ./scripts/setup/setup_dev.sh
# ──────────────────────────────────────────────────────────────────────────────
```
