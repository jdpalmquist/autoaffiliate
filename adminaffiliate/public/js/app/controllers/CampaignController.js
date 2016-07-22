angular.module('autoaffiliate')
.controller('CampaignController',[
'$http',
'$scope', 
'$location', 
'$routeParams',
function($http, $scope, $location, $routeParams){
    //get the url variables first
    $scope.host = $routeParams.host;
    $scope.name = $routeParams.name;

    $scope.edit_campaign_url = '#/'+$scope.host+'/campaign/'+$scope.name+'/edit';

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

    //offer data
    /*
    created:        {type: Date,    required: false, default: Date.now},
    name:           {type: String,  required: true },
    active:         {type: Boolean, required: false, default: true},
    group:          {type: String,  required: false, default: ''},
    redirect_url:   {type: String,  required: true},
    type:           {type: String,  required: false, default: ''},
    is_mobile:      {type: Boolean, required: false, default: false},
    is_desktop:     {type: Boolean, required: false, default: false},
    epa:            {type: Number,  required: false, default: 0},
    conversions:    {type: Number,  required: false, default: 0},
    campaign:       {type: Mongoose.Schema.Types.ObjectId, ref: 'campaign'}
    */

    $scope.init = function(){
        $scope.get_campaign_data();
        $scope.get_active_landers();
        jQuery('#campaign-tab-link').trigger('click');
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
        if($scope.offer != null && typeof $scope.offer != 'undefined' && typeof $scope.offer == 'object'){
            $scope.set_current_offer_fields($scope.offer);
        }
        $scope.stats            = $scope.c.stats; 
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

    //Active landers are landers that are attached to the given campaign and have a status of "active"
    $scope.get_active_landers = function(){
        $http.get('/' + $scope.host + '/campaign/'+ $scope.name+'/get/active/landers').success(function(res){
            console.log('DEBUG: CAMPAIGN CONTROLLER --> get_active_landers() --> res: ', res);
            if(res.response == 'success'){
                $scope.active_landers = res.landers;
            }
        });
    }; 

    jQuery(document).ready(function(){
        $scope.init();
    });
}
]);