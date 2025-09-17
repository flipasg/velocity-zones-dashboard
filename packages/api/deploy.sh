#!/bin/bash
set -euo pipefail

PACKAGE_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$PACKAGE_DIR/../.." && pwd)"
cd "$REPO_ROOT"

VERCEL_PROJECT="velocity-zones-dashboard-api"

if ! command -v vercel >/dev/null 2>&1; then
  echo "❌ Vercel CLI is not installed. Installing globally..."
  npm install -g vercel
fi

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

echo "🔗 Ensuring Vercel project link (project: $VERCEL_PROJECT)..."
vercel link --yes --project "$VERCEL_PROJECT" --cwd "$PACKAGE_DIR" >/dev/null

echo "📦 Installing workspace deps at repo root (dev deps included)..."
pnpm -w install --frozen-lockfile --prod=false

echo "🔨 Building workspace targets for @velocity-zones/api..."
pnpm -w turbo run build --filter=@velocity-zones/api

echo "🏗️  Creating prebuilt output with Vercel (local build)..."
vercel build --cwd "$PACKAGE_DIR"

if [[ "$REQUESTED_MODE" == "prod" ]]; then
  echo "🌐 Deploying prebuilt output to Vercel (production)..."
  vercel deploy --yes --prebuilt --prod --cwd "$PACKAGE_DIR" "${CLI_EXTRA_ARGS[@]}"
else
  echo "🌐 Deploying prebuilt output to Vercel (preview)..."
  vercel deploy --yes --prebuilt --cwd "$PACKAGE_DIR" "${CLI_EXTRA_ARGS[@]}"
fi

echo "✅ API deployment completed!"
