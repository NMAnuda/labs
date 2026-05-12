#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# Script: sync_master_to_projects.sh
# Purpose: Pushes updates from the master template to ongoing projects via PR.
# Usage: ./scripts/utils/sync_master_to_projects.sh
# Requirements: GitHub CLI (gh) installed and authenticated.
# ──────────────────────────────────────────────────────────────────────────────

# Array of target repositories (Organization/RepoName)
# Update this list with your actual MADLABS projects
TARGET_REPOS=(
  "Mad-marketing-git/HR"
  "Mad-marketing-git/FinTrack"
  "Mad-marketing-git/EduNexus"
  "Mad-marketing-git/Microsite-Game"
  # Add more repositories here
)

# Files and directories to sync (strict governance files)
# Be careful not to sync files that are heavily customized per project (e.g. .env)
SYNC_PATHS=(
  ".Agents"
  ".github/ISSUE_TEMPLATE"
  ".github/PULL_REQUEST_TEMPLATE.md"
  ".github/copilot-instructions.md"
  ".cursorrules"
  ".editorconfig"
  ".prettierrc"
  "MADLABS_OPERATIONS.md"
  "docs"
)

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed. Please install it first: https://cli.github.com/"
    exit 1
fi

# In CI, gh expects GH_TOKEN. Use GITHUB_TOKEN as a fallback if GH_TOKEN is unset.
if [ -z "${GH_TOKEN:-}" ] && [ -n "${GITHUB_TOKEN:-}" ]; then
  export GH_TOKEN="$GITHUB_TOKEN"
fi

# Ensure user is authenticated (checks GH_TOKEN env var first, then local auth)
if ! gh auth status &> /dev/null; then
    if [ -n "${CI:-}" ]; then
      echo "❌ Error: GitHub CLI is not authenticated in CI."
      echo "   Set GH_TOKEN to a token with access to all TARGET_REPOS."
      echo "   For this repo, configure the Actions secret: TEMPLATE_SYNC_PAT"
    else
      echo "❌ Error: Not authenticated with GitHub CLI. Set GH_TOKEN or run 'gh auth login' first."
    fi
    exit 1
fi

# Ensure git user is configured (crucial for CI environments)
if ! git config --global user.name > /dev/null; then
  git config --global user.name "MADLABS Template Bot"
  git config --global user.email "bot@madlabs.lk"
fi

TEMPLATE_DIR=$(pwd)
DATE_STAMP=$(date +%Y-%m-%d)
BRANCH_NAME="chore/sync-template-$DATE_STAMP"
TEMP_DIR=$(mktemp -d)

echo "🚀 Starting Template Sync Process..."
echo "Template Directory: $TEMPLATE_DIR"
echo "Temporary Working Directory: $TEMP_DIR"

for REPO in "${TARGET_REPOS[@]}"; do
  echo "────────────────────────────────────────────────────────────────────────"
  echo "🔄 Processing Repository: $REPO"
  
  REPO_DIR="$TEMP_DIR/$(basename $REPO)"
  
  # 1. Clone the target repository
  echo "   [1/5] Cloning $REPO..."
  # gh repo clone handles authentication automatically
  gh repo clone "$REPO" "$REPO_DIR" -- --quiet || {
      echo "   ❌ Failed to clone $REPO. Skipping."
      continue
  }
  
  cd "$REPO_DIR"
  
  # 2. Check out a new branch
  echo "   [2/5] Creating branch: $BRANCH_NAME..."
  git checkout -b "$BRANCH_NAME" --quiet

  # 3. Copy files from template
  echo "   [3/5] Syncing standard files and folders..."
  for PATH_TO_SYNC in "${SYNC_PATHS[@]}"; do
    if [ -e "$TEMPLATE_DIR/$PATH_TO_SYNC" ]; then
      # Ensure parent directory exists in target
      mkdir -p "$(dirname "$PATH_TO_SYNC")"
      
      if [ -d "$TEMPLATE_DIR/$PATH_TO_SYNC" ]; then
        # For directories, sync content to avoid double nesting
        # Using /. ensures the content is copied into the target directory
        mkdir -p "$PATH_TO_SYNC"
        cp -a "$TEMPLATE_DIR/$PATH_TO_SYNC/." "$PATH_TO_SYNC/"
      else
        # For files, direct copy
        cp -a "$TEMPLATE_DIR/$PATH_TO_SYNC" "$PATH_TO_SYNC"
      fi
    else
      echo "   ⚠️ Warning: $PATH_TO_SYNC not found in template. Skipping."
    fi
  done

  # 4. Check for changes
  if [ -z "$(git status --porcelain)" ]; then
    echo "   [4/5] No changes detected for $REPO. Skipping."
    cd "$TEMPLATE_DIR"
    continue
  fi

  # 5. Commit, Push, and PR
  echo "   [4/5] Committing and pushing changes..."
  git add .
  git commit -m "chore(template): sync latest governance and standards from master template" --quiet
  
  # Ensure git uses the gh CLI for authentication to fix the "could not read Username" error in CI
  gh auth setup-git
  
  git push origin "$BRANCH_NAME" --force --quiet

  echo "   [5/5] Creating Pull Request..."
  # Check if PR already exists
  EXISTING_PR=$(gh pr list --head "$BRANCH_NAME" --json url --jq '.[0].url')
  
  if [ -n "$EXISTING_PR" ]; then
    echo "   ⚠️ PR already exists: $EXISTING_PR"
  else
    # Defaulting target branch to main, change to 'develop' or others if necessary based on the repo
    PR_URL=$(gh pr create \
      --title "chore: Sync Master Template Updates ($DATE_STAMP)" \
      --body "This PR automatically syncs the latest governance, documentation, and tooling updates from the \`madlabs-master-template\`. Please review the changes to ensure they do not conflict with project-specific overrides." \
      --base main) || {
          echo "   ❌ Failed to create PR."
      }
      
    if [ -n "${PR_URL:-}" ]; then
      echo "   ✅ PR Created: $PR_URL"
    fi
  fi
  
  # Return to template directory for the next iteration
  cd "$TEMPLATE_DIR"
done

# Cleanup
rm -rf "$TEMP_DIR"
echo "────────────────────────────────────────────────────────────────────────"
echo "🎉 Sync Complete! All target repositories have been processed."
