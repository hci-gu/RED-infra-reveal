FROM abiosoft/caddy:builder as builder

ARG version="1.0.3"

RUN go get -v github.com/abiosoft/parent

RUN VERSION=${version} /bin/sh /usr/bin/builder.sh

FROM alpine:3.10

RUN apk add --update ca-certificates \
  && rm -rf /var/cache/apk/*

COPY --from=builder /install/caddy /usr/bin/caddy

EXPOSE 80 443
VOLUME /root/.caddy
WORKDIR /srv

COPY Caddyfile /etc/Caddyfile
COPY caddy.conf /etc/caddy.conf

ENTRYPOINT ["/usr/bin/caddy"]
CMD ["-conf", "/etc/Caddyfile", "-agree", "-log", "stdout", "-email", "registry@infrareveal.net"]