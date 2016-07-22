angular.module('autoaffiliate')
.controller('ShutdownadminController',[
'$http',
'$scope', 
'$location', 
'$routeParams',
function($http, $scope, $location, $routeParams){
    $scope.host = $routeParams.host;   
    
    jQuery(document).ready(function(){
        $http.post('/shutdown').success(function(res){
            if(res.response == "success"){
                alert("Success, server process exiting now!");
            }
            else{
                alert("Hmmm, something didn't go right, better manually shutdown the admin affiliate server!");
            }
        });
    });
}
]);