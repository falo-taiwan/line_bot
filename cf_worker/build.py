import os
import sys

# Define base paths
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORKER_DIR = os.path.join(ROOT_DIR, "cf_worker")
TEMPLATE_PATH = os.path.join(WORKER_DIR, "src", "index.template.js")
OUTPUT_PATH = os.path.join(WORKER_DIR, "src", "index.js")

# Map of placeholder to filename in ROOT_DIR
HTML_MAPPING = {
    "__INDEX_HTML__": "index.html",
    "__POC_DEMO_HTML__": "poc-demo.html",
    "__MVP_HTML__": "mvp.html",
    "__PRODUCT_INTRO_HTML__": "product-intro.html",
    "__PRODUCT_ANALYSIS_HTML__": "product-analysis.html",
    "__LINE_PARSER_SPEC_HTML__": "docs/tutorials/line_parser_spec.html",
    "__GOOGLE_SHEETS_ACCESS_METHODS_HTML__": "google-sheets-access-methods.html"
}

def escape_for_js_literal(content):
    # Escape backslashes first, then backticks and template strings
    escaped = content.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
    return escaped

def main():
    if not os.path.exists(TEMPLATE_PATH):
        print(f"Error: Template not found at {TEMPLATE_PATH}", file=sys.stderr)
        sys.exit(1)

    print("Reading index.template.js...")
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        js_content = f.read()

    for placeholder, relative_path in HTML_MAPPING.items():
        full_path = os.path.join(ROOT_DIR, relative_path)
        if not os.path.exists(full_path):
            print(f"Warning: File {relative_path} not found! Placeholder will remain empty.", file=sys.stderr)
            escaped_content = ""
        else:
            print(f"Embedding {relative_path}...")
            with open(full_path, "r", encoding="utf-8") as f:
                content = f.read()
            escaped_content = escape_for_js_literal(content)
        
        js_content = js_content.replace(placeholder, escaped_content)

    print(f"Writing final compiled script to {OUTPUT_PATH}...")
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(js_content)

    print("Success! Worker compiled.")

if __name__ == "__main__":
    main()
