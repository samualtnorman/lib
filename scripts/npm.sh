#!/bin/sh
set -ex
rm -rf dist
./rollup.config.js
scripts/emit-dts.sh
scripts/emit-package-json.js
cp LICENSE README.md dist
