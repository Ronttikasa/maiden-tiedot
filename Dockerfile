FROM node:16.13.2

EXPOSE 3000

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm install -g serve

RUN npm run build

CMD ["serve", "-s", "build", "-l", "3000"]
