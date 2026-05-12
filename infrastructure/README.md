# Infrastructure

Infrastructure as Code (IaC) and configuration files for provisioning and managing cloud resources.

## Purpose

This directory contains all infrastructure definitions, making the deployment environment reproducible, version-controlled, and auditable.

## Organization

```
infrastructure/
├── terraform/       # Terraform modules and configurations
├── docker/          # Dockerfiles and Docker Compose files
├── kubernetes/      # Kubernetes manifests (Deployments, Services, etc.)
├── ci-cd/           # CI/CD pipeline definitions (GitHub Actions, etc.)
└── scripts/         # Infrastructure-specific automation scripts
```

## Guidelines

1. **Never commit secrets** — Use secret management tools (e.g., Azure Key Vault, AWS Secrets Manager)
2. **Use variables** — Parameterize all environment-specific values
3. **Tag resources** — Apply consistent tags/labels for cost tracking and ownership
4. **Review changes** — All infrastructure changes should go through Pull Request review
5. **Document decisions** — Record significant infrastructure decisions in [Architecture Decision Records](../docs/adr/README.md)

## Environment Mapping

| Environment | Configuration Location      | Notes |
|-------------|----------------------------|-------|
| Development | `infrastructure/docker/`   | Docker Compose for local development |
| Staging     | `infrastructure/terraform/` | Terraform with staging variables |
| Production  | `infrastructure/terraform/` | Terraform with production variables |

## Getting Started

1. Ensure required CLI tools are installed (see [Deployment Guide](../docs/06_Deployment_Guide_Template.md))
2. Configure cloud provider credentials
3. Follow the environment-specific setup instructions below

### Local Development (Docker)

```bash
# Start local services
docker compose up -d

# Stop local services
docker compose down
```

### Cloud Environments (Terraform)

```bash
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Plan changes
terraform plan -var-file="environments/staging.tfvars"

# Apply changes
terraform apply -var-file="environments/staging.tfvars"
```
