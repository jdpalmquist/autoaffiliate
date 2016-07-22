angular.module('autoaffiliate')
.controller('OffersController',[
'$http',
'$scope', 
'$location', 
'$routeParams',
function($http, $scope, $location, $routeParams){
    $scope.host = $routeParams.host;

    $scope.offer_name = '';
    $scope.offer_type = '';
    $scope.offer_group = '';
    $scope.offer_redirect_url = '';
    $scope.offer_callback_var = '';

    console.log('TODO: ADD THE FUNCTIONALITY FOR THE CALLBACK VAR TO THE OFFER PROCESS! IT WILL FAIL WITHOUT IT!');

    $scope.offer_ismobile = false;
    $scope.offer_isdesktop = false;
    $scope.offer_epa = 0.0;

    $scope.active_offers = [];

    $scope.init = function(){
        $scope.get_offers();

        $('#active_offer_tab').on('click', function(e){
            e.preventDefault();
            $('#active_offers').tab('show');
        });

        $('#paused_offer_tab').on('click', function(e){
            e.preventDefault();
            $('#paused_offers').tab('show');
        });        

    };

    $scope.get_offers = function(){
        $http.get('/'+$scope.host+'/get/all/offers/json').success(function(res){
            if(res.response == 'success'){
                $scope.active_offers = res.data;
            }
        });
    };


    $scope.show_create_offer_modal = function(){
        jQuery('#createOfferModal').modal('toggle');
    };

    $scope.ismobile_toggle = function(){
        if($scope.offer_ismobile == true){
            $scope.offer_ismobile = false;
        }
        else{
            $scope.offer_ismobile = true;
        }
    };

    $scope.isdesktop_toggle = function(){
        if($scope.offer_isdesktop == true){
            $scope.offer_isdesktop = false;
        }
        else{
            $scope.offer_isdesktop = true;
        }
    };


    $scope.create_offer = function(){
        var offer = {};

        var abort = false;
        var abort_msg = 'Please fix the following:\n\n';


        if($scope.offer_name != '' && $scope.offer_name != null){
            offer['name'] = $scope.offer_name;
        }
        else{
            abort_msg += '-- Missing Offer Name!\n\n';
            abort = true;
        }

        if($scope.offer_type != '' && $scope.offer_type != null){
            offer['type'] = $scope.offer_type;
        }

        if($scope.offer_group != '' && $scope.offer_group != null){
            offer['group'] = $scope.offer_group;
        }

        if($scope.offer_redirect_url != '' && $scope.offer_redirect_url != null){
            offer['redirect_url'] = $scope.offer_redirect_url;
        }
        else{
            abort_msg += '-- Missing Offer Redirect URL!\n\n';
            abort = true;
        }

        if($scope.offer_callback_var != '' && $scope.offer_callback_var != null){
            offer['callback_var'] = $scope.offer_callback_var;
        }
        else{
            abort_msg += '-- Missing Offer Callback Var!\n\n';
            abort = true;
        }

        offer['is_mobile'] = $scope.offer_ismobile;

        offer['is_desktop'] = $scope.offer_isdesktop;

        if($scope.offer_epa != null && $scope.offer_epa != ''){
            offer['epa'] = $scope.offer_epa;
        }

        if(!abort){
            $http.post('/'+$scope.host+'/create/offer', offer).success(function(res){
                if(res.response == 'success'){
                    jQuery('#createOfferModal').modal('toggle');
                }
            });
        }
        else{
            alert(abort_msg);
        }
    };

    jQuery(document).ready(function(){
        $scope.init();
    });
}
]);