#FROM node:8.12.0
FROM mhart/alpine-node:8.12.0

# install bash (needed by some developer tooling)
RUN apk update 
RUN apk upgrade 
RUN apk add bash

# Configure the app
ARG APP_NAME=minesweeper
EXPOSE 4000
ENV PORT 4000

# Set up the application directory
RUN mkdir -p /home/${APP_NAME}
COPY . /home/${APP_NAME}

# Install and run the server
WORKDIR /home/${APP_NAME}
RUN npm install
RUN ls /home/${APP_NAME}

# //TODO - use npm instead
CMD node server.js