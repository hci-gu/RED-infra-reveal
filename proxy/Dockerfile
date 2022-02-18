FROM balenalib/rpi-raspbian:buster

RUN apt-get update --fix-missing && apt-get install -y \
    hostapd \
    dbus \
    net-tools \
    iptables \
    dnsmasq \
    net-tools \
    macchanger

run apt-get install python3-pip
RUN apt-get install python3-setuptools
# install mitmproxy
RUN pip3 install mitmproxy

# mitmproxy requires this env
ENV LANG en_US.UTF-8 

ADD ./mitm/scripts /scripts
ADD ./mitm/certs /certs

RUN pip3 install -r /scripts/requirements.txt

ADD hostapd.conf /etc/hostapd/hostapd.conf
ADD hostapd /etc/default/hostapd
ADD dnsmasq.conf /etc/dnsmasq.conf

ADD entrypoint.sh /root/entrypoint.sh
WORKDIR /root
ENTRYPOINT ["/root/entrypoint.sh"]