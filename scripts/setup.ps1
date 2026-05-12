<#
.SYNOPSIS
    Bootstrap script for new MADLABS projects.
.DESCRIPTION
    Automates the initial setup and "Sizing" of a new repository.
.EXAMPLE
    .\scripts\setup.ps1 -ProjectName "Simpala-HR" -ProjectType "SaaS"
    .\scripts\setup.ps1 -ProjectName "MAD-Marketing-Site" -ProjectType "Web"
#>

param (
    [Parameter(Mandatory=$true)]
    [string]$ProjectName,

    [Parameter(Mandatory=$true)]
    [ValidateSet("SaaS", "Web", "Utility")]
    [string]$ProjectType
)

Write-Host "🚀 Starting MADLABS Project Bootstrap" -ForegroundColor Cyan
Write-Host "Project: $ProjectName | Type: $ProjectType" -ForegroundColor White

# 1. Environment Configuration
if (-not (Test-Path ".env")) {
    Write-Host "⚙️  Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

# 2. Sizing / Pruning Logic
Write-Host "✂️  Optimizing template for $ProjectType mode..." -ForegroundColor Yellow

if ($ProjectType -eq "Web") {
    # Remove SaaS-specific deep specs
    Remove-Item "docs/03_FSD_Template.md" -Force -ErrorAction SilentlyContinue
    Remove-Item "docs/04_SDD_Template.md" -Force -ErrorAction SilentlyContinue
    Remove-Item "docs/05_API_Documentation_Template.md" -Force -ErrorAction SilentlyContinue
} 
elseif ($ProjectType -eq "Utility") {
    # Extreme pruning for small tools
    $docsToKeep = @("01_BRD_Template.md", "07_Test_Strategy_Template.md", "08_Security_Compliance_Template.md")
    Get-ChildItem "docs/*.md" | Where-Object { $docsToKeep -notcontains $_.Name } | Remove-Item -Force
    Remove-Item "infrastructure" -Recurse -Force -ErrorAction SilentlyContinue
}

# 3. Global Search & Replace in Documentation
Write-Host "📝 Updating [Project Name] in all remaining documentation..." -ForegroundColor Yellow
$filesToUpdate = Get-ChildItem -Path "." -Recurse -Filter "*.md" | Where-Object { $_.FullName -notmatch "node_modules" }
foreach ($file in $filesToUpdate) {
    $content = Get-Content $file.FullName
    $newContent = $content -replace "\[Insert Project Name\]", $ProjectName `
                           -replace "\[Insert project name here\]", $ProjectName `
                           -replace "madlabs-saas-template", $ProjectName
    Set-Content $file.FullName $newContent
}

# 4. Dependency Setup
if (Test-Path "package.json") {
    Write-Host "📦 Running npm install..." -ForegroundColor Yellow
    npm install
}

Write-Host "✅ Bootstrap complete! Your $ProjectType project is ready." -ForegroundColor Green
Write-Host "👉 Next Step: Review docs/01_BRD_Template.md" -ForegroundColor White
