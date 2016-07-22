angular.module('autoaffiliate')
.controller('CampaigneditController',[
'$http',
'$scope', 
'$location', 
'$routeParams',
function($http, $scope, $location, $routeParams){
    //get the url variables first
    $scope.host = $routeParams.host;
    $scope.name = $routeParams.name;

    $scope.add_landers_link = '#/'+$scope.host+'/campaign/'+$scope.name+'/add/landers';
    $scope.add_trafficsrc_link = '#/'+$scope.host+'/campaign/'+$scope.name+'/add/trafficsrc';

    $scope.c = null;

    //general campaign meta data
    $scope.createdAt = null;
    $scope.active = null;
    $scope.group = null;
    $scope.type = null;
    $scope.is_mobile = null;
    $scope.is_desktop = null;
    $scope.slug = null;
    $scope.total_expenses = 0.0;
    $scope.gross_revenue = 0.0;
    $scope.net_profit = 0.0;
    $scope.total_pv = 0;
    $scope.total_lg = 0;
    $scope.total_cv = 0;
    $scope.phase = null;
    $scope.phase_interval = null;
    $scope.lander_index = null;
    $scope.all_landers = [];
    $scope.active_landers = [];
    $scope.removed_landers = null;
    $scope.traffic_src = null;
    $scope.offer = null;
    $scope.stats = null; 


    /*Offer Data*/
    $scope.all_offers = [];
    $scope.offer_created = '';
    $scope.offer_name = ''; 
    $scope.offer_active = '';
    $scope.offer_group = '';
    $scope.offer_redirect_url = '';
    $scope.offer_type = '';
    $scope.offer_ismobile = '';   
    $scope.offer_isdesktop = '';
    $scope.offer_epa = '';
    $scope.offer_conversions = '';
    $scope.offer_campaign = '';
    //Offer Data: Available offers (for offer info that is not the current offer)
    $scope.av_offer_name = '';
    $scope.av_offer_type = '';
    $scope.av_offer_group = '';
    $scope.av_offer_ismobile = '';
    $scope.av_offer_isdesktop = '';
    $scope.av_offer_epa = '';
    $scope.av_offer_conversions = '';


    /*
        created:        {type: Date,    required: false, default: Date.now},
        login_url:      {type: String,  required: false, default: ''},
        login_username: {type: String,  required: false, defualt: ''},
        login_password: {type: String,  required: false, default: ''},
        name:           {type: String,  required: false, default: ''},
        active:         {type: Boolean, required: false, default: true},
        type:           {type: String,  required: false, default: ''},
        group:          {type: String,  required: false, default: ''},
        ad_type:        {type: String,  required: false, default: ''},
        ad_img:         {type: String,  required: false, default: ''},
        is_cpc:         {type: Boolean, required: false, default: false},
        is_cpm:         {type: Boolean, required: false, default: false},
        cpa:            {type: Number,  required: false, default: 0},
        inbound_clicks: {type: Number,  required: false, default: 0},
    */


    /*Traffic Source Data*/
    $scope.all_trafficsrcs = [];
    $scope.trafficsrc_created = '';
    $scope.trafficsrc_name = '';
    $scope.trafficsrc_active = '';
    $scope.trafficsrc_type = '';
    $scope.trafficsrc_group = '';
    $scope.trafficsrc_ad_type = '';
    $scope.trafficsrc_ad_img = '';
    $scope.trafficsrc_is_cpc = '';
    $scope.trafficsrc_is_cpm = '';
    $scope.trafficsrc_cpa = '';
    $scope.trafficsrc_login_url = '';
    $scope.trafficsrc_login_username = '';
    $scope.trafficsrc_login_password = '';


    $scope.trafficsrc_av_id = '';
    $scope.trafficsrc_av_name = '';
    $scope.trafficsrc_av_active = '';
    $scope.trafficsrc_av_type = '';
    $scope.trafficsrc_av_group = '';
    $scope.trafficsrc_av_ad_type = '';
    $scope.trafficsrc_av_ad_img = '';
    $scope.trafficsrc_av_is_cpc = '';
    $scope.trafficsrc_av_is_cpm = '';
    $scope.trafficsrc_av_cpa = '';

    $scope.init = function(){
        $scope.get_campaign_data();
        $scope.get_active_landers();
        $scope.get_all_offers();
        $scope.get_all_trafficsrcs();
        

        //Tab Bindings
        //jQuery('#campaign-tab-link').trigger('click');
        jQuery('#info_tab').on('click', function(e){
            e.preventDefault();
            $('#info').tab('show');
        });
        jQuery('#offer_tab').on('click', function(e){
            e.preventDefault();
            $('#offer').tab('show');
        });
        jQuery('#lander_tab').on('click', function(e){
            e.preventDefault();
            $('#lander').tab('show');
        });
        jQuery('#trafficsrc_tab').on('click', function(e){
            e.preventDefault();
            $('#trafficsrc').tab('show');
            $scope.set_current_trafficsrc_fields($scope.traffic_src);
        });
    };

    $scope.get_campaign_data = function(){
        $http.get('/'+$scope.host+'/get/campaign/'+$scope.name).success(function(data){
            $scope.parse_campaign_data(data);
        });
    };
    
    //this function that will take the campaign object response
    //  and parse it 
    $scope.parse_campaign_data = function(data){
        $scope.c = data;
        
        $scope.createdAt        = moment($scope.c.createdAt).format('dddd MMMM Do, YYYY');
        $scope.active           = $scope.c.active;
        $scope.group            = $scope.c.group;
        $scope.type             = $scope.c.type;
        $scope.is_mobile        = $scope.c.is_mobile;
        $scope.is_desktop       = $scope.c.is_desktop;
        $scope.slug             = $scope.c.slug;
        $scope.total_expenses   = 0.0;
        $scope.gross_revenue    = 0.0;
        $scope.net_profit       = 0.0;
        $scope.total_pv         = $scope.c.total_pv;
        $scope.total_lg         = $scope.c.total_lg;
        $scope.total_cv         = $scope.c.total_cv;
        $scope.phase            = $scope.c.phase;
        $scope.phase_interval   = $scope.c.phase_interval;
        $scope.lander_index     = $scope.c.lander_index;
        $scope.active_landers   = $scope.c.active_landers;
        $scope.removed_landers  = $scope.c.removed_landers;
        $scope.traffic_src      = $scope.c.traffic_src;
        $scope.offer            = $scope.c.offer;
        $scope.stats            = $scope.c.stats; 

        if(typeof $scope.offer != 'undefined' && $scope.offer != null){
            $scope.offer_name = $scope.offer.name;
            $scope.offer_type = $scope.offer.type;
            $scope.offer_group = $scope.offer.group;
            $scope.offer_redirect_url = $scope.offer.redirect_url;
            $scope.offer_ismobile = $scope.offer.is_mobile;
            $scope.offer_isdesktop = $scope.offer.is_desktop;
            $scope.offer_epa = $scope.offer.epa;
            $scope.offer_conversions = $scope.offer.conversions;
        }

        if(typeof $scope.traffic_src != 'undefined' && $scope.traffic_src != null){
            console.log('DEBUG: CAMPAIGN EDIT CONTROLLER --> parse_campaign_data() --> traffic_src: ', $scope.traffic_src);
            $scope.set_current_trafficsrc_fields($scope.traffic_src);
        }
    };   

    $scope.get_all_offers = function(){
        $http.get('/'+$scope.host+'/get/all/offers/json').success(function(res){
            if(res.response == 'success'){
                $scope.all_offers = res.data;
                $scope.load_offer_select();
            }
        });
    };

    $scope.load_offer_select = function(){
        var h = '<option val="" selected="selected">Available Offers...</option>',
            val = '',
            name = '';
        for(var i = 0; i < $scope.all_offers.length; i++){
            if( $scope.all_offers[i].name != '' && 
                $scope.all_offers[i].name != null && 
                typeof $scope.all_offers != 'undefined'){
                name = $scope.all_offers[i].name;
                val = $scope.all_offers[i]._id;
                
                h += '<option val="'+val+'">';
                    h += name;
                h += '</option>';
            }
        }
        jQuery('#offer_select').html(h);

        jQuery('#offer_select').on('change', function(){
            var name = jQuery('#offer_select').val();
            if(name != ''){
                for(var i = 0; i < $scope.all_offers.length; i++){
                    if( typeof $scope.all_offers[i].name != 'undefined' && 
                        name == $scope.all_offers[i].name){

                        $scope.set_available_offer_fields($scope.all_offers[i]);
                    }
                }
            }
        });
    };

    $scope.set_current_offer_fields = function(o){
        $scope.offer_id = o._id;
        $scope.offer_name = o.name;
        $scope.offer_type = o.type;
        $scope.offer_group = o.group;
        $scope.offer_redirect_url = o.redirect_url;
        $scope.offer_ismobile = o.is_mobile;
        $scope.offer_isdesktop = o.is_desktop;
        $scope.offer_epa = o.epa;
        $scope.offer_conversions = o.conversions;
    };

    $scope.set_available_offer_fields = function(o){
        $scope.av_offer_id = o._id;
        $scope.av_offer_name = o.name;
        $scope.av_offer_type = o.type;
        $scope.av_offer_group = o.group;
        $scope.av_offer_redirect_url = o.redirect_url;
        $scope.av_offer_ismobile = o.is_mobile;
        $scope.av_offer_isdesktop = o.is_desktop;
        $scope.av_offer_epa = o.epa;
        $scope.av_offer_conversions = o.conversions;
        $scope.$apply();
    };

    $scope.set_as_current_offer = function(){
        if($scope.av_offer_id != '' && $scope.av_offer_id != null && typeof $scope.av_offer_id != 'undefined'){
            var data = {offer_id: $scope.av_offer_id};
            $http.post('/'+$scope.host+'/campaign/'+$scope.name+'/set/offer',data).success(function(res){
                if(res.response == 'success'){
                    var offer = res.data;
                    $scope.set_current_offer_fields(offer);
                }
            });
        }
    };

    //Active landers are landers that are attached to the given campaign and have a status of "active"
    $scope.get_active_landers = function(){
        $http.get('/' + $scope.host + '/campaign/'+ $scope.name+'/get/active/landers').success(function(res){
            //console.log('DEBUG: CAMPAIGN CONTROLLER --> get_active_landers() --> res: ', res);
            if(res.response == 'success'){
                $scope.active_landers = res.data.landers;

                console.log('DEBUG: CAMPAIGN EDIT CONTROLLER --> get_active_landers() --> res: ', res);
            }
        });
    }; 

    $scope.get_all_trafficsrcs = function(){
        $http.get('/'+$scope.host+'/get/trafficsources').success(function(res){
            if(res.response == 'success'){
                $scope.all_trafficsrcs = res.data;
                $scope.load_trafficsrc_select();
            }
        });
    };

    $scope.load_trafficsrc_select = function(){
        var h = '<option val="" selected="selected">Available Traffic Sources...</option>',
            val = '',
            name = '';
        for(var i = 0; i < $scope.all_trafficsrcs.length; i++){
            if( $scope.all_trafficsrcs[i].name != '' && 
                $scope.all_trafficsrcs[i].name != null && 
                typeof $scope.all_trafficsrcs != 'undefined'){
                name = $scope.all_trafficsrcs[i].name;
                val = $scope.all_trafficsrcs[i]._id;
                
                h += '<option val="'+val+'">';
                    h += name;
                h += '</option>';
            }
        }
        jQuery('#trafficsrc_select').html(h);

        jQuery('#trafficsrc_select').on('change', function(){
            var name = jQuery('#trafficsrc_select').val();
            if(name != ''){
                for(var i = 0; i < $scope.all_trafficsrcs.length; i++){
                    if( typeof $scope.all_trafficsrcs[i].name != 'undefined' && 
                        name == $scope.all_trafficsrcs[i].name){

                        $scope.set_available_trafficsrc_fields($scope.all_trafficsrcs[i]);
                    }
                }
            }
        });
    };

    $scope.set_current_trafficsrc_fields = function(t){
        $scope.trafficsrc_name = t.name;
        $scope.trafficsrc_type = t.type;
        $scope.trafficsrc_group = t.group;
        $scope.trafficsrc_active = t.active;
        $scope.trafficsrc_is_cpc = t.is_cpc;
        $scope.trafficsrc_is_cpm = t.is_cpm;
        $scope.trafficsrc_cpa = t.cpa;
        $scope.trafficsrc_ad_type = t.ad_type;
        $scope.trafficsrc_ad_img = t.ad_img;
    };

    $scope.set_available_trafficsrc_fields = function(t){
        //
        $scope.trafficsrc_av_id = t._id;
        $scope.trafficsrc_av_name = t.name;
        $scope.trafficsrc_av_type = t.type;
        $scope.trafficsrc_av_group = t.group;
        $scope.trafficsrc_av_active = t.active;
        $scope.trafficsrc_av_is_cpc = t.is_cpc;
        $scope.trafficsrc_av_is_cpm = t.is_cpm;
        $scope.trafficsrc_av_cpa = t.cpa;
        $scope.trafficsrc_av_ad_type = t.ad_type;
        $scope.trafficsrc_av_ad_img = t.ad_img;

        $scope.$apply();
    };

    $scope.set_as_current_trafficsrc = function(){
        if($scope.trafficsrc_av_id != '' && $scope.trafficsrc_av_id != null && typeof $scope.trafficsrc_av_id != 'undefined'){
            var data = {trafficsrc_id: $scope.trafficsrc_av_id};
            $http.post('/'+$scope.host+'/campaign/'+$scope.name+'/set/trafficsrc',data).success(function(res){
                if(res.response == 'success'){
                    var trafficsrc = res.data;
                    $scope.set_current_trafficsrc_fields(trafficsrc);
                }
            });
        }
    };


    $scope.delete_campaign = function(){
        if(confirm('You are about to delete this campaign, this action cannot be undone, do you want to continue?')){
            $http.get('/'+$scope.host+'/campaign/'+$scope.name+'/delete').success(function(res){
                if(res.response == 'success'){
                    $location.path('/'+$scope.host+'/campaigns');
                }
            });
        }
    };

    $scope.update_campaign_meta_data = function(){
        var data = {
            slug: $scope.slug,
            type: $scope.type,
            group: $scope.group,
            phase: $scope.phase,
            phase_interval: $scope.phase_interval,
            is_mobile: $scope.is_mobile,
            is_desktop: $scope.is_desktop
        };

        $http.post('/'+$scope.host+'/campaign/'+$scope.name+'/update/meta', data).success(function(res){
            if(res.response == "success"){
                alert('Successfully Updated!');
            }
            else{
                alert('Update Failed!');
            }
        });
    };

    $scope.remove_lander = function($event){
        var lander_id = jQuery($event.target).attr('data-lander-id');
        $http.get('/'+$scope.host+'/campaign/'+$scope.name+'/delete/lander/'+lander_id).success(function(res){
            if(res.response == 'success'){
                $scope.get_campaign_data();
            }
        });
    };

    $scope.pause_campaign = function(){
        $http.get('/'+$scope.host+'/campaign/'+$scope.name+'/pause').success(function(res){
            if(res.response == "success" && res.data.nModified >= 1){
                $scope.active = !$scope.active;
            }
        });
    };

    $scope.start_campaign = function(){
        $http.get('/'+$scope.host+'/campaign/'+$scope.name+'/activate').success(function(res){
            if(res.response == "success" && res.data.nModified >= 1){
                $scope.active = !$scope.active;
            }
        });
    };

    jQuery(document).ready(function(){
        $scope.init();
    });
}
]);