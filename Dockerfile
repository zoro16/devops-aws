FROM node:8.9.3

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api
COPY . .

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "."]
