var accessToken;
var crawlMode;

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
  var crawlFields;
  if (crawlMode === "posts") {
    crawlFields = "feed.limit(3)";
  } else if (crawlMode === "comments") {
    crawlFields = "comments.limit(2)";
  } else if (crawlMode === "user friends") {
    crawlFields = "friends";
  } else {
    crawlFields = "";
  }
  if (crawlFields === "") {
    return;
  }
  FB.api(
    "/" + url,
    {
      acccess_token: accessToken,
      fields: crawlFields
    },
    function(response) {
      console.log(crawlMode);
      if (crawlMode === "posts") {
        console.log("crawl posts mode");
        parseData(response.feed);
      } else if (crawlMode === "comments") {
        console.log("crawl comments mode");
        parseData(response.comments);
      } else if (crawlMode === "user friends") {
      } else {
      }
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

function changeCrawlMode(sel) {
  crawlMode = sel.options[sel.selectedIndex].text;
  console.log("choose mode : ", crawlMode);
}
