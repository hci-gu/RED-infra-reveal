FROM mitmproxy/mitmproxy:6.0.2

COPY scripts /scripts
COPY certs /certs

RUN pip install -r /scripts/requirements.txt

ENTRYPOINT [ "mitmdump", "--quiet", "--set", "block_global=false", "--set", "confdir=/certs", "-s", "/scripts/proxy.py", "--listen-host", "0.0.0.0", "--listen-port", "8888" ]