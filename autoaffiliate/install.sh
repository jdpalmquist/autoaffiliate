#!/bin/bash

## EXPECTED INPUT (example): ./install.sh 5.100.9.129 10.8.0.0 255.255.255.0 10.8.0.1

##  SERVER STATIC IP ADDRESS
##  ex: 5.100.9.129 <-- this should be a static web address provided by your hosting service or ISP
HOST=$1


##  OPENVPN SERVER ADDRESS RANGE AND SUBNET MASK: 
##  ex. 10.8.0.0 255.255.255.0 --> Tunnel IP range 10.8.0.1-254
##  OVPNHOST=10.8.0.0
OVPNHOST=$2


##  OPENVPN SERVER SUBNET MASK
##  ex. 10.8.0.0 255.255.255.0 --> Tunnel IP range 10.8.0.1-254
##  OVPNMASK=255.255.255.0
OVPNMASK=$3


##  [EXPECTED] OPENVPN SERVER STATIC IP ADDRESS:
##  ex. given the above example range of 10.8.0.0 255.255.255.0 OVPN server will pick 10.8.0.1, clients will be given 2-254
##  OVPNSRV=10.8.0.1
OVPNSRV=$4


##  PAGE repository branch name to check out
##  ex. some-git-branch-name
#BRANCH=$5


##  IMPORTANT: change this and then autoaffiliate.conf, mongodb.conf and adminaffiliate.conf will need updates!
###############################################################################################################
SERVER=autoaffiliate  #########################################################################################
CLIENT=adminaffiliate #########################################################################################
###############################################################################################################


##  Previously executed by root:
################################
##  ssh-keygen
##  cd /root
##  cat ./.ssh/id_rsa.pub --> uploaded to deployment key on bitbucket.org!
##  git clone git@bitbucket.org:jdpalmquist/autoaffiliate.git
echo ""
echo "AUTO AFFILIATE INSTALLATION SCRIPT"
echo ""
echo ""


##  The assumed previously installed dependencies:
##  -- openssl
##  -- git
##
##  The base dependencies are: 
##  -- easy-rsa
##  -- openvpn 
##  -- mongodb
##  -- npm
install_dependencies(){
    echo "Installing dependencies..."
    rm -r /root/easy-rsa
    rm -r /etc/openvpn
    pacman -S easy-rsa openvpn mongodb npm --noconfirm
    echo "... finished installing dependencies."
    echo ""    
}


generate_openvpn_keys(){
    echo ""
    echo "Input Tips for the User of this installation script:"
    echo "----------------------------------------------------"
    echo "-  There are two gotchas in this process, so pay attention:"
    echo ""
    echo "-  1.) The key generation process will ask if you want to register the certificates it generates"
    echo "-      This is IMPORTANT, answer 'y' when prompted with a '[y/n]:'' prompt"
    echo ""
    echo "-  2.) SKIP PAST ALL INPUT QUESTIONS POSED BY THE KEYGEN PROCESS BY PRESSING THE ENTER KEY!!"
    echo ""
    echo "-  You've been warned, so don't mess it up! Otherwise you'll have to do it all over again!"
    echo "   Press the enter key when you are ready to begin the installation:" 
    read
    echo ""
    echo ""
    echo "Generating key set for OpenVPN server..."
    echo ""
    echo ""
    echo " Copying the easy-rsa to /root..."
    cp -r /usr/share/easy-rsa /root
    cp -f ./vars /root/easy-rsa/vars
    cd /root/easy-rsa
    source ./vars  # IMPORTANT STEP RIGHT HURR!! The following easy-rsa calls won't work if you don't "source ./vars" first
    echo "... finished copying easy-rsa to /root."
    echo ""
    echo "Clearing out the /root/easy-rsa/keys dir..."
    ./clean-all
    echo "... finished clearing out the /root/easy-rsa/keys dir."
    echo ""
    echo ""
    echo "Generating the Certificate Authority..."
    ./build-ca
    echo "... finished generating the ca.crt file."
    echo ""
    echo ""
    echo "Generating the server-side OpenVPN certificates..."
    ./build-key-server $SERVER
    echo "... finished generating the OpenVPN server certs and keys."
    echo ""
    echo ""
    echo "Building the OpenVPN AdminAffiliate client-side cert..."
    ./build-key $CLIENT
    echo "... finished generating the client side OpenVPN cert."
    echo ""
    echo ""
    echo "Building the Diffe-Hellman key, this can take some time (approx: 1-5 minutes)"
    ./build-dh
    echo "... finished generating the Diffe-Hellman key."
    echo ""
    echo ""
    echo "Generating Hash-based Message Authentication Code (HMAC):"
    echo "-- This will be used to add an additional HMAC signature to all SSL/TLS handshake packets."
    openvpn --genkey --secret /root/easy-rsa/keys/ta.key
    echo "... finished generating HMAC key."
    echo ""
    echo ""
    echo ""
    echo "... finished generating keys for OpenVPN."
    echo ""
}


