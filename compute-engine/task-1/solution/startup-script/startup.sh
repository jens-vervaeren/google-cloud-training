#! /bin/bash
apt-get update
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt-get install -y nodejs
npm install pm2@latest -g