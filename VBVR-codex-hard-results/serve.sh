#!/usr/bin/env bash
python3 -m http.server 8766  --directory "$(cd "$(dirname "$0")" && pwd)"
