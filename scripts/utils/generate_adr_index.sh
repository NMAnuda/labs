#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# Script: generate_adr_index.sh
# Purpose: Automatically updates the ADR index table in docs/adr/README.md
# Usage: ./scripts/utils/generate_adr_index.sh
# ──────────────────────────────────────────────────────────────────────────────

ADR_DIR="docs/adr"
README_FILE="$ADR_DIR/README.md"
TEMP_FILE=$(mktemp)

echo "Generating ADR Index..."

# Extract everything before the "## Index" section
sed '/## Index/q' "$README_FILE" > "$TEMP_FILE"

# Add the table headers
echo "" >> "$TEMP_FILE"
echo "| ADR | Title | Status | Date |" >> "$TEMP_FILE"
echo "|-----|-------|--------|------|" >> "$TEMP_FILE"

# Parse each ADR file (ignoring README.md)
for file in "$ADR_DIR"/*.md; do
  filename=$(basename "$file")
  
  if [ "$filename" == "README.md" ]; then
    continue
  fi

  # Extract Number and Title from filename
  title=$(grep "^# " "$file" | head -1 | sed 's/^# ADR-[0-9]*: //' | tr -d '\r')
  status=$(grep "^\*\*Status:\*\*" "$file" | head -1 | sed 's/\*\*Status:\*\* //' | tr -d '\r')
  date=$(grep "^\*\*Date:\*\*" "$file" | head -1 | sed 's/\*\*Date:\*\* //' | tr -d '\r')
  adr_number=$(echo "$filename" | grep -o '^[0-9]\+')

  echo "| [$adr_number](./$filename) | $title | $status | $date |" >> "$TEMP_FILE"
done

# Replace original file
mv "$TEMP_FILE" "$README_FILE"
echo "✅ ADR index updated successfully in $README_FILE"
