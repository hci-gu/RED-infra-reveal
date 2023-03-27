FROM mitmproxy/mitmproxy:9.0.1

COPY scripts /scripts
COPY certs /certs

RUN pip install -r /scripts/requirements.txt

ENTRYPOINT [ "mitmdump", "--quiet", "--set", "block_global=false", "--set", "confdir=/certs", "-s", "/scripts/proxy.py", "--listen-host", "0.0.0.0", "--listen-port", "7954" ]