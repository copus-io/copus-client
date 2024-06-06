#!/bin/bash

if [ -d "./build" ]; then
  rm -rf build
fi

cp -af .next/standalone ./
mv ./standalone build
cp -af .next/static build/.next
