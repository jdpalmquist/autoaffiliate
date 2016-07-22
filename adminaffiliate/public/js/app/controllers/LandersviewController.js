angular.module('autoaffiliate')
.controller('LandersviewController',[
'$http',
'$scope', 
'$location', 
'$routeParams',
function($http, $scope, $location, $routeParams){
    //get the url variables first
    $scope.host = $routeParams.host;
    $scope.lander_id = $routeParams.landerid;
    $scope.lander = null;

    $scope.url = '';

    $scope.init = function(){
        $scope.get_lander();
    };

    $scope.get_lander = function(){
        $http.get('/'+$scope.host+'/get/lander/'+$scope.lander_id).success(function(res){
            console.log('DEBUG: LandersviewController --> get_lander() --> res: ', res);
            if(res.response == 'success'){
                $scope.lander = res.data;
                if($scope.lander != null && typeof $scope.lander != 'undefined'){
                    $scope.url = $scope.lander.url;

                    jQuery('#page-iframe').attr('src', $scope.url);
                }
            }
        });
    };

    jQuery(document).ready(function(){
        $scope.init();
    });
}
]);