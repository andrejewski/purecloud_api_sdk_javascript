//API VERSION - {{&info.version}}
/**
  * @description {{&info.description}}
  * @class
  * @param {string} options.strategy - Authentication strategy: "token", "implicit", "client-credentials"
  * @param {string} options.environment - (Optional, default "mypurecloud.com") Environment the session use, e.g. mypurecloud.ie, mypurecloud.com.au, etc.
  * @param {string} options.clientId - (Optional) Client identifier for "implicit" or "client-credentials" strategies
  * @param {string} options.clientSecret - (Optional) Client secret key for "client-credentials" strategy
  * @param {string} options.redirectUrl - (Optional) Callback URL for "implicit" strategy
  * @param {string} options.token - (Optional) Existing token for "token" strategy
  * @param {string} options.storageKey - (Optional) Key to set in localStorage with the authentication token
  **/
function PureCloudSession(options) {
    if(!(this instanceof PureCloudSession)) {
        return new PureCloudSession(options);
    }
    this.options = options;
    this.options.token = this._getToken();
    this.setEnvironment(this.options.environment);
    this._setHashValues();
}

/**
  * @description Sets the environment used by the session
  * @param {string} environment - (Optional, default "mypurecloud.com") Environment the session use, e.g. mypurecloud.ie, mypurecloud.com.au, etc.
  **/
PureCloudSession.prototype.setEnvironment = function setEnvironment(environment) {
    this.options.environment = environment || 'mypurecloud.com';
    this.apiUrl = 'https://api.' + this.options.environment;
    this.authUrl = 'https://login.' + this.options.environment;
}

/**
  * @description Attempts to login with the appropriate authentication strategy
  * @returns Promise which resolves on successful authentication, otherwise rejects with an error
  **/
PureCloudSession.prototype.login = function login() {
    return this.options.token
        ? this._testTokenAccess().catch(this._authenticate())
        : this._authenticate();
}

PureCloudSession.prototype._authenticate = function _authenticate() {
  var strategy = this.options.strategy;
  switch(strategy) {
    case 'token':
      var token = this.options.token;
      return this._loginWithToken(token);
    case 'implicit':
      var clientId = this.options.clientId;
      var redirectUrl = this.options.redirectUrl;
      var state = this.options.state;
      return this._loginWithOauth(clientId, redirectUrl, state);
    case 'client-credentials':
      var clientId = this.options.clientId;
      var clientSecret = this.options.clientSecret;
      return this._loginWithClientCredentials(clientId, clientSecret);
    default:
      throw new Error('Authentication strategy "'+strategy+'" is not supported.');
  }
}

PureCloudSession.prototype._testTokenAccess = function _testTokenAccess() {
    if(this.options.strategy === 'implicit') {
      var checkUrl = this.apiUrl + "/api/v2/users/me";
      return this._makeRequest('get', checkUrl);
    }
    return Promise.resolve();
}

PureCloudSession.prototype._loginWithToken = function _loginWithToken(token) {
    if(!token) {
        throw new Error('Options requires a "token" key for the "token" strategy');
    }
    return Promise.resolve();
}

PureCloudSession.prototype._loginWithOauth = function(clientId, redirectUrl, state) {
    var query = {
        response_type: 'token',
        client_id: encodeURIComponent(clientId),
        redirect_uri: encodeURI(redirectUrl),
        state: state
    };

    function qs(url, key) {
        var val = query[key];
        if(!val) return url;
        return url + '&' + key + '=' + val;
    }

    var url = Object.keys(query).reduce(qs, this.authUrl + '/authorize?');
    window.location.replace(url);
}

PureCloudSession.prototype._setHashValues = function setHashValues() {
    if(!(typeof window !== 'undefined' && window.location.hash)) return;
    var hash = window.location.hash
        .slice(1).split('&')
        .reduce(function(obj, pair) {
            keyValue = pair.split('=');
            obj[keyValue[0]] = keyValue[1];
            return obj;
        }, {});

    if(hash.access_token) this._setToken(hash.access_token);
    if(hash.state) this.options.state = hash.state;
}

PureCloudSession.prototype._loginWithClientCredentials = function(clientId, clientSecret) {
    var self = this;
    var url = this.authUrl + '/token';
    var data = {grant_type: 'client_credentials'};
    var request = this._baseRequest('post', url)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .auth(clientId, clientSecret)
        .send(data);
    return this._sendRequest(request)
        .then(function(body) {
            self._setToken(body.access_token);
        });
}

PureCloudSession.prototype._getToken = function _getToken() {
    if(this.options.token) return this.options.token;
    if(this.options.storageKey && PureCloudSession.hasLocalStorage) {
        return localStorage.getItem(this.options.storageKey);
    }
}

PureCloudSession.prototype._setToken = function _setToken(token) {
    this.options.token = token;
    if(this.options.storageKey && PureCloudSession.hasLocalStorage) {
        localStorage.setItem(this.options.storageKey, token);
    }
}

PureCloudSession.hasLocalStorage = (function() {
    try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    } catch(e) {
        return false;
    }
}).call(this);

/**
  * @description Deauthenticates the session and removes any stored token
  **/
PureCloudSession.prototype.logout = function logout() {
    if(PureCloudSession.hasLocalStorage) {
        this._setToken(null);
    }
		window.location.replace(this.authUrl + "/logout");
}

/**
  * @description Makes authenticated requests to PureCloud
  * @param {string} method - HTTP method verb, e.g. "get", "post"
  * @param {string} url - URL to request
  * @param {object} query - (Optional) query parameters
  * @param {object} body - (Optional) request body payload
  * @returns Promise resolving to the response body, otherwise rejects with an error
  */
PureCloudSession.prototype.makeRequest = function makeRequest(method, url, query, body) {
    var self = this;
    return this.login().then(function() {
        return self._makeRequest(method, url, query, body);
    });
}

PureCloudSession.prototype._makeRequest = function _makeRequest(method, url, query, body) {
    var bearer = 'bearer ' + this.options.token;
    var request = this._baseRequest(method, url)
        .set('Authorization', bearer)
        .query(query)
        .send(body);
    return this._sendRequest(request);
}

PureCloudSession.prototype._baseRequest = function _baseRequest(method, url) {
    method = method.toLowerCase();
    if(url.charAt(0) === '/') url = this.apiUrl + url;

    var timeout = 2000;
    var request = superagent[method](url)
        .type('json')
        .accept('json')
        .timeout(timeout);

    if (typeof module !== 'undefined' && module.exports) {
        var userAgent = 'PureCloud SDK/Javascript {{&info.version}}';
        request = request.set('User-Agent', userAgent);
    }

    return request;
}

PureCloudSession.prototype._sendRequest = function _sendRequest(request) {
    return new Promise(function(resolve, reject) {
        request.end(function(error, res) {
            if(error) return reject(error);
            if(res.error) return reject(res);
            resolve(res.body);
        });
    });
}

/**
  * @description Conveinence method for making GET requests
  * @param {string} url - URL to request
  * @param {object} query - (Optional) query parameters
  * @returns Promise resolving to the response body, otherwise rejects with an error
  */
PureCloudSession.prototype.get = function get(url, query) {
  return this.makeRequest('get', url, query);
}
