# Bing.js

A client JavaScript for Microsoft's Bing Search API REST.

# Usage

Include it in HEAD:

```
<script type="text/javascript" src="bing.class.js"></script>
```

```javascript

   var bing = Bing( {appid: 'your-api-key'} );

   bing.search('jQuery', function( data ){

        //do something with data               
   });
```

# License

MIT