#!/bin/zsh

set -u

SCRIPT_DIR="${0:A:h}"
cd "$SCRIPT_DIR" || exit 1

echo "FALO LINE OCR Recorder"
echo "Working directory: $SCRIPT_DIR"
echo
echo "This tool is observer-only:"
echo "- It captures the screen region you select."
echo "- It appends newly OCR-detected text to conversation.txt."
echo "- It does not modify LINE files or send messages."
echo

if ! command -v python3 >/dev/null 2>&1; then
  echo "ERROR: python3 not found."
  echo "Please install Python 3 first."
  echo
  echo "Press Enter to close..."
  read
  exit 1
fi

python3 ocr_window_recorder.py --control-panel

STATUS=$?
echo
echo "Recorder exited with status: $STATUS"
echo "Output folder:"
echo "$SCRIPT_DIR/out/ocr-window-recorder"
echo
echo "Press Enter to close..."
read

exit "$STATUS"
