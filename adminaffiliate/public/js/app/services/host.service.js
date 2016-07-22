angular.module('autoaffiliate')
.factory('HostService', ['$http',function($http){

    return {
        get_host: function(name,callback){
            $http.get('/get/all/hosts.json').success(function(data){
                console.log("DEBUG: host service --> get-all-hosts: ", data);
                if(callback){
                    for(var i = 0; i < data.length; i++){
                        if(name == data[i].name){
                            callback(data[i]);
                        }
                    }
                }
            });
        },

    };

}]);