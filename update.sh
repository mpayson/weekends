#!/bin/sh

git pull
cd panlist
npm install
cd client
npm install
npm run build