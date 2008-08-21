// ========================================================================
// SproutCore
// copyright 2006-2008 Sprout Systems, Inc.
// ========================================================================

require('core') ;
require('server') ;

/**
  @class
  
  couchdbServer gives the ability to use couchdb as a backend for sproutcore
  
  Working so far:
   -  listFor: will make a temp view to get all documents of the type ie. "Contacts.Contact"
   -  createRecords: uses the bulk_docs options to make 1 or more documents on the server.
  
  Todo:
   -  listFor: to take an optional argument/setting to uses a named view that will already
      be on couchdb
   -  listFor: take an order option (if possible)
   -  createRecords: add the id created by couchdb, when it is created
   -  refreshRecords: to use cacheing (when usings a predefined view), to enable less traffic.
   -  commitRecords: 
   -  destroyRecords: 
   -  request: clean-up to code that is not used by couchdb (if any)

  @extends SC.RestServer
  @author Geoffrey Donaldson
  @copyright 2006-2008, Sprout Systems, Inc. and contributors.
  @since SproutCore 1.0
*/
SC.CouchdbServer = SC.Server.extend({
  
  request: function(resource, action, ids, params, method) {

    // Get Settings and Options
    if (!params) params = {} ;
    var opts = {} ;
    var onSuccess = params.onSuccess; delete params.onSuccess;
    var onNotModified = params.onNotModified; delete params.onNotModified ;
    var onFailure = params.onFailure ; delete params.onFailure ;
    var context = params.requestContext ; delete params.requestContext ;
    var accept = params.accept ; delete params.accept ;
    var cacheCode = params.cacheCode; delete params.cacheCode ;
    var url = params.url; delete params.url;
    
    // If params.body is a string, then add it, else JSONfy it
    if (typeof(params.body) == "string"){
      opts.postBody = params.body ;
    }else if(typeof(params.body) == "object"){
      opts.postBody = Object.toJSONString(params.body) ;
    } ; delete params.body ;

    opts.requestHeaders = {'Accept': 'application/json, text/javascript, application/xml, text/xml, text/html, */*'}
    if (accept) opts.requestHeaders['Accept'] = accept ;
    if (cacheCode) opts.requestHeaders['Sproutit-Cache'] = cacheCode ;
    opts.method = method || 'get' ;
    opts.contentType = "application/json" // this is needed to make couchdb accept our request.

    // ids are handeled by the calling methods
    
    // adds a custom HTTP header for remote requests
    opts.requestHeaders = {'X-SproutCore-Version' : '1.0'}

    // convert remainging parameters into query string.
    var parameters = this._toQueryString(params) ;
    if (parameters && parameters.length > 0) opts.parameters = parameters ;
    
    var request = null ; //will container the ajax request
    
    // Save callback functions.
    opts.onSuccess = function(transport) {
      var cacheCode = request.getHeader('Last-Modified') ;
      if ((transport.status == '200') && (transport.responseText == '304 Not Modified')) {
        if (onNotModified) onNotModified(transport.status, transport, cacheCode,context);
      } else {
        if (onSuccess) onSuccess(transport.status, transport, cacheCode,context);
      }
    } ;
    
    opts.onFailure = function(transport) {
      var cacheCode = request.getHeader('Last-Modified') ;
      if (onFailure) onFailure(transport.status, transport, cacheCode,context);
    } ; 
    
    console.log('REQUEST: %@ %@'.fmt(opts.method, url)) ;
    
    request = new Ajax.Request(url,opts) ;
  },

  // I don't think that we need urlFor, as the models will need to specify where to look.
  
  // ..........................................
  // LIST
  // This is the method called by a collection to get an updated list of
  // records.
  listFor: function(opts) {
    var recordType = opts.recordType ;
    var resource = recordType.resourceURL() ; if (!resource) return false ;
    var url = resource + "/_temp_view"
    var content = {}

    params = {} ;
    // Not really sure if couchdb will use this.
    if (opts.conditions) {
      var conditions = this._decamelizeData(opts.conditions) ;
      for(var key in conditions) {
        params[key] = conditions[key] ;
      }
    }

    // Here is the couchdb temp view code.
    content.map = "function(doc) { " +
      "if (doc.type == \'"+ recordType +"\' ){ "+
        "emit(doc._id, doc)"+
    "}}" ;
    // TODO: check if the user has given a path to a view.
    // if so, call that view (with Method: GET)

    params.requestContext = opts ;
    params.body = content ;
    params.onSuccess = this._listSuccess.bind(this) ;
    params.onNotModified = this._listNotModified.bind(this) ;
    params.onFailure = this._listFailure.bind(this) ;
    params.url = url ;
    this.request(resource, this._listForAction, null, params, this._listForMethod) ;
  },

  _listForAction: 'list',
  _listForMethod: 'post', // This is post because we are using _temp_views

  _listSuccess: function(status, transport, cacheCode, context) {
    var json = eval('json='+transport.responseText) ;
    if (!json) { console.log('invalid json!'); return; }

    // first lets get the id's and records
    ids = []
    records = json.rows.map(function(row) {
      ids.push(row.id) ;
      return row.value ;
    })

    // then, build any records passed back
    if (records.length > 0) {
      this.refreshRecordsWithData(records,context.recordType,cacheCode,false);
    }

    // next, convert the list of ids into records.
    var recs = (json.ids) ? json.ids.map(function(guid) {
      return SC.Store.getRecordFor(guid,context.recordType) ;
    }) : [] ;

    // now invoke callback
    if (context.callback) context.callback(recs,json.count,cacheCode) ;
  },


  // ..........................................
  // CREATE
  // send the records back to create them. added a special parameter to
  // the hash for each record, _guid, which will be used onSuccess.
  createRecords: function(records) { 
    if (!records || records.length == 0) return ;

    records = this._recordsByResource(records) ; // sort by resource.
    for(var resource in records) {
      if (resource == '*') continue ;
      var curRecords = records[resource] ;
      var content = {} ;

      var create_url = resource + "/_bulk_docs"

      // collect data for records
      var server = this ; var context = {} ;
      var objects = [];

      for (rec in curRecords){
        if (!curRecords.hasOwnProperty(rec)) continue ;
        atts = curRecords[rec].get('attributes') || {};
        if (atts.hasOwnProperty('guid')) {
          atts.type = curRecords[rec]._type._objectClassName ;
        } 
        objects.push(atts);
      }
      content.docs = objects ; //.toJSONString() ;

      // Fill context, so that _createSuccess will do it's thing
      curRecords.each(function(rec) {
        context[rec._guid] = rec ;
      }) ;

      // issue request
      this.request(resource, this._createAction, null, {
        requestContext: context, 
        onSuccess: this._createSuccess.bind(this),
        onFailure: this._createFailure.bind(this),
        body: content,
        url: create_url
      }, this._createMethod) ;
    }
  },

  _createAction: 'create',
  _createMethod: 'post', 

  _refreshAction: 'refresh',
  _refreshMethod: 'get',

  _commitAction: 'save',
  _commitMethod: 'put',

  _destroyAction: 'destroy',
  _destroyMethod: 'delete',

  refreshRecordsWithData: function(dataAry,recordType,cacheCode,loaded) {
    var server = this ;

    // first, prepare each data item in the Ary.
    dataAry = dataAry.map(function(data) {

      // camelize the keys received back.
      data = server._camelizeData(data) ;

      // ** Changed **
      // convert the '_id' property to 'guid' to keep the id's that couchdb has given
      if (data._id) { 
        data.guid = data._id; delete data._id; 
      }else if (data.id) {
        data.guid = data.id; delete data.id;
      }

      // find the recordType
      if (data.type) {
        var recordName = data.type.split(".").last().capitalize() ;
        if (server.prefix) {
          for (var prefixLoc = 0; prefixLoc < server.prefix.length; prefixLoc++) {
            var prefixParts = server.prefix[prefixLoc].split('.');
            var namespace = window;
            for (var prefixPartsLoc = 0; prefixPartsLoc < prefixParts.length; prefixPartsLoc++) {
              var namespace = namespace[prefixParts[prefixPartsLoc]] ;
            }
            if (namespace != window) data.recordType = namespace[recordName] ;
            if (data.recordType) break ;
          }
        } else data.recordType = window[recordName] ;

        if (!data.recordType) console.log('skipping undefined recordType:'+recordName) ;
      } else data.recordType = recordType ;

      if (!data.recordType) return null; // could not process.
      else return data ;
    }).compact() ;

    // now update.
    SC.Store.updateRecords(dataAry,server,recordType,loaded) ;
  }
  
}) ;