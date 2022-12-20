FROM balenalib/rpi-raspbian:bullseye

RUN apt-get update --fix-missing && apt-get install -y \
    hostapd \
    dbus \
    net-tools \
    iptables \
    dnsmasq \
    net-tools \
    macchanger \
    python3 \
    python3-pip

# install mitmproxy
RUN python3 -m pip install mitmproxy==8.1.1

# mitmproxy requires this env
ENV LANG en_US.UTF-8 

ADD ./mitm/scripts /scripts
ADD ./mitm/certs /certs

RUN python3 -m pip install -r /scripts/requirements.txt

ADD hostapd.conf /etc/hostapd/hostapd.conf
ADD hostapd /etc/default/hostapd
ADD dnsmasq.conf /etc/dnsmasq.conf

ADD entrypoint.sh /root/entrypoint.sh
WORKDIR /root
ENTRYPOINT ["/root/entrypoint.sh"]