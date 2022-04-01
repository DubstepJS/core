#!/usr/bin/env bash

set -e

flowts \
  --commit-rename-command "git add . && git commit --no-verify -m 'flowts rename'" \
  ./src

yarn lint
git add .
git commit --no-verify -m 'flowts convert'
