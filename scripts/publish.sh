#!/bin/bash
set -e

npm run lib
npm publish
echo "Successfully published"
