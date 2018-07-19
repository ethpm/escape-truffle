#!/usr/bin/env bash

# --------------------------------------------------------------------------------------------------
# This script adapted from openzeppelin-solidity's test launch scripts
# Source: (https://github.com/OpenZeppelin/openzeppelin-solidity/scripts/)
# --------------------------------------------------------------------------------------------------

# Exit as soon as a command fails.
set -o errexit

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  # Kill the client we started (if we started one and if it's still running).
  if [ -n "$CLIENT_PID" ] && ps -p "$CLIENT_PID" > /dev/null; then
    kill -9 "$CLIENT_PID"
  fi
}

if [ "$NETWORK" = "ganache" ]; then
  PORT=8547
else
  PORT=8545
fi

# Client detection
client_running() {
  nc -z localhost "$PORT"
}

# Client runner
start_client() {
  if [ "$NETWORK" = "ganache" ]; then
    echo "Starting $NETWORK client on port: $PORT"
    node_modules/.bin/ganache-cli --noVMErrorsOnRPCResponse --port "$PORT"> /dev/null &
  fi

  CLIENT_PID=$!
}

# Detect client
if client_running; then
  echo "Using existing $NETWORK client on port: $PORT"
else
  start_client
fi

# Deploy to specified network, resetting all previous deployments
node_modules/.bin/truffle migrate --reset --network "$NETWORK" --interactive
