FROM node:10-slim

RUN mkdir /actionz
WORKDIR /actionz
COPY . .

RUN npm install --production

ENTRYPOINT ["/actionz/entrypoint.sh"]
CMD ["--help"]
