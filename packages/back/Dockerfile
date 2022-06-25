FROM node:16.2.0

WORKDIR /src

ADD . /src

RUN npm install && npm run build

FROM node:16.2.0-alpine

RUN apk add --no-cache tini
RUN apk add --no-cache curl

ENV NODE_ENV=production
ENV PORT=4000

WORKDIR /app

COPY --from=0 /src/build /app/build
COPY --from=0 /src/node_modules /app/node_modules

COPY package.json /app/

EXPOSE 4000
EXPOSE 4001

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "run", "start:prod"]
