FROM node:8.9.3

# WE NEED THIS TO INSTALL VIA HTTPS
RUN apt-get update && apt-get install -y apt-transport-https

# UPDATE THE LOCAL SOURCES LIST OF DEB PACKAGES AND THEN INSTALL YARN
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y yarn=1.3.2-1


WORKDIR /usr/src/web
