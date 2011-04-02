// Input 0
/*
 The Twitter library is licensed under the GNU Lesser General Public License version 3
 Portions from the Prototype JavaScript library
*/
function e(b, a) {
  slice = Array.prototype.slice;
  for(var c = b = slice.call(b, 0), d = c.length, f = a.length;f--;) {
    c[d + f] = a[f]
  }
  return c
}
Function.prototype.bind = function(b) {
  slice = Array.prototype.slice;
  var a = this, c = slice.call(arguments, 1);
  return function() {
    var d = e(c, arguments);
    return a.apply(b, d)
  }
};
_toString = Object.prototype.toString;
STRING_CLASS = "[object String]";
window.OAuth || alert("BUG: OAuth haven't been loaded yet!");
function g(b, a) {
  if(!localStorage.consumerKey) {
    localStorage.consumerKey = "B02C38CBnBOTwN4l4tGIQ", localStorage.consumerSecret = "RtCXZbUTaD8isPRxl26725zMPRyCaLf4CsF4WjNbPaI"
  }
  this.a = {consumerKey:localStorage.consumerKey, consumerSecret:localStorage.consumerSecret, serviceProvider:{signatureMethod:"HMAC-SHA1", requestTokenURL:"https://api.twitter.com/oauth/request_token", accessTokenURL:"https://api.twitter.com/oauth/access_token"}};
  this.b = {};
  if(b) {
    this.a.token = b, this.a.tokenSecret = a
  }
}
function h(b, a, c) {
  c == void 0 && (c = function() {
  });
  a.method = a.method.toUpperCase();
  reqBody = OAuth.formEncode(a.parameters);
  OAuth.completeRequest(a, b.a);
  authHeader = OAuth.getAuthorizationHeader("", a.parameters);
  $.ajax({url:a.action, type:a.method, beforeSend:function(d) {
    d.setRequestHeader("Authorization", authHeader);
    localStorage.phx && a.method == "GET" && d.setRequestHeader("X-PHX", "true")
  }, data:reqBody, error:function(a) {
    return c(JSON.parse(a.responseText))
  }, success:function(a) {
    return _toString.call(a) === STRING_CLASS ? (out = {}, $.each(OAuth.decodeForm(a), function(a, b) {
      out[b[0]] = b[1]
    }), c(out)) : c(a)
  }})
}
function i(b, a) {
  a == void 0 && (a = function() {
  });
  h(b, {method:"POST", action:b.a.serviceProvider.requestTokenURL}, function(b, d) {
    a({data:d, url:"https://api.twitter.com/oauth/authenticate?oauth_token=" + d.oauth_token + "&oauth_callback=oob"})
  }.bind(b, a))
}
function j(b, a, c, d) {
  d == void 0 && (d = function() {
  });
  b.a.token = c.oauth_token;
  b.a.tokenSecret = c.d;
  h(b, {method:"POST", action:b.a.serviceProvider.accessTokenURL, parameters:[["oauth_verifier", parseInt(a)]]}, function(a) {
    a.oauth_token ? (this.a.token = a.oauth_token, this.a.tokenSecret = a.oauth_token_secret, d(!0)) : d(!1)
  }.bind(b))
}
g.prototype.c = function(b, a, c, d) {
  a.indexOf("http://") != 0 && (a = "https://api.twitter.com/1/" + a + ".json");
  d == void 0 && (d = function() {
  });
  $.isFunction(c) && (d = c, c = null);
  h(this, {method:b, action:a, parameters:c}, function(b) {
    if(a == "https://api.twitter.com/1/account/verify_credentials.json") {
      this.b = b
    }
    d(b)
  }.bind(this))
};
g.prototype.get = function() {
  return this.c.apply(this, e(["get"], arguments))
};
// Input 1
var k = new g, l;
function m() {
  $("#twauth").html("<a href='#'>Logout</a>").unbind("click").click(function() {
    delete localStorage.twitterKey;
    delete localStorage.twitterUser;
    delete localStorage.twitterData;
    window.location.reload()
  })
}
$(function() {
  localStorage.twitterUser ? ($("#login-status").html("Currently logged in as <b>" + localStorage.twitterUser + "</b>"), m()) : ($("#login-status").html("Not logged in."), i(k, function(b) {
    $("#twauth").html("<img src='http://a0.twimg.com/images/dev/buttons/sign-in-with-twitter-d.png'>").unbind("click").click(function() {
      $(this).html("");
      localStorage._tmp_pin = "not loaded";
      twAuth = window.open(b.url, "twAuth", "status=0,toolbar=0,location=0,menubar=0,directories=0,scrollbars=0,width=800,height=400");
      l = setInterval(function(a) {
        localStorage._tmp_pin != "not loaded" && (twAuth.close(), clearTimeout(l), $("#twauth").html("Exchanging token..."), j(k, localStorage._tmp_pin, a, function(a) {
          if(!a) {
            return alert("Cannot authenticate to Twitter!")
          }
          k.get("account/verify_credentials", null, function(a) {
            localStorage.twitterUser = a.screen_name;
            localStorage.twitterData = JSON.stringify(a);
            localStorage.twitterKey = JSON.stringify([k.a.token, k.a.tokenSecret]);
            $("#login-status").html("Currently logged in as <b>" + localStorage.twitterUser + "</b>");
            m()
          })
        }))
      }.bind(this, b.data), 10)
    })
  }))
});
