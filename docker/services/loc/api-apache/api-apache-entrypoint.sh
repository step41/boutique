#!/bin/bash

echo "generating fresh self-signed certificate for apache2"
openssl req -x509 -nodes -days 3650 -newkey rsa:4096 -sha256 -keyout /etc/apache2/self-signed.key -out /etc/apache2/self-signed.crt -subj "/C=US/ST=Alaksa/L=Anchorage/O=Step41/OU=Services/CN=myboutique.loc" -addext "subjectAltName=DNS:myboutique.loc,IP:192.168.0.4"
chown root:root /etc/apache2/self-signed.*
chmod 600 /etc/apache2/self-signed.*

echo "starting apache2 from entrypoint file..."
# /usr/sbin/apache2ctl restart
apache2-foreground

echo "executing CMD: '$@'"
exec "$@"

echo "done"
