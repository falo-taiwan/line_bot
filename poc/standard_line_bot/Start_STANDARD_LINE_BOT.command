#!/bin/zsh

set -u

SCRIPT_DIR="${0:A:h}"
cd "$SCRIPT_DIR" || exit 1

DEFAULT_PORT="8765"
PORT="$DEFAULT_PORT"
ENV_FILE="$SCRIPT_DIR/.env"

if [[ -f "$ENV_FILE" ]]; then
  ENV_PORT="$(awk -F= '/^LINE_BOT_PORT=/ {gsub(/^[ \t]+|[ \t]+$/, "", $2); gsub(/^["'\'']|["'\'']$/, "", $2); print $2; exit}' "$ENV_FILE")"
  if [[ -n "${ENV_PORT:-}" ]]; then
    PORT="$ENV_PORT"
  fi
fi

HOST="127.0.0.1"
WEBHOOK_URL="http://$HOST:$PORT/webhook"
HEALTH_URL="http://$HOST:$PORT/health"
ADMIN_URL="http://$HOST:$PORT/admin/login"
DEV_CONSOLE_URL="http://$HOST:$PORT/dev-console"
GAS_MONITOR_URL="http://$HOST:$PORT/gas-monitor"

echo "FALO Standard LINE Bot"
echo "Working directory: $SCRIPT_DIR"
echo "Port: $PORT"
echo

if ! command -v python3 >/dev/null 2>&1; then
  echo "ERROR: python3 not found."
  echo "Please install Python 3 first."
  echo
  echo "Press Enter to close..."
  read
  exit 1
fi

echo "Checking whether port $PORT is already in use..."
PIDS="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"

if [[ -n "$PIDS" ]]; then
  echo "Stopping existing listener(s) on port $PORT: $PIDS"
  for PID in ${(f)PIDS}; do
    kill "$PID" 2>/dev/null || true
  done

  sleep 1
  REMAINING_PIDS="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
  if [[ -n "$REMAINING_PIDS" ]]; then
    echo "Force-stopping remaining listener(s) on port $PORT: $REMAINING_PIDS"
    for PID in ${(f)REMAINING_PIDS}; do
      kill -9 "$PID" 2>/dev/null || true
    done
    sleep 1
  fi
else
  echo "Port $PORT is free."
fi

echo
echo "Starting webhook server..."
echo "Webhook: $WEBHOOK_URL"
echo "Health:  $HEALTH_URL"
echo "Admin:   $ADMIN_URL"
echo "Console: $DEV_CONSOLE_URL"
echo "GAS UI:  $GAS_MONITOR_URL"
echo

(sleep 1.5 && open "$ADMIN_URL" && open "$DEV_CONSOLE_URL" && open "$GAS_MONITOR_URL") &

python3 line_bot_server.py --port "$PORT"

STATUS=$?
echo
echo "Server exited with status: $STATUS"
echo "Output folder:"
echo "$SCRIPT_DIR/out/standard-line-bot"
echo
echo "Press Enter to close..."
read

exit "$STATUS"
