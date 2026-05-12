# Runbooks

Operational runbooks for common procedures, incident response, and maintenance tasks.

## Purpose

Runbooks provide step-by-step instructions for operational tasks so that any team member can execute them consistently and reliably—especially during incidents when stress is high.

## How to Use

1. Create a new runbook using the naming convention: `RB_[Category]_[Short_Title].md`
2. Follow the template structure in each runbook
3. Keep runbooks up to date as infrastructure and processes change
4. Review runbooks quarterly to ensure accuracy

## Suggested Runbooks

| Runbook | Description | Priority |
|---------|-------------|----------|
| `RB_Deploy_Rollback.md` | How to roll back a failed deployment | High |
| `RB_Database_Backup_Restore.md` | Database backup and restore procedures | High |
| `RB_Incident_Response.md` | Step-by-step incident response process | High |
| `RB_Scaling_Services.md` | How to scale services up or down | Medium |
| `RB_Certificate_Renewal.md` | SSL/TLS certificate renewal process | Medium |
| `RB_New_Environment_Setup.md` | Setting up a new deployment environment | Medium |
| `RB_Dependency_Update.md` | Process for updating dependencies | Low |
| `RB_Log_Investigation.md` | How to investigate issues using logs | Low |

## Runbook Template

Each runbook should include:

1. **Title & Purpose** — What this runbook is for
2. **Prerequisites** — What access, tools, or knowledge is required
3. **Steps** — Numbered step-by-step instructions
4. **Verification** — How to confirm the procedure was successful
5. **Rollback** — How to undo changes if something goes wrong
6. **Contacts** — Who to escalate to if the runbook doesn't resolve the issue
