#!/bin/bash

set -e

echo 'hi there'

echo "$ENV"
echo "$PATH"
printenv > out.txt
