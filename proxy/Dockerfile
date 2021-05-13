FROM mitmproxy/mitmproxy:6.0.2

COPY scripts /scripts

RUN pip install -r /scripts/requirements.txt

ENTRYPOINT [ "mitmdump", "--quiet", "--set", "block_global=false", "-s", "/scripts/proxy.py", "--listen-host", "0.0.0.0" ]