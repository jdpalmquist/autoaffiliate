angular.module('autoaffiliate')
.controller('DashboardController',[
'$http',
'$scope', 
'$location', 
'$routeParams',
function($http, $scope, $location, $routeParams){
    $scope.host = $routeParams.host;

    $scope.init = function(){

    };

    

    jQuery(document).ready(function(){
        $scope.init();
    });
}
]);