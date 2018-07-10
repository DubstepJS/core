FROM node
WORKDIR /dubstep-core
COPY . .

RUN yarn
RUN yarn test