#!/bin/bash

branch=$VERCEL_GIT_COMMIT_REF

if [[ $branch == "main" || $branch == "base" || $branch == "base_prod" ]]; then
    # Trigger the build here
    echo "✅ - Build triggered for branch: $branch"
    exit 1
else
    echo "🛑 - Build not triggered for branch: $branch"
    exit 0
fi