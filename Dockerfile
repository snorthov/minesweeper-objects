#FROM node:6.9.2
FROM mhart/alpine-node:6.9.2

# Configure the app
ARG APP_NAME=minesweeper
EXPOSE 3000
ENV PORT 3000

# Set up the application directory
RUN mkdir -p /home/${APP_NAME}
COPY . /home/${APP_NAME}

# Install and run the server
WORKDIR /home/${APP_NAME}
RUN npm install
RUN ls /home/${APP_NAME}

# //TODO - use npm instead
CMD node server.js