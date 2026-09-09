#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
python3 -m http.server 8766 --directory "$DIR"
