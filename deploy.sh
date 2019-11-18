#!/bin/sh

npm run build && \
git checkout gh-pages && \
cp dist/* ./ && \
git add index.html main.js && \
git commit -m "Build" && \
git push origin gh-pages && \
git checkout master
