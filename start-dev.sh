#!/bin/bash
# Wrap `npm run dev` with NVM-loaded Node 20 (Preview MCP starts with system Node 16).
set -e
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
. "$NVM_DIR/nvm.sh"
nvm use 20 >/dev/null
cd "$(dirname "$0")"
exec npm run dev -- --port 5175
