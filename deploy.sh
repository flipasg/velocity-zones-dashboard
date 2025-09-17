#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

SUPPORTED_PACKAGES=()
for script in "$ROOT_DIR"/packages/*/deploy.sh; do
  [[ -e "$script" ]] || continue
  SUPPORTED_PACKAGES+=("$(basename "$(dirname "$script")")")
done

if [[ ${#SUPPORTED_PACKAGES[@]} -eq 0 ]]; then
  echo "No package deploy scripts found under packages/*/deploy.sh" >&2
  exit 1
fi

usage() {
  echo "Usage: $0 <package> [vercel args...]" >&2
  echo "Supported packages: ${SUPPORTED_PACKAGES[*]}" >&2
  exit 1
}

if [[ $# -lt 1 ]]; then
  usage
fi

PACKAGE="$1"
shift

is_supported=false
for candidate in "${SUPPORTED_PACKAGES[@]}"; do
  if [[ "$candidate" == "$PACKAGE" ]]; then
    is_supported=true
    break
  fi
done

if [[ "$is_supported" != true ]]; then
  echo "Unknown package '$PACKAGE'." >&2
  usage
fi

PACKAGE_SCRIPT="$ROOT_DIR/packages/$PACKAGE/deploy.sh"

if [[ ! -x "$PACKAGE_SCRIPT" ]]; then
  echo "Deploy script is not executable for package '$PACKAGE' at $PACKAGE_SCRIPT" >&2
  exit 1
fi

echo "🚀 Launching deployment for package '$PACKAGE'..."
exec "$PACKAGE_SCRIPT" "$@"
