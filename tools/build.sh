#!/bin/sh
# Usage: tools/build.sh path/to/prototype.html
set -e
cd "$(dirname "$0")/.."
python3 tools/build.py "$1"
npx -y esbuild@0.24.0 guide.js --minify --target=es2018 --outfile=guide.min.js --log-level=warning
npx -y esbuild@0.24.0 guide.css --minify --outfile=guide.min.css --log-level=warning
ls -l guide*.js guide*.css
