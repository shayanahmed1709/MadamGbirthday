#!/bin/sh
set -eu

cd "Birthday Gift Madam g"

# Vercel images may not include the .NET SDK; install 8.x when missing.
if ! command -v dotnet >/dev/null 2>&1; then
  curl -sSL https://dot.net/v1/dotnet-install.sh -o /tmp/dotnet-install.sh
  chmod +x /tmp/dotnet-install.sh
  /bin/bash /tmp/dotnet-install.sh --channel 8.0 --install-dir "$HOME/.dotnet"
  export DOTNET_ROOT="$HOME/.dotnet"
  export PATH="$DOTNET_ROOT:$PATH"
fi

dotnet publish -c Release
