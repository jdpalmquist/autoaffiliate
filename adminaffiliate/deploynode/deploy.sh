#!/bin/bash

## EXPECTED INPUT (example): ./deploy.sh 5.100.9.129 10.8.0.0 255.255.255.0 10.8.0.1 some-git-branch-name

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


echo ""
echo "AUTO AFFILIATE DEPLOYMENT SCRIPT"
echo ""
echo ""


install_prerequisites(){
    echo "Installing the prerequisites..."
    pacman -Syu --noconfirm
    pacman -S openssl git --noconfirm
    echo "... install complete."
    echo ""
}


deploy_ssh_keys(){
    echo "Deploying standard SSH keyset to this server node..."
    cp -r /root/deploynode/.ssh /root
    ##  IMPORTANT: Add the new keys to the ssh daemon records
    ssh-add /root/.ssh/id_rsa
    echo "... finished installing SSH keys."
    echo ""
}


git_clone_autoaffiliate(){
    echo "Cloning the AutoAffiliate source code from bitbucket.org..."
    cd /root
    git clone git@bitbucket.org:jdpalmquist/autoaffiliate.git
    echo "... finished git clone."
    echo ""
}


launch_autoaffiliate_install_script(){
    echo ""
    echo "Now launching the AutoAffiliate Installation script..."
    echo ""
    echo ""
    echo ""
    cd /root/autoaffiliate
    chmod +x /root/autoaffiliate/install.sh
    /root/autoaffiliate/install.sh $HOST $OVPNHOST $OVPNMASK $OVPNSRV $BRANCH
}


##  Execute
#######################################################################################################
install_prerequisites
deploy_ssh_keys
git_clone_autoaffiliate
launch_autoaffiliate_install_script