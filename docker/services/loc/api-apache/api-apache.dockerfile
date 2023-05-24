FROM ubuntu/apache2:latest

# metadata
LABEL org.opencontainers.image.authors="Step41 Services <services@step41.com>"

# working directory
WORKDIR /var/www/html

# some utility installations
RUN apt-get update && apt-get install -y procps \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y net-tools \
    && apt install -y composer \
    && apt install -y vim \
    && apt-get install -y openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# add composer
COPY --from=composer /usr/bin/composer /usr/bin/composer

# add content and configs
COPY ./docker/services/loc/api-apache/api-apache-entrypoint.sh                                     /
COPY ./docker/services/loc/api-apache/etc/apache2/apache2.conf                                     /etc/apache2/apache2.conf
COPY ./docker/services/loc/api-apache/etc/apache2/mods-available/alias.conf                        /etc/apache2/mods-available/alias.conf
COPY ./docker/services/loc/api-apache/etc/apache2/sites-available/10-myboutique.local.conf         /etc/apache2/sites-available/10-myboutique.local.conf

# add dirs for logging and sites
RUN mkdir -p /var/log/apache2/10-myboutique.local

# enable mods and sites
RUN a2enmod rewrite
RUN a2enmod ssl
RUN a2enmod headers
RUN a2enmod proxy
RUN a2enmod proxy_fcgi
RUN a2enmod expires
RUN a2enmod deflate
RUN a2enmod alias
RUN a2enmod authn_core
RUN a2enmod access_compat
RUN a2dissite 000-default
RUN a2ensite 10-myboutique.local

# group and user perms
RUN groupmod -g 1000 www-data \
    && usermod -u 1000 -s /bin/bash -g www-data www-data
RUN chown -R www-data:www-data . \
    && chmod +x /api-apache-entrypoint.sh 

# set up entrypoint and default command
ENTRYPOINT ["/api-apache-entrypoint.sh"]

# open ports
EXPOSE 80 443

# set default command
CMD ["/usr/sbin/apache2ctl","-D","FOREGROUND"]
