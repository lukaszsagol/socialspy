var socialSpy = {
  FACEBOOK_ON: 'onfacebook',
  FACEBOOK_OFF: 'offfacebook',
  GOOGLE_ON: 'ongoogle',
  GOOGLE_OFF: 'offgoogle',
  GPLUS_ON: 'ongplus',
  GPLUS_OFF: 'offgplus',
  TWITTER_ON: 'ontwitter',
  TWITTER_OFF: 'offtwitter',
  SEPARATOR: ';',

  variableIndex: null,
  variableName: null,
  recievedStatuses: 0,
  serviceStatuses: {},
  services: [],
  debug: false,
  customSubmit: null,
  waitForLoad: true,

  init: function(opts) {
    if (opts == null) {
      opts = {}
    }
    socialSpy.debug = !!opts.debug;
    socialSpy.dbg('socialSpy init called with DEBUG');
    socialSpy.dbg("DON'T USE DEBUG IN PRODUCTION");
    _gaq = window._gaq || [];
    socialSpy.services      = opts.services || ['facebook', 'twitter', 'google', 'gplus'];
    socialSpy.variableIndex = opts.variableIndex || 1;
    socialSpy.variableName  = opts.variableName || 'Social Spy';
    socialSpy.waitForLoad   = typeof opts.waitForLoad === "undefined" ? true : opts.waitForLoad;
    socialSpy.customSubmit  = opts.customSubmit;


    if (socialSpy.services.length > 0) {
      if (socialSpy.waitForLoad) {
        socialSpy.listen(window, 'load', socialSpy.installServices);
      } else {
        socialSpy.installServices();
      }
    } else {
      socialSpy.dbg('No services selected.');
    }
    window._gaq = _gaq || [];
  },

  installServices: function() {
    var i=0;
    for(i=0;i<socialSpy.services.length;i++) {
      socialSpy.installers[socialSpy.services[i].toLowerCase()]();
    }
  },

  installers: {
    facebook: function() {
      FB = window.FB || undefined;
      if(!FB || !FB._apiKey) {
        socialSpy.dbg('FB.init not called. Delaying status check...');
        setTimeout(socialSpy.installers.facebook, 100);
      } else {
        FB.getLoginStatus(function(response) {
          if (response.status != "unknown") {
            socialSpy.handle('facebook', true);
          } else {
            socialSpy.handle('facebook', false);
          }
        });
      }
    },
    twitter: function() {
      socialSpy.dbg('Checking Twitter status...');
      socialSpy.installImageCheck('https://twitter.com/login?redirect_after_login=%2Fimages%2Fspinner.gif', 'twitter');
    },
    google: function() {
      socialSpy.dbg('Checking Google status...');
      socialSpy.installImageCheck('https://accounts.google.com/CheckCookie?continue=https://www.google.com/intl/en/images/logos/accounts_logo.png', 'google');
    },
    gplus: function() {
      socialSpy.dbg('Checking GPlus status...');
      socialSpy.installImageCheck('https://plus.google.com/up/?continue=https://www.google.com/intl/en/images/logos/accounts_logo.png&type=st&gpsrc=ogpy0', 'gplus');
    }
  },

  dbg: function(log) {
    if (socialSpy.debug && typeof console !== "undefined") {
      console.log(log);
    }
  },

  handle: function(service, status) {
    socialSpy.dbg('Recieved '+service+' status: '+(status?'logged in.':'not logged in.'))
    socialSpy.serviceStatuses[service] = status;
    socialSpy.recievedStatuses++;
    if (socialSpy.recievedStatuses == socialSpy.services.length) {
      if (socialSpy.customSubmit) {
        socialSpy.dbg('Calling custom submit method.');
      } else {
        socialSpy.dbg('Calling default submit method.');
      }
      (socialSpy.customSubmit || socialSpy.defaultSubmit)(socialSpy.serviceStatuses);

      socialSpy.dbg('socialSpy done his job. He disappears...');
    }
  },

  handleImageCheck: function(service, status) {
    socialSpy.handle(service,status);
    document.body.removeChild(document.getElementById('socialSpy_'+service+'_imagecheck'));
  },

  defaultSubmit: function(statuses) {
    var statusStrings = [];
    var i=0;
    for (i=0;i<socialSpy.services.length;i++) {
      var service = socialSpy.services[i];
      var key = service.toUpperCase() + (statuses[service] ? '_ON' : '_OFF')

      statusStrings.push(socialSpy[key])
    }
    _gaq.push(['_setCustomVar', socialSpy.variableIndex, socialSpy.variableName, statusStrings.join(socialSpy.SEPARATOR), 2]);
  },

  installImageCheck: function(url, service) {
    var img = document.createElement('img')
    img.setAttribute('onload', "socialSpy.handleImageCheck('"+service+"', true)");
    img.setAttribute('onerror', "socialSpy.handleImageCheck('"+service+"', false)");
    img.setAttribute('style', "display: none;");
    img.setAttribute('id', "socialSpy_"+service+"_imagecheck");
    img.setAttribute('src', url);

    document.body.appendChild(img);
  },

  listen: function(obj, event, handler) {
    if (obj.addEventListener) {
      return obj.addEventListener(event, handler, false);
    }
    if (obj.attachEvent) {
      return obj.attachEvent('on'+event, handler);
    }
    return false;
  }

};
