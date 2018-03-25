#!/bin/sh

cd "${0%/*}"
cd panlist
NODE_ENV=production PORT=8000 npm start