angular.module('autoaffiliate')
.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'js/app/views/login.client.view.html',
        controller: 'IndexController'
      }).
      when('/logout', {
        templateUrl: 'js/app/views/login.client.view.html',
        controller: 'IndexController'
      }).
      when('/', {
        templateUrl: 'js/app/views/index.client.view.html',
        controller: 'IndexController'
      }).
      when('/index', {
        templateUrl: 'js/app/views/index.client.view.html',
        controller: 'IndexController'
      }).
      when('/addserver', {
        templateUrl: 'js/app/views/addserver.client.view.html',
        controller: 'AddserverController'
      }).
      when('/:host/dashboard', {
        templateUrl: 'js/app/views/dashboard.client.view.html',
        controller: 'DashboardController'
      }).
      when('/:host/campaigns', {
        templateUrl: 'js/app/views/campaigns.client.view.html',
        controller: 'CampaignsController'
      }).
      when('/:host/campaign/:name', {
        templateUrl: 'js/app/views/campaign.edit.client.view.html',
        controller: 'CampaigneditController'
      }).
      when('/:host/campaign/:name/edit', {
        templateUrl: 'js/app/views/campaign.edit.client.view.html',
        controller: 'CampaigneditController'
      }).
      when('/:host/campaign/:name/add/landers', {
        templateUrl: 'js/app/views/campaign.addlanders.client.view.html',
        controller: 'CampaignaddlandersController'
      }).
      when('/:host/campaign/:name/add/trafficsrc', {
        templateUrl: 'js/app/views/campaign.addtrafficsrc.client.view.html',
        controller: 'CampaignaddtrafficsrcController'
      }).
      when('/:host/landers', {
        templateUrl: 'js/app/views/landers.client.view.html',
        controller: 'LandersController'
      }).
      when('/:host/landers/view/:landerid', {
        templateUrl: 'js/app/views/landers.view.client.view.html',
        controller: 'LandersviewController'
      }).
      when('/:host/offers', {
        templateUrl: 'js/app/views/offers.client.view.html',
        controller: 'OffersController'
      }).
      when('/:host/offers/edit/:offerid', {
        templateUrl: 'js/app/views/offers.edit.client.view.html',
        controller: 'OfferseditController'
      }).
      when('/:host/trafficsources', {
        templateUrl: 'js/app/views/trafficsources.client.view.html',
        controller: 'TrafficsourcesController'
      }).
      when('/:host/trafficsources/edit/:trafficsrcid', {
        templateUrl: 'js/app/views/trafficsources.edit.client.view.html',
        controller: 'TrafficsourceseditController'
      }).
      when('/shutdown/admin', {
        templateUrl: 'js/app/views/shutdown.admin.client.view.html',
        controller: 'ShutdownadminController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }
]);