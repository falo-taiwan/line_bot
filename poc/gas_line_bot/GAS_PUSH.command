#!/bin/zsh
set -euo pipefail

cd "$(dirname "$0")"

echo "== FALO GAS LINE Bot: push local files to Apps Script =="

if ! command -v clasp >/dev/null 2>&1; then
  echo "clasp is not installed. Install it with: npm install -g @google/clasp"
  exit 1
fi

if [ -f ".gas.env" ]; then
  set -a
  source ".gas.env"
  set +a
fi

if [ ! -f ".clasp.json" ]; then
  if [ -z "${GAS_SCRIPT_ID:-}" ]; then
    echo "Missing .clasp.json and GAS_SCRIPT_ID."
    echo "Copy .gas.env.example to .gas.env, then fill GAS_SCRIPT_ID."
    exit 1
  fi
  cat > ".clasp.json" <<EOF
{"scriptId":"${GAS_SCRIPT_ID}","rootDir":"."}
EOF
  echo "Created .clasp.json for this local folder."
fi

echo
echo "Current clasp project status:"
clasp status || true

echo
echo "Pushing Code.gs and appsscript.json..."
clasp push

echo
echo "Done. Open Apps Script editor if you need to deploy a new Web App version."

