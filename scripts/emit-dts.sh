#!/bin/sh
set -ex
node_modules/.bin/tsc --project src --noEmit false --outDir dist
