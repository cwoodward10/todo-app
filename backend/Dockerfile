FROM node:lts-alpine

USER node
WORKDIR /home/node

COPY . .
RUN npm ci && \
    npm run types && \
    echo y | npm run migrate

ARG PORT
EXPOSE ${PORT:-3000}

CMD ["npm", "run", "start"]
