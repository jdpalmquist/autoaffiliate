angular.module('autoaffiliate')
.controller('LandersController',[
'$http',
'$scope', 
'$location', 
'$routeParams',
function($http, $scope, $location, $routeParams){
    $scope.host = $routeParams.host;
    $scope.remote_url = null;
    $scope.pages = [];
    $scope.page = {};
    $scope.page_index = 0;

    $scope.active_landers = [];

    $scope.remote_server = '';
    $scope.fullpath = '';

    $scope.init = function(){
        $scope.get_pages();
        $scope.get_active_landers();

        $('#active_landers_tab').on('click', function(e){
            e.preventDefault();
            $('#active_landers').tab('show');
        });

        $('#paused_landers_tab').on('click', function(e){
            e.preventDefault();
            $('#paused_landers').tab('show');
        });

        $('#create_lander_tab').on('click', function(e){
            e.preventDefault();
            $('#create_lander').tab('show');
        });
    };

    $scope.get_pages = function(){
        $http.get('/get/server/'+$scope.host).success(function(res1){
            if(res1.response == 'success'){
                var host = res1.data;

                $http.get('/'+$scope.host+'/get/all/pages').success(function(res2){
                    if(res2.response == 'success'){
                        $scope.pages = res2.data;
                        
                        $scope.remote_server = 'http://' + host.hosting_ip;
                        
                        if($scope.pages.length >= 1){
                            $scope.fullpath = $scope.remote_server + $scope.pages[$scope.page_index].url;
                            jQuery('#page-iframe').attr('src', $scope.fullpath);
                        }
                    }
                    else{

                    }                    
                });
            }
        });            
    };

    $scope.get_active_landers = function(){
        $http.get('/'+$scope.host+'/get/all/landers').success(function(res){
            if(res.response == "success"){
                $scope.active_landers = res.data;
            }
        });
    };

    $scope.next_page = function(){
        $scope.page_index++;                
        if($scope.page_index >= $scope.pages.length){
            $scope.page_index = 0;  
            $scope.fullpath = $scope.remote_server + $scope.pages[$scope.page_index].url;
            jQuery('#page-iframe').attr('src', $scope.fullpath);
            $scope.$apply();
        }
    };
    $scope.goto_page = function(i){
        if(i >= 0 && i < $scope.pages.length){
            $scope.page_index = parseInt(i);
            $scope.fullpath = $scope.remote_server + $scope.pages[$scope.page_index].url;
            jQuery('#page-iframe').attr('src', $scope.fullpath);
        }
    };
    $scope.prev_page = function(){
        $scope.page_index--;                
        if($scope.page_index < 0){
            $scope.page_index = $scope.pages.length - 1;
            $scope.fullpath = $scope.remote_server + $scope.pages[$scope.page_index].url
            jQuery('#page-iframe').attr('src', $scope.fullpath);
            $scope.$apply();
        }
    };

    $scope.load_create_lander_modal = function(){
        $scope.page = $scope.pages[$scope.page_index];
        $scope.lander_filepath = $scope.page.filepath;
        $scope.lander_url = $scope.page.url;
    };

    $scope.ismobile_toggle = function(){
        if($scope.lander_ismobile == true){
            $scope.lander_ismobile = false;
        }
        else{
            $scope.lander_ismobile = true;
        }
    };

    $scope.istablet_toggle = function(){
        if($scope.lander_istablet == true){
            $scope.lander_istablet = false;
        }
        else{
            $scope.lander_istablet = true;
        }
    };

    $scope.isdesktop_toggle = function(){
        if($scope.lander_isdesktop == true){
            $scope.lander_isdesktop = false;
        }
        else{
            $scope.lander_isdesktop = true;
        }
    };

    //create lander modal functionality
    $scope.create_lander = function(){
        
        var data = {
            lander_filepath:   $scope.lander_filepath,
            lander_name:       $scope.lander_name,
            lander_type:       $scope.lander_type,
            lander_group:      $scope.lander_group,
            lander_ismobile:   $scope.lander_ismobile,
            lander_istablet:   $scope.lander_istablet,
            lander_isdesktop:  $scope.lander_isdesktop,
            lander_tags:       $scope.lander_tags, 
            lander_url:        $scope.lander_url
        };

        $http.post('/' + $scope.host + '/create/lander', data).success(function(res){
            $scope.lander_filepath = '';
            $scope.lander_name = '';
            $scope.lander_type = '';
            $scope.lander_group = '';
            $scope.lander_ismobile = false;
            $scope.lander_istablet = false;
            $scope.lander_isdesktop = false;
            $scope.lander_tags = '';
            $scope.lander_url = '';
            $('#createLanderModal').modal('toggle');
            $scope.get_active_landers();
        });
    };

    $scope.edit_lander = function($event){
        console.log('TODO: LandersController --> finish the edit_lander page!');
    };

    $scope.delete_lander = function($event){
        var lander_id = jQuery($event.target).attr('data-lander-id');
        if(confirm('You are about to delete a lander, this action cannot be undone, do you want to continue?')){
            $http.post('/' + $scope.host + '/delete/lander', {lander_id: lander_id}).success(function(res){
                if(res.response == 'success'){
                    
                }
                $scope.get_active_landers();
            });
        }
    };

    jQuery(document).ready(function(){
        $scope.init();
    });
}
]);