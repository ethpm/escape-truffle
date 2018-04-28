#!/usr/bin/env bash

if [ $NETWORK = "COVERAGE"]; then
  ./scripts/coverage.sh
else
  ./scripts/test.sh
fi
