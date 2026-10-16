#!/usr/bin/env bash
# Creates a public GitHub repo for this site, pushes it, and turns on GitHub Pages.
#
#   ./publish-to-github.sh              -> repo named <your-username>.github.io (site lives at the root URL)
#   ./publish-to-github.sh my-portfolio -> repo named my-portfolio (site lives at <you>.github.io/my-portfolio/)
#
# Needs: git (https://git-scm.com) and the GitHub CLI (https://cli.github.com).
set -euo pipefail
cd "$(dirname "$0")"

command -v git >/dev/null || { echo "Please install git first: https://git-scm.com"; exit 1; }
command -v gh  >/dev/null || { echo "Please install the GitHub CLI first: https://cli.github.com"; exit 1; }
gh api user -q .login >/dev/null 2>&1 || gh auth login

OWNER="$(gh api user -q .login)"
REPO="${1:-$OWNER.github.io}"

[ -d .git ] || git init -q -b main
git add -A
git diff --cached --quiet || git commit -q -m "Publish portfolio site"
git branch -M main

if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  echo "Repo $OWNER/$REPO already exists - pushing to it."
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$OWNER/$REPO.git"
else
  gh repo create "$OWNER/$REPO" --public --source=. --remote=origin \
    --description "Aniyah Williams - illustration portfolio"
fi
git push -u origin main

# Turn on GitHub Pages (deploy from the main branch, root folder).
gh api -X POST "repos/$OWNER/$REPO/pages" -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 \
  || gh api -X PUT "repos/$OWNER/$REPO/pages" -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 \
  || echo "Couldn't switch Pages on automatically - open the repo's Settings > Pages and pick: Deploy from branch > main > / (root)."

if [ "$REPO" = "$OWNER.github.io" ]; then URL="https://$OWNER.github.io/"; else URL="https://$OWNER.github.io/$REPO/"; fi
echo
echo "Done. Repo: https://github.com/$OWNER/$REPO"
echo "Your site will be live at $URL in a minute or two."
