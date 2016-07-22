var fs = require('fs');
var process = require('process');
const spawn = require('child_process').spawn;

const ovpn = {};

/*
    Admin Affiliate supports OpenVPN connections to all of the Auto Affiliate nodes.
    the adminaffiliate/connections/ directory is designed to hold folders named for some
    connection or remote autoaffiliate node.  It expects that inside each uniquely named
    folder that there will be a subdirectory named 'keys' (adminaffiliate/connections/<somedir>/keys),
    and that inside the keys folder will be the adminaffiliate.cert, adminaffiliate.key, ca.key, ta.key,
    and a properly configured OpenVPN config file named "adminaffiliate.conf".

    The connection shouldn't be set to run at operating system boot, but only runs when the adminaffiliate application
    boots.  Each subdir in the connections/ directory needs to be individually initialized using the following command:

    ex: openvpn --config /path/to/adminaffiliate.conf

    These keys, certs and config files are obtained by using the deploynode script found in this project in the
    adminaffiliate/deploynode file.  Run the deploy.sh script and after it completes, copy the /root/easy-rsa/keys dir
    to the adminaffiliate/connections/<some_name>/ directory.  

*/



function init_ovpn(dirs){
    var path = process.cwd() + '/connections';
    var configpath = '';

    //read the contents of the connection folder
    fs.readdir(path, function(err, dirs){
        if(err){
            console.log('ERROR: CONNECTIONS MODULE --> init_ovpn() --> err: ', err);
        
        }
        else{
            //loop
            try{
                for(var i = 0; i < dirs.length; i++){
                    configpath = path + '/' + dirs[i] + '/keys/';
                    console.log('DEBUG: CONNECTIONS MODULE --> init_ovpn() --> configpath: ', configpath);
                    spawn_child_process(dirs[i], configpath);
                }
            }
            catch(err){
                if(err){
                    console.log('ERROR: CONNECTIONS MODULE --> init_ovpn() --> spawn_child_process() err: ', err);
                }
            }
        }
    });
}


function spawn_child_process(name, configpath){
    
    name = name.replace('/', '');

    var options = {
        cwd: configpath,
        uid: 0,
        gid: 0
    };

    ovpn[name] = spawn('openvpn', ['--config', 'adminaffiliate.conf'], options);

    ovpn[name].stdout.on('data', (data) => {
      console.log(`OPENVPN: stdout: ${data}`);
    });

    ovpn[name].stderr.on('data', (data) => {
      console.log(`OPENVPN: stderr: ${data}`);
    });

    ovpn[name].on('close', (code) => {
      console.log(`OPENVPN: child process exited with code ${code}`);
    });
}


module.exports = {
    init: init_ovpn
};