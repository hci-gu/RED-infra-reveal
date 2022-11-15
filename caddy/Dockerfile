FROM caddy:2.6.2-builder AS builder

RUN xcaddy build \
    --with github.com/caddyserver/nginx-adapter \
    --with github.com/hairyhenderson/caddy-teapot-module@v0.0.3-0

FROM caddy:2.6.2

COPY --from=builder /usr/bin/caddy /usr/bin/caddy

COPY caddy.conf /etc/caddy/caddy.conf
COPY Caddyfile /etc/caddy/Caddyfile