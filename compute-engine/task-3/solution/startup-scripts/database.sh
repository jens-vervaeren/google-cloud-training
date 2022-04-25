#! /bin/bash
apt-get update
apt-get install -y postgresql-12 postgresql-contrib
systemctl start postgresql.service