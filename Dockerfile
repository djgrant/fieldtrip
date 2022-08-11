FROM node:14-slim
WORKDIR /usr/src/app
COPY package.json package-lock.json tsconfig.base.json nx.json ./
COPY apps/server apps/server/
COPY packages/fieldtrip packages/fieldtrip
RUN yarn install
RUN yarn run build:server

FROM node:14-slim
WORKDIR /
COPY --from=0 /usr/src/app/dist/apps/server ./
RUN yarn install
CMD [ "npm", "start" ]
