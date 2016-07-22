angular.module('autoaffiliate')
.controller('NavController',[
'$http',
'$scope', 
'$location', 
'$routeParams',
function($http, $scope, $location, $routeParams){
    //get the host name
    $scope.host = $routeParams.host;
    if($scope.host == '' || $scope.host == ''){
        $scope.host = '(No domain chosen)';
    }

    //use the host name to lookup the given ip address for the host
    $scope.remote_host_ip = 'undefined';
    $http.get('/'+$scope.host+'/exchange/ip').success(function(res){
        if(res.response == "success"){
            $scope.remote_host_ip = res.data;
        }
        else{
            //?? wat doo?
        }
    });
}
]);