angular.module('autoaffiliate')
.controller('AddserverController',[
'$http',
'$scope', 
'$location', 
'$routeParams',
function($http, $scope, $location, $routeParams){
   $scope.add = function(){
        var data = {
            name:           $scope.name,
            group:          $scope.group,
            type:           $scope.type,
            full_domain:    $scope.fulldomainname,
            registrar_url:  $scope.registrarurl,
            registrar_user: $scope.registraruser,
            registrar_pass: $scope.registrarpass,
            hosting_url:    $scope.hostingurl,
            hosting_user:   $scope.hostinguser,
            hosting_pass:   $scope.hostingpass,
            hosting_ip:     $scope.hostingip,
            hosting_port:   $scope.hostingport,
            mongodb_connstr:$scope.mongodbconnstr,
            mongodb_user:   $scope.mongodbuser,
            mongodb_pass:   $scope.mongodbpass,
            mongodb_host:   $scope.mongodbhost,
            mongodb_port:   $scope.mongodbport,
            mongodb_dbname: $scope.mongodbdbname
        };
        
        $http.post("/add/server", data).success(function(data) {
            if(data.response == 'success'){
                
            }
            $location.path('/index');
        });
    }
}
]);