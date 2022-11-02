FROM kyma/docker-nginx

COPY dist /var/www
COPY default /etc/nginx/sites-enabled/default

EXPOSE 3000

CMD 'nginx'
