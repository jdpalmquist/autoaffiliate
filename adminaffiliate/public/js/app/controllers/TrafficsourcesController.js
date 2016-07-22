angular.module('autoaffiliate')
.controller('TrafficsourcesController',[
'$http',
'$scope', 
'$location', 
'$routeParams',
function($http, $scope, $location, $routeParams){
    $scope.host = $routeParams.host;

    $scope.active_trafficsrcs = [];
    $scope.paused_trafficsrcs = [];

    $scope.trafficsrc_name = '';
    $scope.trafficsrc_type = '';
    $scope.trafficsrc_group = '';
    $scope.trafficsrc_active = '';
    $scope.trafficsrc_login_url = '';
    $scope.trafficsrc_login_username = '';
    $scope.trafficsrc_login_password = '';
    $scope.trafficsrc_iscpc = false;
    $scope.trafficsrc_iscpm = false;
    $scope.trafficsrc_cpa = 0.0; //cost per action
    $scope.trafficsrc_adtype = '';
    $scope.trafficsrc_adimg = '';
    

    $scope.init = function(){
        $scope.get_active_traffic_sources();
        $scope.get_paused_traffic_sources();

        $('#active_trafficsrc_tab').on('click', function(e){
            e.preventDefault();
            $('#active_trafficsrc').tab('show');
        });

        $('#paused_trafficsrc_tab').on('click', function(e){
            e.preventDefault();
            $('#paused_trafficsrc').tab('show');
        });
    };

    $scope.get_active_traffic_sources = function(){
        $http.get('/'+$scope.host+'/get/active/trafficsources').success(function(res){
            if(res.response == "success"){
                $scope.active_trafficsrcs = res.data;
                /*
                    login_url:      {type: String,  required: false, default: ''},
                    login_username: {type: String,  required: false, defualt: ''},
                    login_password: {type: String,  required: false, default: ''},
                    name:           {type: String,  required: false, default: ''},
                    type:           {type: String,  required: false, default: ''},
                    ad_type:        {type: String,  required: false, default: ''},
                    ad_img:         {type: String,  required: false, default: ''},
                    is_cpc:         {type: Boolean, required: false, default: false},
                    is_cpm:         {type: Boolean, required: false, default: false},
                    cpa:            {type: Number,  required: false, default: 0},
                    inbound_clicks: {type: Number,  required: false, default: 0},
                */
            }
        });
    };

    $scope.get_paused_traffic_sources = function(){
        $http.get('/'+$scope.host+'/get/active/trafficsources').success(function(res){
            if(res.response == "success"){
                $scope.paused_trafficsrcs = res.data;
                /*
                    login_url:      {type: String,  required: false, default: ''},
                    login_username: {type: String,  required: false, defualt: ''},
                    login_password: {type: String,  required: false, default: ''},
                    name:           {type: String,  required: false, default: ''},
                    type:           {type: String,  required: false, default: ''},
                    ad_type:        {type: String,  required: false, default: ''},
                    ad_img:         {type: String,  required: false, default: ''},
                    is_cpc:         {type: Boolean, required: false, default: false},
                    is_cpm:         {type: Boolean, required: false, default: false},
                    cpa:            {type: Number,  required: false, default: 0},
                    inbound_clicks: {type: Number,  required: false, default: 0},
                */
            }
        });
    };

    $scope.show_create_trafficsrc_modal = function(){
        jQuery('#createTrafficsrcModal').modal('toggle');
    };

    $scope.hide_create_trafficsrc_modal = function(){
        jQuery('#createTrafficsrcModal').modal('toggle');
    };

    $scope.validate = function(){
        var chk = true;

        var msg = "Please fix the following problems:\n\n";

        if($scope.trafficsrc_name == null || $scope.trafficsrc_name == ''){
            chk = false;
            msg += "-- missing traffic source name\n";
        }

        //todo: add a check for traffic source type and cost (cpc or cpm)

        if(!chk){
            alert(msg);
        }

        return chk;
    };

    $scope.create_trafficsrc = function(){
        if($scope.validate()){
            var data = {
                name:           $scope.trafficsrc_name,
                type:           $scope.trafficsrc_type,
                group:          $scope.trafficsrc_group,
                is_cpc:         $scope.trafficsrc_iscpc,
                is_cpm:         $scope.trafficsrc_iscpm,
                cpa:            $scope.trafficsrc_cpa,
                login_url:      $scope.trafficsrc_login_url,
                login_username: $scope.trafficsrc_login_username,
                login_password: $scope.trafficsrc_login_password,
                ad_type:        $scope.trafficsrc_adtype,
                ad_img:         $scope.trafficsrc_adimg
            };

            $http.post('/'+$scope.host+'/create/trafficsource', data).success(function(res){
                if(res.response == 'success'){
                    $scope.hide_create_trafficsrc_modal();
                    $scope.get_active_traffic_sources();
                    $scope.get_paused_traffic_sources();
                }
            });
        }
    };

    jQuery(document).ready(function(){
        $scope.init();
    });
}
]);