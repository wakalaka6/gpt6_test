#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
python3 -m http.server 8767 --bind 127.0.0.1 --directory "$DIR"
