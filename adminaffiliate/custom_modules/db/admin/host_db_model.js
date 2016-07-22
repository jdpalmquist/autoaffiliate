var Mongoose    = require('mongoose');

var host_schema = new Mongoose.Schema({
  name:           {type: String,  required: true },
  createdAt:      {type: Date,    required: false, default: Date.now},
  active:         {type: Boolean, required: false, default: true},
  group:          {type: String,  required: false, default: ''},
  type:           {type: String,  required: false, default: ''},
  full_domain:    {type: String,  required: false, default: ''},
  registrar_url:  {type: String,  required: false, default: ''},
  registrar_user: {type: String,  required: false, default: ''},
  registrar_pass: {type: String,  required: false, default: ''},
  hosting_url:    {type: String,  required: false, default: ''},
  hosting_user:   {type: String,  required: false, default: ''},
  hosting_pass:   {type: String,  required: false, default: ''},
  hosting_ip:     {type: String,  required: false, default: ''},
  hosting_port:   {type: String,  required: false, default: ''},
  mongodb_connstr:{type: String,  required: false, default: ''},
  mongodb_user:   {type: String,  required: false, default: ''},
  mongodb_pass:   {type: String,  required: false, default: ''},
  mongodb_host:   {type: String,  required: false, default: ''},
  mongodb_port:   {type: String,  required: false, default: ''},
  mongodb_dbname: {type: String,  required: false, default: ''}
});
/*
var HostModel = Mongoose.model("host", host_schema);

exports.get_model = function(){return HostModel;};
*/

exports.schema = host_schema;