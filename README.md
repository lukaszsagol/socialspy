# SocialSpy - know your visitors.

**SocialSpy** is a simple JavaScript library, meant to track which
social services are your sites visitors logged into. By default it sends
it straight into you Google Analytics, but you can also add your own
JS handler.

The whole idea of discovering login status of social services is based
on [@TomAnthonySEO](http://twitter.com/TomAnthonySEO) [blog post](http://www.tomanthony.co.uk/blog/detect-visitor-social-networks/).

## IMPORTANT
All versions prior to v0.4 actually didn't work. You can read about the
issue [on my blog](http://hipster.pandeveloper.com/post/18396238141/custom-variables-setcustomvar-not-showing-in).

## Demo
Want to see it in action? [Click for demo](http://zgryw.github.com/socialspy/demo.html).

## Disclaimer
Before using this script, you should know that discovering login status
for 3rd party sites is by many considered as attack on their privacy.

This library was created not to spy on your visitors and I, as a
creator, do not support any ideas of using it in an evil way. However I
see many ideas how to use it for good, like showing only relevant social
service buttons, extending integration for social services, and so on...

So, please, use it for good only!

## Installation
Minimal installation is possible with only two lines, placed after
Google Analytics tracking code:

```html
<script src='PATH_TO_JS/socialspy.min.js'></script>
<script>socialSpy.init()</script>
```

By default all service handlers are enabled, which means you will also
need to have [Facebook JS Api](http://developers.facebook.com/docs/reference/javascript/) init script somewhere on your page. More
information about that and configuration possibilities are in [Advanced
Setup](#advanced-setup) part.

## Supported services
Currently **SocialSpy** can detect login status for those services:

* [Twitter](http://twitter.com/)
* [Facebook](http://facebook.com/)
* [Google](http://google.com/)
* [G+](http://plus.google.com/)

Support for more services is probably coming soon...

## Advanced setup
The only thing to remember while initializing **SocialSpy** is to put
its init code after Google Analytics tracking code. Not important, if
you are planning to override default submit function.

### Initialization options
While initializing **SocialSpy** you can provide following options, as a
hash:

**services** *Array* List of Strings, representing services which login
status is going to be checked. Possible values: facebook, twitter,
google, gplus. Default value: ['facebook', 'twitter', 'google', 'gplus']

**variableIndex** *Integer* Which Google Analytics customVariable will
be used. Default: 1

**variableName** *String* Name of Google Analyics customVariable.
Default: 'Social Spy'

**customSubmit** *Function* Function called after all login statuses are
known. It should take one param - Hash, with String keys representing service
names and Boolean values representing whether user is logged in or not.
Default: undefined

**debug** *Boolean* When true, script will ouput info about called
functions straight to the Browser Console. Default: false

**waitForLoad** *Boolean/Integer* When value is a number, the status
checking will be delayed for given time (in miliseconds). Otherwise
(for true value) it will be attached to window 'load' event. Default: true

**trackWithEvent** *Booelan* When true, *_trackEvent* will be called
after *_setCustomVar* to deliver Custom Variable to Google Analytics.

**trackWithPageview** *Boolean* When true, *_trackPageview* will be
called to submit Custom Variables to Google Analytics servers. If using
this one, remeber to delete *_trackPageview* from Google
Analytics snippet.

Most probably you would want to only one of **trackWithPageview** and
**trackWithEvent** to be true.

### Example of use

```javascript
socialSpy.init({
  services: ['facebook', 'twitter', 'google', 'gplus'],
  variableIndex: 2,
  variableName: 'Social Services',
  customSubmit: function(services) { console.log(services); },
  debug: true
});
```

### Custom submit function
Currently, if you provide your custom submit function the default one
will not be called. To override this behaviour, all you need to do is
just calling it from you custom function, like this:

```javascript
customSubmit: function(services) {
  // your code
  socialSpy.defaultSubmit(servies);
}
```

This way you can have your own function as well as default sending to
Google Analytics.


### Google Analytics variable format
Variable building isn't customizable right now, but you can always
customize it straight in .js file. By default, there are variables
called SERVICENAME\_[ON/OFF], depending on login status, and are
concatenated to one string with use of SEPARATOR variable value.

### Facebook initialization
Facebook status discovery is based strictly on Facebook JavaScript API.
Because of that, it is required that there is `FB.init` called somewhere
on your page. If you still don't know what to do, please, read on...

First thing you need is Facebook Application ID. To get it, create app, 
as described in Step 1 of [this tutorial](https://developers.facebook.com/docs/opengraph/tutorial/#create-app). After getting your App ID, you need to put the code below somewhere on your page (with [YOUR\_APP\_ID] replaced with your App ID)

```html
<div id="fb-root"></div>
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '[YOUR_APP_ID]', // App ID
      status     : true // check login status
    });
  };

  // Load the SDK Asynchronously
  (function(d){
    var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    d.getElementsByTagName('head')[0].appendChild(js);
  }(document));
</script>
```

## Information
### History

* v0.4 - now it should even work!
* v0.3 - waitForLoad now supports timeout (in milis)
* v0.2 - added support for waitForLoad option
* v0.1 - first version, yay!


### Bug reports
If you find any errors, feel free to create issue on Github project
page. You can also provide the idea how to fix it or even fork and fix
it yourself (help appreciated!)

[Github Issue Tracker](https://github.com/zgryw/socialspy/issues)

### License
MIT License, copyrighted by [Łukasz
Sągol](http://twitter.com/zgryw/)/[Pan
Developer](http://pandeveloper.com/)

### Contact
Contact me at: [@zgryw](http://twitter.com/zgryw/) or mail lukasz at
sagol dot pl.


