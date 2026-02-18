#!/usr/bin/env bash
set -euo pipefail

echo "==> Checking Node/npm..."
command -v node >/dev/null 2>&1 || { echo "Node.js is missing. Install Node.js first, then rerun."; exit 1; }
command -v npm  >/dev/null 2>&1 || { echo "npm is missing. Install npm first, then rerun."; exit 1; }

echo "==> Configure npm global prefix to ~/.local (no sudo)"
npm config set prefix "$HOME/.local"

echo "==> Ensure ~/.local/bin is on PATH for zsh (recommended: ~/.zprofile)"
touch "$HOME/.zprofile"
if ! grep -q 'PATH=.*\.local/bin' "$HOME/.zprofile"; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.zprofile"
fi

# Optional: also add to ~/.zshrc (helpful if your terminal doesn’t load ~/.zprofile)
touch "$HOME/.zshrc"
if ! grep -q 'PATH=.*\.local/bin' "$HOME/.zshrc"; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.zshrc"
fi

echo "==> Apply PATH for current session"
export PATH="$HOME/.local/bin:$PATH"

echo "==> Install Angular CLI globally (into ~/.local)"
npm i -g @angular/cli

echo "==> Verify"
ng --version

echo
echo "Done. Open a NEW terminal (or run: source ~/.zprofile) to ensure PATH is loaded."
