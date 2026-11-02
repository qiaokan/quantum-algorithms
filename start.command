#!/usr/bin/env bash
# Start the local textbook without changing global shell settings.
set -eu
cd -- "$(dirname -- "$0")"
qa_node=''
for qa_candidate in "$(command -v node || true)" "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" "$HOME"/.nvm/versions/node/*/bin/node; do
  if [ -n "$qa_candidate" ] && [ -x "$qa_candidate" ] && "$qa_candidate" -e 'const [major,minor,patch]=process.versions.node.split(".").map(Number);process.exit(major>22||(major===22&&(minor>23||(minor===23&&patch>=4)))?0:1)' 2>/dev/null; then
    qa_node="$qa_candidate"
    break
  fi
done
if [ -z "$qa_node" ]; then
  printf '%s\n' 'Node.js 22.23.4+ is required. Install Node 24, then run npm ci in this directory.'
  exit 1
fi
if [ ! -f node_modules/.bin/astro ]; then
  printf '%s\n' 'Dependencies are missing. Run npm ci in this directory, then start again.'
  exit 1
fi
printf '%s\n' 'Opening a loopback-only textbook server. Use the printed Local URL in the built-in browser. Press Ctrl-C to stop.'
exec "$qa_node" node_modules/.bin/astro dev --host 127.0.0.1 --ignore-lock
