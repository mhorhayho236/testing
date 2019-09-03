FROM node:12-slim

LABEL "com.github.actions.name"="Labels"
LABEL "com.github.actions.description"="Labels labels"
LABEL "com.github.actions.icon"="gear"
LABEL "com.github.actions.color"="red"
LABEL "repository"="https://github.com/gjtorikian/testing"
LABEL "homepage"="https://github.com/gjtorikian/testing"
LABEL "maintainer"="gjtorikian"

COPY . .

RUN npm install --production

ENTRYPOINT ["node", "/main.js"]
