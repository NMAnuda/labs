# ------------------------------------------------------------------------------
# MADLABS GCP Boilerplate Terraform
# ------------------------------------------------------------------------------
# This is a starter template for deploying a Cloud Run service and Cloud SQL instance.
# Uncomment and modify variables according to the project needs.

/*
terraform {
  required_version = ">= 1.0.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Example: Cloud Run Service
resource "google_cloud_run_service" "api_service" {
  name     = "${var.project_name}-api"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/${var.project_name}-api:latest"
        ports {
          container_port = 8080
        }
        env {
          name  = "NODE_ENV"
          value = "production"
        }
        # Add Secret Manager refs here
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# Example: Cloud SQL PostgreSQL (Private IP)
resource "google_sql_database_instance" "db_instance" {
  name             = "${var.project_name}-db"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-f1-micro" # Update for production
    ip_configuration {
      ipv4_enabled    = false
      private_network = var.vpc_network_id
    }
  }
}
*/
