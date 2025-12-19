#!/bin/bash
cd /home/kavia/workspace/code-generation/test-automation-dashboard-2596-6096/frontend_react_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

