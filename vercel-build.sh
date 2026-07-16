#!/bin/sh
set -eu

PROJECT_DIR="Birthday Gift Madam g"

cd "$PROJECT_DIR"

# Vercel images may not include the .NET SDK; install 8.x when missing.
if ! command -v dotnet >/dev/null 2>&1; then
  curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --channel 8.0 --install-dir "$HOME/.dotnet"
  export DOTNET_ROOT="$HOME/.dotnet"
  export PATH="$DOTNET_ROOT:$PATH"
fi

dotnet publish -c Release
