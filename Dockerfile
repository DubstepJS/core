ARG BASE_IMAGE=uber/web-base-image:2.0.2
FROM $BASE_IMAGE

WORKDIR /dubstep-core
COPY . .

RUN yarn
RUN yarn lint
RUN yarn test