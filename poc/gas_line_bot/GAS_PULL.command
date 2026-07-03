#!/bin/zsh
set -euo pipefail

cd "$(dirname "$0")"

echo "== FALO GAS LINE Bot: pull cloud files from Apps Script =="

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

timestamp="$(date +%Y%m%d-%H%M%S)"
backup_dir="backups/gas-${timestamp}"
mkdir -p "${backup_dir}"

for file in Code.gs appsscript.json .clasp.json; do
  if [ -f "${file}" ]; then
    cp "${file}" "${backup_dir}/"
  fi
done

echo "Local files backed up to ${backup_dir}"
echo
echo "Pulling from Apps Script. This may overwrite local Code.gs."
clasp pull

echo
echo "Done. If the pull was not intended, restore from ${backup_dir}."

