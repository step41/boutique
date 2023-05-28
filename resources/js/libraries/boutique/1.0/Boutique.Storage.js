; (function() {

    'use strict';
            
    Boutique.Storage = {

        /**
         * Decrement an item's value (must be an Integer type)
         *
         * @param   object      os          Storage object
         * @param   string      key         String name of key
         * @access  private     
         * @since   1.0
         */
        _dec: function(os, key) {

            let obj, item;

            if (os && (os === this.Local || os === this.Session)) {
                obj = os.get(key);
                if (typeof obj == 'object' && obj.value) {
                    item = obj.value
                    if (parseInt(item) == item && typeof item != 'object') {
                        item = parseInt(item);
                        return os.set(key, (item - 1));
                    }
                    else {
                        console.error('Error: Value to be decremented [' + item + '] is not of Integer type');
                        return false;
                    }
                }
            }

        }, 

        /**
         * Delete one or all items in the local storage cache
         *
         * @param   object      os          Storage object
         * @param   string      key         Optional name of the key to be deleted. If no key is specified, all items will be deleted.
         * @return  mixed                   Returns true/false if key is present, otherwise null.
         * @access  private     
         * @since   1.0
         */
        _del: function(os, key) {

            let pairs, pair, i, k;

            if (os && (os == this.Local || os == this.Session)) {

                // Delete all items
                if (typeof key === 'undefined') {
                    if (!os.supported) {
                        try {
                            pairs = document.cookie.split(';');
                            for (i = 0; i < pairs.length; i++) {
                                pair = pairs[i].split('=');
                                k = pair[0];
                                $.cookie(k, null);
                            }
                        }
                        catch(e) {
                            return null;
                        }
                    }
                    else {
                        os.cache.clear();
                    }
                }
                // Delete a specific item
                else {
                    if (!os.supported) {
                        try {
                            $.cookie(key, null);
                            return true;
                        }
                        catch(e) {
                            return false;
                        }
                    }
                    os.cache.removeItem(key);
                    return true;
                }
            }
        }, 

        /**
         * Get one or all items in the local storage cache
         *
         * @param   object      os          Storage object
         * @param   string      key         Optional name of the key whose value will be retrieved. If no key is specified, all keys will be returned.
         * @return  mixed                   Returns the value of a specific item or an array of all items.
         * @access  private     
         * @since   1.0
         */
        _get: function(os, key) {

            let items = [];
            let item, pairs, pair, i, j, k;

            if (os && (os === this.Local || os === this.Session)) {
                // Get all items
                if (typeof key === 'undefined') {
                    if (!os.supported) {
                        try {
                            pairs = document.cookie.split(';');
                            for (i = 0; i < pairs.length; i++) {
                                pair = pairs[i].split('=');
                                k = pair[0];
                                items.push({k:k, value:os.rtn($.cookie(k))});
                            }
                        }
                        catch(e) {
                            return null;
                        }
                    }
                    else {
                        for (j in os.cache) {
                            if (j.length) {
                                items.push({k:j, value:os.rtn(os.cache.getItem(j))});
                            }
                        }
                    }
                    return items;
                }
                // Get specific item
                else {
                    if (!os.supported) {
                        try {
                            return os.rtn($.cookie(key));
                        }
                        catch(e) {
                            return null;
                        }
                    }
                    item = os.cache.getItem(key);
                    return os.rtn(item);
                }
            }
        }, 

        /**
         * Retrieve data from either local/session storage or hidden UI element based on name provided
         *
         *
         * @param   object      os          Storage object
         * @param   string      key         Name of the object to be located in storage or the page elements
         * @return  object                  Returns a data object
         * @access  private     
         * @since   1.0
         */
        _getData: function(os, key) {

            const BU = Boutique.Utilities;
            let exp, obj, val = '';

            if (os && (os === this.Local || os === this.Session)) {
                if (key && key != '') {
                    if (os.cache) {
                        obj = os.get(key);
                        if (obj && obj.hasOwnProperty('value') && obj.hasOwnProperty('expires')) {
                            // 20230430 - Check if value is JSON object (stringified) and convert to object if so. Return other types directly.
                            val = (BU.isJSON(obj.value)) ? os.rtn(obj.value) : obj.value;
                            exp = obj.expires;
                        }
                    }
                    else {
                        obj = $('#' + key);
                        if (obj.length && obj.not(':empty')) {
                            val = os.rtn(obj.text());
                            exp = obj.attr('data-expires');
                        }
                    }
                    if (exp && parseInt(exp) < Date.now()) {
                        val = '';
                    }
                }
            }

            return val;

        },
    
        /**
         * Increment an item's value (*must be an integer type)
         *
         * @param   object      os          Storage object
         * @param   string      key         String name of key
         * @access  private     
         * @since   1.0
         */
        _inc: function(os, key) {

            let obj, item;

            if (os && (os === this.Local || os === this.Session)) {
                obj = os.get(key);
                if (obj && obj.hasOwnProperty('value')) {
                    item = obj.value
                    if (parseInt(item) == item && typeof item != 'object') {
                        item = parseInt(item);
                        return os.set(key, (item + 1));
                    }
                    else {
                        console.error('Error: Value to be incremented [' + item + '] is not of Integer type');
                        return false;
                    }
                }
            }
        },

        /**
         * Initialize this object
         *
         * @param   object      os          Storage object
         * @access  private     
         * @since   1.0
         */
        _init: function(os) {

            if (os) {
                if (os === this.Local && this._supported(os)) {
                    os.cache = window.localStorage;
                }
                else if (os === this.Session && this._supported(os)) {
                    os.cache = window.sessionStorage;
                }
            }
        },

        /**
         * Prepare value for storage
         *
         * @param   object      os          Storage object
         * @param   mixed 	    val         Data to be stored
         * @return  string                  Returns a data object
         * @access  private     
         * @since   1.0
         */
        _prepIn: function(os, val) {

            if (os && (os === this.Local || os === this.Session)) {
                // Convert to String
                while (typeof val !== 'string') {
                    val = JSON.stringify(val);
                }
            }

            return val;

        },
    
        /**
         * Prepare value for retrieval
         *
         * @param   object      os          Storage object
         * @param   string      val         Data to be retrieved
         * @return  object                  Returns a data object
         * @access  private     
         * @since   1.0
         */
        _prepOut: function(os, val) {

            if (os && (os === this.Local || os === this.Session)) {
                // Convert to object
                while (typeof val !== 'object') {
                    val = JSON.parse(val);
                }
            }

            return val;

        },
    
        /**
         * Parse value and return the appropriate datatype/value
         *
         * @param   object      os          Storage object
         * @param   string      val     	String results to be parsed
         * @return  mixed                   Returns the resulting value after parsing
         * @access  private     
         * @since   1.0
         */
        _rtn: function(os, val) {

            let valOrig = val;

            if (os && (os === this.Local || os === this.Session)) {
                try {
                    val = os.prepOut(val);
                    if (typeof val == 'undefined') {
                        val = valOrig;
                    }
                    if (val == 'true') {
                        val = true;
                    }
                    if (val == 'false') {
                        val = false;
                    }
                    if (parseFloat(val) == val && typeof val != 'object') {
                        val = parseFloat(val);
                    }
                }
                catch(e) {
                    val = valOrig;
                }
            }
            return val;
        },

        /**
         * Set a value on a specific key
         *
         * @param   object      os          Storage object
         * @param   string      key         String name of key
         * @param   string      val         String value to be assigned
         * @param   int         ttl         Time to live in minutes
         * @return  mixed                   Returns the resulting value after assignment
         * @access  private     
         * @since   1.0
         */
        _set: function(os, key, val, ttl) {
            if (os && (os === this.Local || os === this.Session)) {
                if (!os.supported) {
                    try {
                        $.cookie(key, val, { path: '/', expires: ttl });
                        return val;
                    }
                    catch(e) {
                        console.error(OM.t('messageLocalStorageNotSupported') + ' Error: ' + e);
                    }
                }
                // Store value with expiration
                os.cache.setItem(key, os.prepIn({ created: new Date().toLocaleString(), expires: ttl.getTime(), value: val }));
                // Return only the value (stringified)
                return os.rtn(os.prepIn(val));
            }
        },

        /**
         * Save data to either local/session storage or hidden UI element based on name provided
         *
         *
         * @param   object      os          Storage object
         * @param   string      key         Name of the object to be located in storage or the page elements
         * @param   string      val         Data to be stored
         * @param   int         ttl         Time to live in minutes
         * @return  object                  Returns a data object
         * @access  private     
         * @since   1.0
         */
        _setData: function(os, key, val, ttl) {

            if (os && (os === this.Local || os === this.Session)) {
                if (key && key != '') {
                    // Convert ttl to a valid Date object
                    ttl = os.setExpire(ttl);
                    // If local storage supported, there is no need to Stringify as it's done when calling Set
                    if (os.cache) {
                        val = os.set(key, val, ttl);
                    }
                    // If local storage not supported then we need to Stringify prior to placing in DOM and passing to Rtn
                    else {
                        val = os.prepIn(val);
                        $('footer').append('<div id="' + key + '" data-expires="' + ttl.getTime() + '" class="hidden">' + val + '</div>');
                        val = os.rtn(val);
                    }
                }
                else {
                    console.error('Boutique.Storage.setData() failed because key was missing or invalid!');
                }
            }

            return val;

        },
    
        /**
         * Convert ttl integer value into Date object and set expiration
         *
         * @param   object      os          Storage object
         * @param   int         ttl         Time to live in minutes
         * @return  object                  Returns a date object
         * @access  private     
         * @since   1.0
         */
         _setExpire: function(os, ttl) {

            let expires = new Date();

            if (os && (os === this.Local || os === this.Session)) {
                
                ttl = parseInt(ttl);
                ttl = (ttl > 0) ? ttl : 525600; // One year in minutes - default expiration value
                ttl *= 60 * 1000; // convert to milliseconds
                expires.setTime(expires.getTime() + ttl);

                return expires;
            }

            return null;

        },
    
        /**
         * Determine if various storage types are supported
         *
         * @url     https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
         *
         * @param   object      os          Storage object
         * @return  mixed                   Returns true if supported or a DOMException object if not
         * @access  private     
         * @since   1.0
         */
        _supported: function(os) {
            let x, type, storage;
            if (os) {
                type = (os === this.Local) ? 'localStorage' : ((os === this.Session) ? 'sessionStorage' : null);
                try {
                    x = '__storage_test__';
                    storage = window[type];
                    storage.setItem(x, x);
                    storage.removeItem(x);
                    // Additional check for JSON support before signing off
                    if (typeof window.JSON == 'undefined') {
                        os.supported = false;
                    }
                    else if (os._enabled) {
                        os.supported = true;
                    }
                    return os.supported;
                }
                catch(e) {
                    return e instanceof DOMException && os._enabled && (
                        // Everything except Firefox
                        e.code === 22 || 
                        // Firefox
                        e.code === 1014 || 
                        // Test name field too, because code might not be present (all but Firefox)
                        e.name === 'QuotaExceededError' || 
                        // Firefox
                        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && 
                        // Acknowledge QuotaExceededError only if there's something already stored
                        storage.length !== 0
                    ;
                }
            }
        },

        /**
         * Local Storage Object
         *
         * @return  object                  Returns an Boutique.Storage.Local object and methods
         * @access  public     
         * @since   1.0
         */
        Local: {

            /**
             * Enabled - Used to forcibly disable local or session storage so only DOM storage is used.
             *
             * @var     boolean
             * @access  private     
             * @since   1.0
             */
            _enabled: true,

            /**
             * Cache - Holds data for future additions/modifications/retrieval.
             *
             * @var     mixed
             * @access  public     
             * @since   1.0
             */
            cache: null,

            /**
             * Supported - Dynamically determined based on support criteria provided by the client.
             *
             * @var     boolean
             * @access  public     
             * @since   1.0
             */
            supported: false,

            dec: 		function(key) 		        { return Boutique.Storage._dec(this, key); },
            del: 		function(key) 		        { return Boutique.Storage._del(this, key); },
            get: 		function(key) 		        { return Boutique.Storage._get(this, key); },
            getData: 	function(key) 		        { return Boutique.Storage._getData(this, key); },
            inc: 		function(key) 		        { return Boutique.Storage._inc(this, key); },
            init: 		function() 			        { return Boutique.Storage._init(this); },
            prepIn: 	function(val, ttl) 	        { return Boutique.Storage._prepIn(this, val, ttl); },
            prepOut: 	function(val) 		        { return Boutique.Storage._prepOut(this, val); },
            rtn: 		function(res) 		        { return Boutique.Storage._rtn(this, res); },
            set: 		function(key, val, ttl) 	{ return Boutique.Storage._set(this, key, val, ttl); },
            setData: 	function(key, val, ttl) 	{ return Boutique.Storage._setData(this, key, val, ttl); },
            setExpire:  function(ttl) 		        { return Boutique.Storage._setExpire(this, ttl); },

        },

        /**
         * Session Storage Object
         *
         * @return  object                  Returns an Boutique.Storage.Session object and methods
         * @access  public     
         * @since   1.0
         */
        Session: {

            /**
             * Enabled - Used to forcibly disable local or session storage so only DOM storage is used.
             *
             * @var     boolean
             * @access  private     
             * @since   1.0
             */
            _enabled: true,

            /**
             * Cache - Holds data for future additions/modifications/retrieval.
             *
             * @var     mixed
             * @access  public     
             * @since   1.0
             */
            cache: null,

            /**
             * Supported - Dynamically determined based on support criteria provided by the client.
             *
             * @var     boolean
             * @access  public     
             * @since   1.0
             */
            supported: false,

            dec: 		function(key) 		        { return Boutique.Storage._dec(this, key); },
            del: 		function(key) 		        { return Boutique.Storage._del(this, key); },
            get: 		function(key) 		        { return Boutique.Storage._get(this, key); },
            getData: 	function(key) 		        { return Boutique.Storage._getData(this, key); },
            inc: 		function(key) 		        { return Boutique.Storage._inc(this, key); },
            init: 		function() 			        { return Boutique.Storage._init(this); },
            prepIn: 	function(val, ttl)	        { return Boutique.Storage._prepIn(this, val, ttl); },
            prepOut: 	function(val) 		        { return Boutique.Storage._prepOut(this, val); },
            rtn: 		function(res) 		        { return Boutique.Storage._rtn(this, res); },
            set: 		function(key, val, ttl)	    { return Boutique.Storage._set(this, key, val, ttl); },
            setData: 	function(key, val, ttl) 	{ return Boutique.Storage._setData(this, key, val, ttl); },
            setExpire:  function(ttl) 		        { return Boutique.Storage._setExpire(this, ttl); },
            
        },

    };

    $(function(){
        Boutique.Storage.Local.init();
        Boutique.Storage.Session.init();
    });

})();


