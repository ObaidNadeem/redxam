#!/bin/bash

set -e

git pull origin staging
git checkout master
git merge staging
git push origin master
git checkout staging
echo "master updated!"