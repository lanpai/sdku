#!/bin/sh

npm run build && \
git checkout gh-pages && \
git pull && \
cp dist/index.html ./ && \
cp dist/main.js ./ && \
git add index.html main.js && \
git commit -m "Build" && \
git push origin gh-pages && \
git checkout master