symbolic_link_keys(){
    echo "Linking OpenVPN server keys to the /etc/openvpn dir... (if the mkdir op fails, dir already existed)"
    mkdir /etc/openvpn
    ##  Note: the /root/easy-rsa/keys directory should have been created during the previous key-gen process
    ln -s -T /root/easy-rsa/keys/ca.crt /etc/openvpn/ca.crt
    ln -s -T /root/easy-rsa/keys/autoaffiliate.crt /etc/openvpn/autoaffiliate.crt 
    ln -s -T /root/easy-rsa/keys/autoaffiliate.key /etc/openvpn/autoaffiliate.key
    ln -s -T /root/easy-rsa/keys/dh2048.pem /etc/openvpn/dh2048.pem
    ln -s -T /root/easy-rsa/keys/ta.key /etc/openvpn/ta.key
    echo "... finished linking OpenVPN keys to /etc/openvpn."
    echo ""
}


inject_autoaffiliate_conf(){
    echo "Creating custom AutoAffiliate config file at /etc/openvpn/autoaffiliate.conf..."
    echo ""

    ##  autoaffiliate.conf
    rm /etc/openvpn/autoaffiliate.conf
    touch /etc/openvpn/autoaffiliate.conf
    echo "##  Auto Affiliate OpenVPN Server Config" >> /etc/openvpn/autoaffiliate.conf
    echo "##  ====================================" >> /etc/openvpn/autoaffiliate.conf
    echo "port 1194                               # OpenVPN listening port number" >> /etc/openvpn/autoaffiliate.conf
    echo "proto udp                               # OpenVPN transport protocol -- client protocols must match this" >> /etc/openvpn/autoaffiliate.conf
    echo "dev tun                                 # OpenVPN device tun: tunneling mode -- client settings must match this" >> /etc/openvpn/autoaffiliate.conf
    echo "ca /etc/openvpn/ca.crt                  # set the ca.crt file path to /etc/openvpn" >> /etc/openvpn/autoaffiliate.conf
    echo "cert /etc/openvpn/autoaffiliate.crt     # set the autoaffiliate.crt file path to /etc/openvpn" >> /etc/openvpn/autoaffiliate.conf
    echo "key /etc/openvpn/autoaffiliate.key      # set the autoaffiliate.key file path to /etc/openvpn" >> /etc/openvpn/autoaffiliate.conf
    echo "dh /etc/openvpn/dh2048.pem              # set the diffe-hellman key to /etc/openvpn" >> /etc/openvpn/autoaffiliate.conf
    echo "topology subnet                         # set the network topology to subnet" >> /etc/openvpn/autoaffiliate.conf
    echo "server ${OVPNHOST} ${OVPNMASK} # IMPORTANT: set the server IP address and the subnet mask" >> /etc/openvpn/autoaffiliate.conf
    echo "ifconfig-pool-persist ipp.txt           # IMPORTANT: this must be allowed! ifconfig-pool-persist --> records stored in ipp.txt" >> /etc/openvpn/autoaffiliate.conf
    echo ";duplicate-cn                            # Enable this if you have a duplice commonName amongst the client/server config files" >> /etc/openvpn/autoaffiliate.conf
    echo "keepalive 5 11                          # ping every five seconds, trim connection if no ping response after 11 seconds" >> /etc/openvpn/autoaffiliate.conf
    echo "tls-auth /etc/openvpn/ta.key 0          # This file is secret, NOTE: the use of "0" indicates this is an OpenVPN SERVER" >> /etc/openvpn/autoaffiliate.conf
    echo "comp-lzo                                # this enables compression in the tunnel -- should have a matching setting on the client side" >> /etc/openvpn/autoaffiliate.conf
    echo "max-clients 2                           # Only allow a maximum of 2 client to connect (the adminaffiliate client)" >> /etc/openvpn/autoaffiliate.conf
    echo "user nobody                             # De-escalate OpenVPN's privileges after initialization" >> /etc/openvpn/autoaffiliate.conf
    echo "group nobody                            # De-escalate OpenVPN's privileges after initialization" >> /etc/openvpn/autoaffiliate.conf
    echo "persist-key                             # persist-key settings" >> /etc/openvpn/autoaffiliate.conf
    echo "persist-tun                             # persist-tun settings" >> /etc/openvpn/autoaffiliate.conf
    echo "status openvpn-status.log               # log file name" >> /etc/openvpn/autoaffiliate.conf
    echo "verb 3                                  # verbosity" >> /etc/openvpn/autoaffiliate.conf
    ##  end autoaffiliate.conf

    echo "... finsihed copying autoaffiliate config to /etc/openvpn."
    echo ""
}

