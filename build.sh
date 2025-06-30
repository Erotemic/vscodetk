#!/bin/bash

npm install -g yo generator-code

npm install -g @vscode/vsce
vsce package

code-server --install-extension vscodetk-0.0.1.vsix
