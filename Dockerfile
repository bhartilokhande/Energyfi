FROM node:16.14.0

ENV PORT 3000

WORKDIR /app

COPY . /app

ENV NODE_OPTIONS=--max_old_space_size=8192
# Installing dependencies

RUN yarn install

# Building app
RUN yarn run build
EXPOSE 3000

# Running the app
CMD "npm" "run" "start"