#!/bin/sh
# Adds ?v=<timestamp> to the CSS/JS links in index.html so browsers fetch fresh files after each deploy.
cd "$(dirname "$0")/.."
V=$(date +%Y%m%d%H%M%S)
sed -i '' -E "s#(styles\.css|posts\.js|app\.js)(\?v=[0-9]+)?\"#\1?v=$V\"#g" index.html
grep -n "?v=" index.html
