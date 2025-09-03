git add .
git commit -m "changes"
git push -u origin main

grep -R --exclude-dir={node_modules,build} "getActionCookie" -n .
grep -R --exclude-dir={node_modules,build} "FormModal(" -n .
