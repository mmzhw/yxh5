#!/bin/sh
git pull
yarn build:dev
pm2 delete spiderman
yarn start-pm2