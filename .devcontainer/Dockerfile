FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

RUN apt update && apt upgrade -y

RUN apt install -y mysql-client-core-8.0

ARG NODEJS_VERSION=20.17.0
RUN curl -L https://nodejs.org/dist/v${NODEJS_VERSION}/node-v${NODEJS_VERSION}-linux-x64.tar.gz | tar -C /usr/local -zx
ENV PATH ${PATH}:/usr/local/node-v${NODEJS_VERSION}-linux-x64/bin

RUN curl -L https://github.com/biomejs/biome/releases/download/cli%2Fv1.9.1/biome-linux-x64 -o /usr/bin/biome \
 && chmod +x /usr/bin/biome
