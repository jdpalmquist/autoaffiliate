angular.module('autoaffiliate')
.controller('IndexController',[
'$http',
'$scope', 
'$location', 
'$routeParams',
function($http, $scope, $location, $routeParams){
    $scope.servers = [];
    
    $scope.draw_table = function(){
        $scope.reset_index();
        $http.get('get/all/servers').success(function(data){
            if(data.length > 0){
                $scope.servers = data;
            }
            else{
                jQuery('#server-table').addClass('display-none');
                jQuery('#no-servers-message').removeClass('display-none');
            }
        });
    };

    $scope.reset_index = function(){
        jQuery('#no-servers-message').addClass('display-none');
        jQuery('#server-table').removeClass('display-none');
    };

    $scope.edit_server = function($event){
        var serverid = jQuery($event.target).attr('data-server-id');
        
        var x = null;
        for(var i = 0; i < $scope.servers.length; i++){
            if(String(serverid) == String($scope.servers[i]._id)){
                x = $scope.servers[i];
                $scope.server_id                        = x._id;
                $scope.server_name                      = x.name;
                $scope.server_type                      = x.type;
                $scope.server_group                     = x.group;
                $scope.server_domain_name               = x.full_domain;
                $scope.server_domain_registrar_url      = x.registrar_url;
                $scope.server_registrar_username        = x.registrar_user;
                $scope.server_registrar_password        = x.registrar_pass;
                $scope.server_hosting_service_url       = x.hosting_url;
                $scope.server_hosting_service_username  = x.hosting_user;
                $scope.server_hosting_service_password  = x.hosting_pass;
                $scope.server_hosting_service_ip        = x.hosting_ip;
                $scope.server_hosting_service_port      = x.hosting_port;
                $scope.server_mongodb_connstr           = x.connstr;
                $scope.server_mongodb_username          = x.mongodb_user;
                $scope.server_mongodb_password          = x.mongodb_pass;
                $scope.server_mongodb_host              = x.mongodb_host;
                $scope.server_mongodb_port              = x.mongodb_port;
                $scope.server_mongodb_database          = x.mongodb_dbname;
                break;
            }
        }
    };

    $scope.save_changes = function(){
        var data = {
            id:                 $scope.server_id,
            name:               $scope.server_name,
            group:              $scope.server_group,
            type:               $scope.server_type,
            full_domain:        $scope.domain_name,
            registrar_url:      $scope.server_domain_registrar_url,
            registrar_user:     $scope.server_registrar_username,
            registrar_pass:     $scope.server_registrar_password,
            hosting_url:        $scope.server_hosting_service_url,
            hosting_user:       $scope.server_hosting_service_username,
            hosting_pass:       $scope.server_hosting_service_password,
            hosting_ip:         $scope.server_hosting_service_ip,
            hosting_port:       $scope.server_hosting_service_port,
            mongodb_connstr:    $scope.server_mongodb_connstr,
            mongodb_user:       $scope.server_mongodb_username,
            mongodb_pass:       $scope.server_mongodb_password,
            mongodb_host:       $scope.server_mongodb_host,
            mongodb_port:       $scope.server_mongodb_port,
            mongodb_dbname:     $scope.server_mongodb_database
        };
        $http.post('update/server', data).success(function(data){
            if(data.response == "success"){
                $scope.draw_table();
                $('#editServerModal').modal('toggle');
            }
        });
    };

    $('#editServerModal').on('shown.bs.modal', function (e) {


    });

    $('#editServerModal').on('hidden.bs.modal', function (e) {
        // do something...
    });

    $scope.delete_server = function($event){
        var serverid = jQuery($event.target).attr('data-server-id');
        if(confirm("You are about to delete a server record, this action cannot be undone, do you want to continue?")){
            $http.post('delete/server', {_id: serverid}).success(function(data){

                $scope.draw_table();
            });            
        }
    };

    jQuery(document).ready(function(){
       $scope.draw_table();     
    });
}
]);