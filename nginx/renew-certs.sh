#!/bin/bash
set -e

# Renew certificates
certbot certonly --webroot -w /usr/share/nginx/html -d app.battmo.org --email lorena.hendrix@sintef.no --agree-tos --non-interactive -v
