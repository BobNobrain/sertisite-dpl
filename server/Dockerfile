FROM node:6.11
WORKDIR /app
ADD . /app
RUN /app/deploy.sh
EXPOSE 1337
ENTRYPOINT /app/run.sh
