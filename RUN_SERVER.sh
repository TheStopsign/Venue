#!/usr/bin/env bash
cd server
nodemon server 2>/dev/null &
cd ..
npm run serve --fix &
