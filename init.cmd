#!/bin/bash
cd backend
npm install
cd src
touch .env
cd ../../
cd frontend
npm install
cd ../
# Navigate to the ml-service directory
cd ml-service
conda create -p venv python==3.12.7 -y
source "$(conda info --base)/etc/profile.d/conda.sh"
conda activate ./venv
pip install -r requirements.txt
python -m spacy download en_core_web_sm
cd ..
./run.cmd