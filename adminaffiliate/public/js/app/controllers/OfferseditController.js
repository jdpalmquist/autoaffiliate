angular.module('autoaffiliate')
.controller('OfferseditController',[
'$http',
'$scope', 
'$location', 
'$routeParams',
function($http, $scope, $location, $routeParams){
    $scope.host = $routeParams.host;
    $scope.offerid = $routeParams.offerid;

    $scope.offer_id = '';
    $scope.offer_name = '';
    $scope.offer_type = '';
    $scope.offer_group = '';
    $scope.offer_redirect_url = '';
    $scope.offer_ismobile = false;
    $scope.offer_isdesktop = false;
    $scope.offer_epa = 0.0;
    $scope.offer_conversions = 0;

    $scope.init = function(){
        $scope.get_offer();
    };

    $scope.get_offer = function(){
        $http.get('/'+$scope.host+'/get/offer/'+$scope.offerid).success(function(res){
            if(res.response == "success"){
                $scope.offer_id = res.data._id;
                $scope.offer_name = res.data.name;
                $scope.offer_type = res.data.type;
                $scope.offer_group = res.data.group;
                $scope.offer_redirect_url = res.data.redirect_url;
                $scope.offer_ismobile = res.data.is_mobile;
                $scope.offer_isdesktop = res.data.is_desktop;
                $scope.offer_epa = res.data.epa;
                $scope.offer_conversions = res.data.conversions;

                //set the is-mobile and is-desktop attributes
                if($scope.offer_ismobile)
                    $scope.ismobile_toggle();

                if($scope.offer_isdesktop)
                    $scope.isdesktop_toggle();
            }
        });
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


    $scope.update_offer = function(){
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

        offer['is_mobile'] = $scope.offer_ismobile;

        offer['is_desktop'] = $scope.offer_isdesktop;

        if($scope.offer_epa != null && $scope.offer_epa != ''){
            offer['epa'] = $scope.offer_epa;
        }

        if(!abort){
            var url = '/'+$scope.host+'/update/offer/'+$scope.offer_id;

            $http.post(url, offer).success(function(res){

                console.log('DEBUG: OfferseditController --> update offer() --> res: ', res);
    
                if(res.response == 'success'){
                    alert('Successfully Updated!');
                }
                else{
                    alert('Failed to Update');
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