var Fs              = require('fs');
var db              = require('../db/admin/database');
var Url             = require('url');

exports.get_all_pages = function(req, res){
    var host = req.params.host;
    db.remote[host].pages.find({}, function(err, pages){
        if(err){
            db.error.create({file:'pages_module.js', func:'get_all_pages', err:err},function(a,b,c){});
            res.type('application/json');
            res.send({response: 'error'});
        }
        else{
            if(pages != null && typeof pages != 'undefined'){
                res.type('application/json');
                res.send({
                    response: 'success',
                    data: pages
                });
            }
        }
    });
};