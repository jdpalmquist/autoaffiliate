#!/bin/bash

#There is no other way -- tried multiple ways to auto-init all the OpenVPN connections,
# and short of adding them to the systemd initializer, they can't initd with the app.
# create a listing for each connection you need to open here, then before launching the
# adminaffiliate app, run this script to start each connections.

cd connections/_45.33.41.109/keys/
openvpn --config adminaffiliate.conf
cd ../../