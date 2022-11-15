# RED-infra-reveal

Start Postgres/Proxy

```
docker-compose up
```

Run server

```
cd ..
yarn install
yarn run initialize
```

Run web client

```
cd web
yarn install
yarn start
```

PI

```
sudo docker run -it --net host --privileged --restart unless-stopped \
-e AP_IFACE="wlan0" \
-e INTERNET_IFACE="eth0" \
-e SSID="Infrareveal" \
-e WEBSOCKET_HOST="161.35.209.9" \
-v "$(pwd)/data:/root/data" \
pi-local/proxy:latest

```

docker build -t sebastianandreas/red-rpi-mitm:latest . && docker push sebastianandreas/red-rpi-mitm:latest
