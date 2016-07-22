angular.module('autoaffiliate')
.controller('TrafficsourceseditController',[
'$http',
'$scope', 
'$location', 
'$routeParams',
function($http, $scope, $location, $routeParams){
    $scope.host = $routeParams.host;
    $scope.tid = $routeParams.trafficsrcid

    $scope.trafficsrc_name = '';
    $scope.trafficsrc_active = '';
    $scope.trafficsrc_type = '';
    $scope.trafficsrc_group = '';
    $scope.trafficsrc_login_url = '';
    $scope.trafficsrc_login_username = '';
    $scope.trafficsrc_login_password = '';
    $scope.trafficsrc_iscpc = false;
    $scope.trafficsrc_iscpm = false;
    $scope.trafficsrc_cpa = 0.0; //cost per action
    $scope.trafficsrc_adtype = '';
    $scope.trafficsrc_adimg = '';
    

    $scope.init = function(){
        $scope.get_traffic_source();
    };

    $scope.get_traffic_source = function(){
        $http.get('/'+$scope.host+'/get/trafficsource/'+$scope.tid).success(function(res){
            if(res.response == "success"){
                var t = res.data;                

                $scope.trafficsrc_name = t.name;
                $scope.trafficsrc_type = t.type;
                $scope.trafficsrc_group = t.group;
                $scope.trafficsrc_active = t.active;
                $scope.trafficsrc_iscpc = t.is_cpc;
                $scope.trafficsrc_iscpm = t.is_cpm;
                $scope.trafficsrc_cpa = t.cpa;
                $scope.trafficsrc_adtype = t.adtype;
                $scope.trafficsrc_adimg = t.adimg;
                $scope.trafficsrc_login_url = t.login_url;
                $scope.trafficsrc_login_username = t.login_username;
                $scope.trafficsrc_login_password = t.login_password;
            }
        });
    };

    $scope.validate = function(){
        return true;
    };

    $scope.update_trafficsrc = function(){
        if($scope.validate()){
            var data = {
                name: $scope.trafficsrc_name,
                type: $scope.trafficsrc_type,
                group: $scope.trafficsrc_group,
                active: $scope.trafficsrc_active,
                is_cpc: $scope.trafficsrc_iscpc,
                is_cpm: $scope.trafficsrc_iscpm,
                cpa: $scope.trafficsrc_cpa,
                adtype: $scope.trafficsrc_adtype,
                adimg: $scope.trafficsrc_adimg,
                login_url: $scope.trafficsrc_login_url,
                login_username: $scope.trafficsrc_login_username,
                login_password: $scope.trafficsrc_login_password
            };

            $http.post('/'+$scope.host+'/update/trafficsource/'+$scope.tid, data).success(function(res){
                if(res.response == "success"){
                    $location.path('/'+$scope.host+'/trafficsources');
                }
            });
        }
    };

    jQuery(document).ready(function(){
        $scope.init();
    });
}
]);