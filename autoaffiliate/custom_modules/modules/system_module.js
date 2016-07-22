'use strict';
//system module

var fs = require('fs');
var process = require('process');
var db = require('../db/database');
var rootpath = '';
var locked = false;

function inventory_pages_directory(){
    if(!locked){
        locked = true;
        //clear all the pages
        db.pages.remove({}, function(err,a){
            if(err){
                console.log("ERROR: SYSTEM MODULE --> remove_existing_page_records() --> ERR: ", err);
            }
            else{
                //console.log("DEBUG: SYSTEM MODULE --> remove_existing_page_records() --> remove operation: ", {a:a.result});
    
                //create the basepath to the pages directory
                var basepath =  rootpath + '/public/page';
                
                var stat = null;
                var pagepath = null;
                var urlfriendly = null;
                fs.readdir(basepath, function(err, files){
                    if(err){
                        console.log("ERROR: SYSTEM MODULE --> inventory_pages_directory() --> ERR: ", err);
                    }
                    else{
                        if(files.length > 0){
                            //create the fresh page instance in the database
                            for(var i = 0; i < files.length; i++){
                                if(files[i] != '.git'){
                                    pagepath = basepath +'/'+ files[i];
                                    urlfriendly = '/page/'+files[i]+'/index.html';
                                    //console.log('DEBUG: SYSTEM MODULE --> pages_directory_inventory() --> file['+i+']: ', files[i]);
                                    stat = fs.statSync(pagepath);
                                    //console.log('DEBUG: SYSTEM MODULE --> pages_directory_inventory() --> stats: ', stat);
                                    if(stat.isDirectory()){
                                        db.pages.create({name:files[i], filepath:pagepath+'/index.html', url:urlfriendly}, function(err,a,b){});                
                                    }
                                }
                            }

                            //courtesy check: if any landers are now pointing towards invalid filepaths
                            //                mark that lander as 'removed' ("disabled" landers can be reactivated)
                            db.lander.find({}, function(err, landers){
                                if(err){
                                    console.log("ERROR: SYSTEM MODULE --> inventory_pages_directory() --> ERR: ", err);
                                }
                                else{
                                    var stats = null;
                                    for(var i = 0; i < landers.length; i++){
                                        try{
                                            stats = fs.statSync(rootpath + '/public' + landers[i].filepath);
                                            if(!stats.isFile()){
                                                landers[i].status = 'removed';
                                                landers[i].save();
                                            }                                    
                                        }
                                        catch(err){
                                            console.log('DEBUG: SYSTEM MODULE --> fs.statSync() --> error: ', err);
                                        };
                                    }
                                }    
                            });


                            locked = false;
                            console.log("inventory_pages_directory() --> finished successfully");
                        }
                    }
                });            
            }
        });
    }
};

exports.init = function(rootpath_in){
    rootpath = rootpath_in;
    inventory_pages_directory();
};


exports.watcher_ready = function(){
    console.log('Initial scan complete. Ready for changes.');
};
exports.watcher_file_added = function(path){
    console.log('File', path, 'has been added');
};
exports.watcher_file_changed = function(path){
    console.log('File', path, 'has been changed');
};
exports.watcher_file_removed = function(path){
    console.log('File', path, 'has been removed');
};
exports.watcher_directory_added = function(path){
    console.log('Directory', path, 'has been added');
};
exports.watcher_directory_removed = function(path){
    console.log('Directory', path, 'has been removed');
};
exports.watcher_error = function(error){
    console.log('Error happened', error);
};
exports.watcher_raw_event = function(event, path, details) { 
    inventory_pages_directory();
    console.log('Raw event info:', event, path, details);
};
