#!/usr/bin/env bash
set -euo pipefail

# Vercel build images do not always include the .NET SDK; install 8.x when dotnet is missing.
if ! command -v dotnet >/dev/null 2>&1; then
  curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --channel 8.0 --install-dir "$HOME/.dotnet"
  export DOTNET_ROOT="$HOME/.dotnet"
  export PATH="$DOTNET_ROOT:$PATH"
fi

dotnet publish -c Release
