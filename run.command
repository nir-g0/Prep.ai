#!/bin/bash
# Your commands here
osascript -e 'tell application "Terminal" to do script "cd /Volumes/Virus/Prep.ai/backend"' &
osascript -e 'tell application "Terminal" to do script "cd /Volumes/Virus/Prep.ai/ml-service && conda activate venv/ && cd src && python main.py"' &
osascript -e 'tell application "Terminal" to do script "cd /Volumes/Virus/Prep.ai/backend && nodemon index.js"' &