FROM nginx:latest


# Install Certbot, dependencies, and wget
RUN apt-get update && \
    apt-get install -y certbot python3-certbot-nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


# Create necessary directories for Let's Encrypt challenge
RUN mkdir -p /usr/share/nginx/html/.well-known/acme-challenge && \
    chown -R www-data:www-data /usr/share/nginx/html/.well-known && \
    chmod -R 755 /usr/share/nginx/html/.well-known


# Change ownership and permissions for the relevant directories
RUN chown -R www-data:www-data /etc/letsencrypt /usr/share/nginx/html && \
    chmod -R 755 /etc/letsencrypt /usr/share/nginx/html

# Remove default Nginx configuration files
RUN rm /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom Nginx configuration
COPY nginx.conf /etc/nginx/
COPY project.conf /etc/nginx/conf.d/

# Copy SSL certificate renewal script
COPY renew-certs.sh /renew-certs.sh
RUN chmod +x /renew-certs.sh






