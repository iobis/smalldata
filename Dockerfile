FROM ubuntu:18.04
RUN apt update
RUN apt -y install openjdk-11-jdk-headless curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt -y install nodejs gcc g++ make
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update && apt install yarn
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . ./
RUN ./server/gradlew build --stacktrace
RUN yarn install
CMD ["yarn", "start"]
