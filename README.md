---
title: Javascript SDK
---
Javascript wrapper around the PureCloud Platform API

![Bower version](https://img.shields.io/bower/v/purecloud-api.svg)
[![npm](https://img.shields.io/npm/v/purecloud.svg)](https://www.npmjs.com/package/purecloud)

# Platform API Javascript Client

Install with [Bower](http://bower.io):

~~~sh
bower install purecloud-api
~~~

Install with [NPM](https://www.npmjs.com/package/purecloud):

~~~sh
npm install purecloud
~~~

Reference from the CDN:

~~~html
<!-- Replace `0.46.0` with the version you want to use. -->
<script src="https://sdk-cdn.mypurecloud.com/javascript/0.46.0/purecloud-api-min.js"></script>
~~~

View the documentation on the [PureCloud Developer Center](https://developer.mypurecloud.com/api/rest/client-libraries/javascript/latest/).
View the source code on [Github](https://github.com/MyPureCloud/purecloud_api_sdk_javascript).

# Usage

## Client-side usage

For convenience, all modules are bundled together. 
If your application only uses a small subset of features, you can reference those modules directly.

~~~html
<!-- Include the full library -->
<script type="text/javascript" src="purecloud-api.js"></script>

<!-- Include a subset -->
<!-- Note: `purecloudsession.js` must be included first -->
<script type="text/javascript" src="purecloudsession.js"></script>
<script type="text/javascript" src="usersapi.js"></script>
~~~

## Authentication

Every module uses a ~PureCloudSession~ to make authenticated requests to the PureCloud API.

~~~js
// Node.js - Client credentials strategy
var purecloud = require('purecloud');
var session = purecloud.PureCloudSession({
  strategy: 'client-credentials',
  clientId: yourPurecloudClientId,
  clientSecret: yourPurecloudSecretKey
});

// Browser - Implicit strategy
var session = purecloud.PureCloudSession({
  strategy: 'implicit',
  clientId: yourClientId,
  redirectUrl: yourCallbackUrl
});

// Browser - Token strategy
var session = purecloud.PureCloudSession({
  strategy: 'token',
  token: yourToken
});
~~~

## Environments
If connecting to a PureCloud environment other than mypurecloud.com (e.g. mypurecloud.ie), set the ~environment~ in ~PureCloudSession~.

~~~js
var session = purecloud.PureCloudSession({
  // ... your other settings
  environment: 'mypurecloud.ie'
});
~~~

## Local Storage
To persist a token across web pages when navigating between them, set the ~storageKey~ in ~PureCloudSession~.
~storageKey~ will be used to store the token in LocalStorage if supported so make it unique if multiple sessions may exist in the same page.

~~~js
var session = purecloud.PureCloudSession({
  // ... your other settings
  storageKey: 'myAuthToken'
});
~~~

## Making Requests

All API requests return a Promise which resolves to the response body,
otherwise it rejects with an error.

~~~js
var session = purecloud.PureCloudSession({ /* your settings */ });
var Users = new purecloud.UsersApi(session);
Users.getMe()
    .then(function(user) {
        // successfully got the user object, do something with it here
    })
    .catch(function(error) {
        // an error occurred getting the user object
    })
    .finally(function() {
        // this will be called for successes and failures
    });
~~~

