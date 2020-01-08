var accessToken;

function loginFB(elmnt, clr) {
  initFB(elmnt, clr);
  FB.login(
    function(response) {
      if (response.authResponse) {
        console.log("Successfull ");
        console.log("tokennnnn " + response.authResponse.accessToken);
        let token = response.authResponse.accessToken;
        accessToken = token;
        console.log("tk", accessToken);
        // getData(token);
      } else {
        console.log("Login failed");
      }
    },
    {
      scope: "manage_pages,pages_show_list"
    }
  );
}

function initFB(elmnt, clr) {
  FB.init({
    appId: "842577259509809",
    autoLogAppEvents: true,
    xfbml: true,
    version: "v5.0"
  });
}

function getData(token) {
  var url = document.getElementById("txtInput").value;
  console.log("url", url);
  FB.api(
    "/" + url,
    {
      access_token: accessToken
    },
    function(response) {
      console.log("data", response);
      var node = document.createElement("P"); // Create a <li> node
      var textnode = document.createTextNode(JSON.stringify(response)); // Create a text node
      node.appendChild(textnode); // Append the text to <li>
      document.getElementById("myDIV").appendChild(node);
    }
  );
}

var node;
var textnode;

function getPostsWithLimit(token, limit) {
  console.log("run get data with limit function");
  var url = document.getElementById("txtInput").value;

  FB.api(
    "/" + url,
    {
      acccess_token: accessToken,
      fields: "feed.limit(3)"
    },
    function(response) {
      console.log("response.feed : ", response.feed);
      parseData(response.feed);
    }
  );
}

function parseData(facebookRes) {
  console.log("facebookRes : ", facebookRes);
  for (var i = 0; i < facebookRes.data.length; i++) {
    console.log(facebookRes.data[i].message);
    // parsing data here :
    var node = document.createElement("P"); // Create a <li> node
    var response = facebookRes.data[i];
    var textnode = document.createTextNode(JSON.stringify(response)); // Create a text node
    node.appendChild(textnode); // Append the text to <li>
    document.getElementById("myDIV").appendChild(node);
  }
  var nextURL = facebookRes.paging.next;
  if (nextURL != null) {
    FB.api(nextURL, {}, function(response) {
      parseData(response);
    });
  }
}