inject_adminaffiliate_conf(){
    ##  NOTE: the final step to install is to copy the /root/easy-rsa/keys to /adminaffiliate/connections/<x>/
    ##  Injecting the script here is double convenient, it saves having to do it later, and keeps the project organized, 
    ##  and hey, what do you know, I can also write the correct HOST IP addr at the same time! :D
    echo "Creating custom AdminAffiliate config file at /root/easy-rsa/keys/adminaffiliate.conf"
    echo ""

    ##  adminaffiliate.conf
    rm /root/easy-rsa/keys/adminaffiliate.conf 
    touch /root/easy-rsa/keys/adminaffiliate.conf
    echo "##  Admin Affiliate OpenVPN client config" >> /root/easy-rsa/keys/adminaffiliate.conf
    echo "##  =====================================" >> /root/easy-rsa/keys/adminaffiliate.conf
    echo "client                        # declare this instance as a OpenVPN client" >> /root/easy-rsa/keys/adminaffiliate.conf
    echo "dev tun                       # device tun: for tunneling mode" >> /root/easy-rsa/keys/adminaffiliate.conf
    echo "proto udp                     # OpenVPN transport protocol -- must match the server config" >> /root/easy-rsa/keys/adminaffiliate.conf
    echo "remote ${HOST} 1194 # IMPORTANT: static IP address of the remote server (default port num is 1194)" >> /root/easy-rsa/keys/adminaffiliate.conf
    echo "resolv-retry infinite         # infinite loop retry connection until success" >> /root/easy-rsa/keys/adminaffiliate.conf
    echo "nobind                        # Do not bind to a specific port -- allow OpenVPN to choose a random high num port" >> /root/easy-rsa/keys/adminaffiliate.conf
    echo "user nobody                   # Post-connection privilege de-esclation" >> /root/easy-rsa/keys/adminaffiliate.conf
    echo "group nobody                  # Post-connection privilege de-esclation" >> /root/easy-rsa/keys/adminaffiliate.conf
    echo "persist-key                   # persist-key settings" >> /root/easy-rsa/keys/adminaffiliate.conf
    echo "persist-tun                   # persist-key settings" >> /root/easy-rsa/keys/adminaffiliate.conf
    echo "ca ca.crt                     # certificate authority file -- generated on the server and exported to the client" >> /root/easy-rsa/keys/adminaffiliate.conf
    echo "cert adminaffiliate.crt       # client certificate file -- generated, signed and registered on the server" >> /root/easy-rsa/keys/adminaffiliate.conf
    echo "key adminaffiliate.key        # client private key -- generated on the server and exported to the client" >> /root/easy-rsa/keys/adminaffiliate.conf
    echo "tls-auth ta.key 1             # HMAC cipher key (private) -- Note the "1" param indicates an OpenVPN Client!!!" >> /root/easy-rsa/keys/adminaffiliate.conf
    echo "comp-lzo                      # enable compression -- should match the server settings in autoaffiliate.conf" >> /root/easy-rsa/keys/adminaffiliate.conf
    echo "verb 3                        # verbosity" >> /root/easy-rsa/keys/adminaffiliate.conf

    echo "... finsihed copying adminaffiliate config to /root/easy-rsa/keys/adminaffiliate.conf."
    echo ""
}


