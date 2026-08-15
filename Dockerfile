FROM apify/actor-node-playwright-chrome:22

USER root
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/storage && chown -R myuser:myuser /app
USER myuser

EXPOSE 3000
CMD ["npm", "start"]
