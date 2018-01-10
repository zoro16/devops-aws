FROM node:8.9.3

RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.3.2
ENV PATH="/root/.yarn/bin:${PATH}"
RUN yarn global add strongloop && yarn global add nodemon

WORKDIR /usr/src/api