inject_mongodb_conf(){
    echo "Copying the custom MongoDB config to the system..."
    #cp /root/autoaffiliate/mongodb.conf /etc/mongodb.conf
    
    ##  mongodb.conf
    rm /etc/mongodb.conf 
    touch /etc/mongodb.conf 
    echo "##  AutoAffiliate Mongodb.conf" >> /etc/mongodb.conf
    echo "##" >> /etc/mongodb.conf
    echo "bind_ip = 127.0.0.1,${OVPNSRV} # <-- IMPORTANT: should be localhost and the OpenVPN server IP TUN device address!!" >> /etc/mongodb.conf
    echo "quiet = true" >> /etc/mongodb.conf
    echo "dbpath = /var/lib/mongodb" >> /etc/mongodb.conf
    echo "logpath = /var/log/mongodb/mongod.log" >> /etc/mongodb.conf
    echo "logappend = true" >> /etc/mongodb.conf

    echo "... finished copying the mongodb.conf file."
    echo ""
}


enable_onboot_openvpn(){
    echo "Enabling OpenVPN to start with SystemD..."
    systemctl enable openvpn@autoaffiliate.service
    echo "... finished enabling OpenVPN on-boot service."
    echo ""
}


enable_onboot_mongodb(){
    echo "Enabling MongoDB to start with SystemD..."
    systemctl enable mongodb.service 
    echo "... finished enabling MongoDB on-boot service."
    echo ""
}


npm_install(){
    echo "NPM INSTALL..."
    echo ""
    cd /root/autoaffiliate
    npm install 
    npm install -g bower
    bower install --allow-root
    echo "... finished NPM INSTALL."
    echo ""
}


##  NOTE: this assumes you added this nodes SSH key to deployment keys on both autoaffiliate AND page repositories!
pages_install(){
    echo "Installing PAGE repository at /public/page..."
    cd /root/autoaffiliate/public
    git clone git@bitbucket.org:jdpalmquist/page.git
    echo "... installation complete."
    echo ""
}


start_openvpn_server(){
    echo "Starting the OpenVPN Server..."
    systemctl start openvpn@autoaffiliate.service
    echo "... finished starting OpenVPN server."
    echo ""
}


start_mongodb_service(){
    echo "Starting MongoDB..."
    systemctl start mongodb
    echo "... finished starting mongodb."
    echo ""
}


final_message(){
    echo ""
    echo ""
    echo "Installation was a success!"
    echo ""
    echo ""
    echo "Final Post Installation steps:"
    echo ""
    echo "- Set the appropriate branch inside the page repository!"
    echo "    ex: "
    echo "        cd /root/autoaffiliate/public/page"
    echo "        git checkout foobar"
    echo ""
    echo "- Copy the adminaffiliate keys into the adminaffiliate/connections/<x> directory"
    echo "    ex: "
    echo "        scp -r root@0.0.0.0:/root/easy-rsa/keys adminaffiliate/connections/<x>"
    echo ""
    echo ""
    echo "#################################################################################################"
    echo ""
    echo ""
    echo "Node.js Webserver Usage commands:"
    echo ""
    echo "To start/stop the autoaffiliate node.js webserver, from the /root/autoaffiliate directory, type:"
    echo "  npm start"
    echo "  or"
    echo "  npm stop"
    echo "This will invoke 'forever' (the node.js server daemon utility) to start/stop the process gracefully."
    echo ""
    echo ""
    echo ""
    echo ""
    echo "fin."
    exit 0
}


#execute functions in order
#====================================================================================================================
install_dependencies
generate_openvpn_keys
symbolic_link_keys
inject_autoaffiliate_conf
inject_adminaffiliate_conf
inject_mongodb_conf
enable_onboot_openvpn
enable_onboot_mongodb
npm_install
pages_install
start_openvpn_server
start_mongodb_service
npm start               # auto-start the web server upon successful installation
final_message