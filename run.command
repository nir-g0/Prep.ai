#!/bin/bash
# Your commands here
osascript -e 'tell application "Terminal" to do script "cd /Volumes/Virus*SSD/Prep.Ai/Prep.ai/backend"' &
osascript -e 'tell application "Terminal" to do script "cd /Volumes/Virus*SSD/Prep.Ai/Prep.ai/ml-service && conda activate venv/ && cd src && python main.py"' &
osascript -e 'tell application "Terminal" to do script "cd /Volumes/Virus*SSD/Prep.Ai/Prep.ai/backend && nodemon index.js"' &

# if issues with spaCy in the python terminal, enter the line below and try again:
# python -m spacy download en