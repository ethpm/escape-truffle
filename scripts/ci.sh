#!/usr/bin/env bash

if [ "$NETWORK" = "coverage" ]; then
  ./scripts/coverage.sh
else
  ./scripts/test.sh
fi
