FROM kyma/docker-nginx

COPY build /var/www
COPY default /etc/nginx/sites-enabled/default

EXPOSE 3000

CMD 'nginx'
