angular.module('autoaffiliate')
.controller('CampaignaddlandersController',[
'$http',
'$scope', 
'$location', 
'$routeParams',
function($http, $scope, $location, $routeParams){
    //get the url variables first
    $scope.host = $routeParams.host;
    $scope.name = $routeParams.name;

    $scope.back_to_campaign_url = '#/'+$scope.host+'/campaign/'+$scope.name+'/edit'; 

    $scope.all_landers = [];
    $scope.active_landers = [];
    
    $scope.init = function(){
        //$scope.get_active_landers();
        $scope.get_all_landers();
    };


    $scope.add_lander_to_pool = function($event){
        var data = {
            lander_id: jQuery($event.target).attr('data-lander-id'),
        };
        if(data.lander_id != null && data.lander_id != '' && typeof data.lander_id != 'undefined'){
            $http.post('/'+$scope.host+'/campaign/'+$scope.name+'/add/lander', data).success(function(res){
                if(res.response == 'success'){
                    $scope.show_added_message();
                }
            });
        }
    };
    
    //All landers are all landers that may or may not be attached to the current campaign
    $scope.get_all_landers = function(){
        $http.get('/' + $scope.host + '/get/all/landers/json').success(function(res){
            console.log('DEBUG: CAMPAIGN CONTROLLER --> get_all_landers() --> res: ', res);
            if(res.response == 'success'){
                $scope.all_landers = res.data;
            }
        });
    };

    //flash a message
    $scope.show_added_message = function(name){
        //campaign-add-landers-msg
        var el1 = jQuery('#campaign-add-landers-msg');
        el1.html('');
        el1.html('<b>Added!</b>');
        el1 = jQuery('#campaign-add-landers-msg-container');
                
        if(el1.hasClass('display-none')){
            el1.removeClass('display-none');
        }
        
        setTimeout(function(){
            console.log('DEBUG: CAMPAIGN ADD LANDERS CONTROLLER --> show_added_message');
            var el2 = jQuery('#campaign-add-landers-msg-container');
            el2.addClass('display-none');
            el2 = jQuery('#campaign-add-landers-msg');
            el2.html('');            
        }, 5000);
    };

    jQuery(document).ready(function(){
        $scope.init();
    });
}
]);