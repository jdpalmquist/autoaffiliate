angular.module('autoaffiliate')
.controller('CampaignsController',[
'$http',
'$scope', 
'$location', 
'$routeParams',
function($http, $scope, $location, $routeParams){
    $scope.host = $routeParams.host;   
    
    //stats
    $scope.num_active_campaigns = 0;
    $scope.num_paused_campaigns = 0;

    //general campaign meta data
    $scope.name = null;
    $scope.slug = null;
    $scope.type = null;
    $scope.group = null;
    $scope.is_mobile = null;
    $scope.is_desktop = null;

    $scope.init = function(){
        $('#active_campaigns_tab').click(function (e) {
          e.preventDefault();
          $('#active_campaigns').tab('show');
        });
        $('#active_campaigns_tab').trigger('click');

        $('#paused_campaigns_tab').click(function (e) {
          e.preventDefault();
          $('#paused_campaigns_tab').tab('show');
        });

        $scope.get_active_campaigns_data();
        $scope.get_paused_campaigns_data();
    };

    $scope.ismobile_toggle = function(){
        if($scope.is_mobile == true){
            $scope.is_mobile = false;
        }
        else{
            $scope.is_mobile = true;
        }
    };

    $scope.isdesktop_toggle = function(){
        if($scope.is_desktop == true){
            $scope.is_desktop = false;
        }
        else{
            $scope.is_desktop = true;
        }
    };

    $scope.validate = function(){
        /*
            Required Params: 
            ================
            name,
            slug
        */

        var msg = 'Please fix the following errors:\n\n';
        var chk = true;

        if($scope.name == ''){
            msg += '-- Missing Name!\n\n';
            chk = false;
        }
        if($scope.slug == ''){
            msg += '-- Missing URL Slug!\n\n';
            chk = false;
        }

        if(!chk){
            alert(msg);
        }

        return chk;
    };

    $scope.create_campaign = function(){
        if($scope.validate()){
            var c = {
                name: $scope.name,
                slug: $scope.slug,
                type: $scope.type,
                group: $scope.group,
                is_mobile: $scope.is_mobile,
                is_desktop: $scope.is_desktop
            };

            $http.post('/'+$scope.host+'/create/campaign', c).success(function(res){
                if(res.response == 'success'){
                    $scope.get_campaigns_stats();
                    

                    jQuery('#createCampaignModal').modal('toggle');
                }
            });
        }
    };

    $scope.get_all_campaigns = function(){
        $http.get('/'+$scope.host+'/get/all/campaigns').success(function(res){
            if(res.response == 'success'){
                $scope.num_active_campaigns = 0;
                $scope.num_paused_campaigns = 0;
                var campaign = null;
                for(var i = 0; i < res.data.length; i++){
                    campaign = res.data[i];
                    if(campaign.active){
                        $scope.num_active_campaigns++;
                    }
                    if(!campaign.active){
                        $scope.num_paused_campaigns++;
                    }
                }
            }
        });
    };

    $scope.get_active_campaigns_data = function(){
        $('#active_campaigns_datatable').DataTable( {
            "ajax": '/'+$scope.host+'/get/all/active/campaigns'
        });        
    };

    $scope.get_paused_campaigns_data = function(){
        $('#paused_campaigns_datatable').DataTable( {
            "ajax": '/'+$scope.host+'/get/all/paused/campaigns'
        });        
    };

    jQuery(document).ready(function(){
        $scope.init();
    });
}
]);