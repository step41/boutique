FROM ubuntu/mysql:8.0-22.04_beta

# metadata
LABEL org.opencontainers.image.authors="Step41 Services <services@step41.com>"

# working directory
WORKDIR /var/lib/mysql

# config port
EXPOSE 3306

# add configs
COPY ./docker/services/loc/api-mysql/etc/mysql/conf.d/mysqld.cnf /etc/mysql/conf.d/mysqld.cnf

# some utility installations
RUN apt-get update && apt-get install -y procps \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y net-tools \
    && apt install -y vim \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

