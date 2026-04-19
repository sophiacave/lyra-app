#!/bin/bash
# Visual Regression Testing Pipeline
# baseline → deploy → capture → diff
#
# Usage: ./visual-regression.sh [baseline|capture|diff|full]
# Requires: chromium/chrome for screenshots, imagemagick for diff
#
# Workflow:
#   1. baseline — capture reference screenshots
#   2. deploy   — (handled externally via git push)
#   3. capture  — capture post-deploy screenshots
#   4. diff     — compare baseline vs capture, flag regressions

set -euo pipefail

SITE_URL="${SITE_URL:-https://likeone.ai}"
BASE_DIR="$HOME/lyra-app/brain-console/visual-tests"
BASELINE_DIR="$BASE_DIR/baseline"
CAPTURE_DIR="$BASE_DIR/capture"
DIFF_DIR="$BASE_DIR/diff"
REPORT="$BASE_DIR/report.json"

# Pages to test
PAGES=(
  "/"
  "/academy"
  "/about"
  "/blog"
  "/pricing"
  "/calculator"
)

# Viewport sizes
VIEWPORTS=(
  "1440x900"
  "375x812"
)

mkdir -p "$BASELINE_DIR" "$CAPTURE_DIR" "$DIFF_DIR"

capture_screenshots() {
  local dir="$1"
  local label="$2"
  echo "📸 Capturing $label screenshots..."

  for page in "${PAGES[@]}"; do
    for viewport in "${VIEWPORTS[@]}"; do
      local w="${viewport%x*}"
      local h="${viewport#*x}"
      local slug="${page//\//_}"
      [ -z "$slug" ] && slug="_home"
      local filename="${slug}_${viewport}.png"

      echo "  → ${SITE_URL}${page} @ ${viewport}"

      # Use Chrome headless for screenshots (must use absolute resolved path)
      local abs_path
      abs_path="$(cd "$dir" && pwd)/$filename"
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
        --headless=new \
        --disable-gpu \
        "--screenshot=$abs_path" \
        --window-size="${w},${h}" \
        --hide-scrollbars \
        --force-device-scale-factor=1 \
        --virtual-time-budget=5000 \
        "${SITE_URL}${page}" 2>/dev/null || {
          echo "  ⚠️ Failed: ${page} @ ${viewport}"
          continue
        }
    done
  done
  echo "✅ $label complete: $(ls "$dir"/*.png 2>/dev/null | wc -l | tr -d ' ') screenshots"
}

run_diff() {
  echo "🔍 Running visual diff..."
  local failures=0
  local total=0
  local results="["

  for baseline_img in "$BASELINE_DIR"/*.png; do
    [ -f "$baseline_img" ] || continue
    local name="$(basename "$baseline_img")"
    local capture_img="$CAPTURE_DIR/$name"
    local diff_img="$DIFF_DIR/$name"

    if [ ! -f "$capture_img" ]; then
      echo "  ⚠️ Missing capture: $name"
      continue
    fi

    total=$((total + 1))

    # ImageMagick compare — returns diff percentage
    # compare exits 1 on diff, 2 on error — capture output regardless of exit code
    local diff_output diff_pct
    diff_output=$(compare -metric RMSE "$baseline_img" "$capture_img" "$diff_img" 2>&1 || true)
    # RMSE output: "1234.56 (0.0188)" — extract normalized value in parens, multiply by 100
    diff_pct=$(echo "$diff_output" | grep -oE '\(([0-9.]+)\)' | tr -d '()' | awk '{printf "%.2f", $1 * 100}') || diff_pct="100"
    [ -z "$diff_pct" ] && diff_pct="100"

    # Threshold: >2% difference = regression
    local pass="true"
    if (( $(echo "$diff_pct > 2.0" | bc -l 2>/dev/null || echo 1) )); then
      pass="false"
      failures=$((failures + 1))
      echo "  ❌ REGRESSION: $name (${diff_pct}% diff)"
    else
      echo "  ✅ OK: $name (${diff_pct}% diff)"
    fi

    [ "$total" -gt 1 ] && results+=","
    results+="{\"page\":\"$name\",\"diff_pct\":\"$diff_pct\",\"pass\":$pass}"
  done

  results+="]"

  # Write report
  cat > "$REPORT" <<EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "site": "$SITE_URL",
  "total": $total,
  "passed": $((total - failures)),
  "failed": $failures,
  "results": $results
}
EOF

  echo ""
  echo "📊 Report: $REPORT"
  echo "   Total: $total | Passed: $((total - failures)) | Failed: $failures"

  [ "$failures" -gt 0 ] && return 1 || return 0
}

case "${1:-full}" in
  baseline)
    capture_screenshots "$BASELINE_DIR" "baseline"
    ;;
  capture)
    capture_screenshots "$CAPTURE_DIR" "post-deploy"
    ;;
  diff)
    run_diff
    ;;
  full)
    echo "🚀 Full visual regression pipeline"
    echo "Step 1: Capture baseline..."
    capture_screenshots "$BASELINE_DIR" "baseline"
    echo ""
    echo "Step 2: Waiting for deploy (press Enter when ready, or Ctrl+C to skip)..."
    read -r -t 5 || true
    echo ""
    echo "Step 3: Capture post-deploy..."
    capture_screenshots "$CAPTURE_DIR" "post-deploy"
    echo ""
    echo "Step 4: Diff..."
    run_diff
    ;;
  *)
    echo "Usage: $0 [baseline|capture|diff|full]"
    exit 1
    ;;
esac
