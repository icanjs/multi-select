#!/bin/bash
echo building with documentjs.
./node_modules/.bin/documentjs
rm -rf .git
(
echo initializing repo
 git init
 git config user.name "marshallswain"
 git config user.email "marshall@creativeideal.net"
echo adding files
 git add -A
echo committing changes
 git commit -m "Deployed to Github Pages"
echo pushing
 git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
)