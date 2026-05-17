FROM node:24-alpine

WORKDIR /app

COPY web-data-viz/package*.json ./

RUN npm i

COPY web-data-viz .

EXPOSE 80

CMD ["npm", "start"]
