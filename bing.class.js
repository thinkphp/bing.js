var Bing = function( options ) {

    if( !(this instanceof Bing) ) return new Bing( options )

    var defaults = {

        //Endpoint Microsoft's Bing API REST GET
        endpoint: "http://api.bing.net/json.aspx?",

        //Appid
        appid: null,

        //SourceType: Web,Image,News, PhoneBook, RelatedSearch, Translation, Spell
        sources: "web",

        //Bing amount of items response
        limit: 10,

        //offset results
        offset: 0, 

        //Bing UserAgent
        userAgent: 'Bing Search Client for Node.js',

        //Bing Api version
        version: "2.2"
    };

    //merge options passed in with defaults
    this.options = this._extend(defaults, options)

};


Bing.prototype.search = function(query, callback, options) {
 
     if(typeof callback != 'function') {

        throw "Erorr: Callback function required!" 
        return
     }

     var opts = this.options;

     if(options != null) {

        opts = this._extend( this.options, options )
     }

     var qs = this._querystring({
              "Appid": opts.appid,
              "query": query,  
              "sources": opts.sources,
              "web.count": opts.limit,
              "web.offset": opts.offset, 
              "JsonType": "callback"})

     var uri = opts.endpoint + qs + '&JsonCallBack=?';

     this.request(uri, function( resp ){

          callback( resp )
     })

};

Bing.prototype._querystring = function( obj ) {

     var arr = []
     for(var prop in obj) {

         if(obj.hasOwnProperty(prop)) {

            var propAndVal = encodeURIComponent( prop ) + '=' + encodeURIComponent( obj[prop] )
            arr.push( propAndVal )
         }
     }

   return arr.join("&") 
 
};

Bing.prototype._extend = function() {

    var each = function(arr, fn){

      var i, len = arr.length;

      for(i=0;i<len;i++) {

        fn.call(arr, arr[i], i)
      }
    }

    var obj = [].slice.call(arguments,0)[0]; 

    each([].slice.call(arguments,1), function( source ){


         for(var prop in source) {

             obj[ prop ] = source[ prop ]
         }
    })

  return obj
}

Bing.prototype.request = function(url, callback) {

         this.url = url

         this.callback = callback

         this.fetch()
}

Bing.prototype.fetch = function() {
   
       var id = new Date().getTime(),

           fn = "callback_" + id,

           url = this.url.replace('=?','=Bing.' + fn),

           that = this,

           s = document.createElement('script');

           s.type = 'text/javascript'

           Bing[ fn ] = this.evalJSON(this.callback,that)

           s.src = url

           document.getElementsByTagName('head')[0].appendChild(s)

           this.s = s

           this.fn = fn
}

Bing.prototype.evalJSON = function(callback, that) {

     return function(data) {

              var validjson = false

              if(typeof data == 'string') {
                 try {
                  validjson = JSON.parse(data)
                 }catch(e) {
                 } 
              } else if(typeof data == 'object') {
                 validjson = data
              } else {
                 validjson = JSON.parse(JSON.stringify(data));
                 console.log('response data was not a JSON string')
              }

              if(validjson) {
                 callback(validjson)
                 delete Bing[that.fn] 
                 document.getElementsByTagName("head")[0].removeChild(that.s); 

              } else {
                 console.log('JSONP call returned invalid JSON or empty JSON')
              }
      }
}