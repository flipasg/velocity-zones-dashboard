#!/bin/bash
set -euo pipefail

PACKAGE_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PACKAGE_DIR"

VERCEL_PROJECT="velocity-zones-dashboard-api"

if ! command -v vercel >/dev/null 2>&1; then
  echo "❌ Vercel CLI is not installed. Installing globally..."
  npm install -g vercel
fi

PACKAGE_NAME="@velocity-zones/api"

echo "📦 Building $PACKAGE_NAME..."
pnpm build

echo "🔗 Ensuring Vercel project link (project: $VERCEL_PROJECT)..."
vercel link --yes --project "$VERCEL_PROJECT" --cwd "$PACKAGE_DIR" >/dev/null

REQUESTED_MODE="default"
CLI_EXTRA_ARGS=()

for arg in "$@"; do
  case "$arg" in
    api|@velocity-zones/api)
      continue
      ;;
    --prod|--production|prod|production)
      REQUESTED_MODE="prod"
      ;;
    --preview|preview)
      REQUESTED_MODE="preview"
      ;;
    *)
      CLI_EXTRA_ARGS+=("$arg")
      ;;
  esac
done

if [[ "$REQUESTED_MODE" == "default" ]]; then
  REQUESTED_MODE="prod"
fi

CLI_ARGS=()
if [[ ${#CLI_EXTRA_ARGS[@]} -gt 0 ]]; then
  CLI_ARGS+=("${CLI_EXTRA_ARGS[@]}")
fi

if [[ "$REQUESTED_MODE" == "prod" ]]; then
  CLI_ARGS+=(--prod)
  echo "🌐 Deploying to Vercel (production)..."
else
  REQUESTED_MODE="preview"
  echo "🌐 Deploying to Vercel (preview)..."
fi

if [[ ${#CLI_ARGS[@]} -gt 0 ]]; then
  echo "   Passing through additional args: ${CLI_ARGS[*]}"
  vercel deploy --yes --cwd "$PACKAGE_DIR" "${CLI_ARGS[@]}"
else
  vercel deploy --yes --cwd "$PACKAGE_DIR"
fi

echo "✅ API deployment completed!"
