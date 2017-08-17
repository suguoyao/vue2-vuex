//全局变量context
var context = {
  OpenId: "",
  WechatUserId:"",
  WEQYUserId: "",
  AppId:"wxcbf80010bbc52ecd"
};
//本地Session存储
/*重要提示： 1. 每次用户点击菜单访问页面时，都需要识别用户身份，
 在成功获取用户身份后，需要在客户端临时存储用户身份数据，
 以便给后续子级页面提供使用。每个后续页面不需要走识别用户身份过程，
 直接从SessionStroage获取用户身份。
 2. 身份存储使用SessionStroage:key=Veevlink_ActiveUser，Value={“OpenID”: “XXX”, “SFDCAccessToken”: “xxxx”}
 3. 每个页面通用逻辑：首先查看地址是否传入Code，如果有Code则识别用身份并存储，
 否则从SessionStroage获取用户身份，如果SessionStroage也没有用户身份则显示“未识别的用户”
 */
var domain = "https://test.veevlink.com";
var veevlinkStorage = window.localStorage;//Veevlink本地存储
var veevlinkSession = window.sessionStorage;//VeevlinkSession存储
var sessionKey = "Veevlink_Actived_AppId";//Session存储的Key
var activedAgentIdSessionKey = "Veevlink_Actived_AgentId"; //Session存储的活动的Actived AgentId
var keyPrefix = "Veevlink_";//SessionKey前缀
var errorKey = "Veevlink_Error";//错误消息Key
var localKey = "";//local存储的key
function getQueryString(str) {
  var reg = new RegExp('(^|&)' + str + '=([^&]*)(&|$)', 'i');
  var currentUrl = window.location.href;
  var result;
  if (currentUrl.indexOf("#") == -1 || (currentUrl.indexOf("#") > -1 && currentUrl.indexOf("#") == currentUrl.length - 1)) {
    result = window.location.search.substr(1).match(reg);
  }
  if (currentUrl.indexOf("#") > -1 && currentUrl.indexOf("#") !== currentUrl.length - 1) {
    result = window.location.hash.split("?")[1] ? window.location.hash.split("?")[1].match(reg) : null;
  }

  if (result !== null) {
    return decodeURIComponent(result[2]);
  }
  return null;
}
/*封装获取Context的方法，供外部调用，
 判断是否有Code，如果有Code需要调用Base.js获取，
 如果没有判断Cookie是否存在，如果存在返回Cookie中的值，
 如果没有就代表Code也没有，没有做微信OAuth2.0认证，Cookie也丢失，所以无法识别当前用户身份提示错误页面
 */
function GetContext() {
  //从URL获取code和appid
  var code = getQueryString("code");
  var AppId = "wxcbf80010bbc52ecd";
  //var AppId = getQueryString("appid");
  var AgentId = getQueryString("agentid");
  //全局控制是否是测试环境
  //var IsTest = getQueryString("test");
  IsTest = true;

  /**********************以下代码部署到微信环境可以删除******************************/
  if (IsTest) {
    context.AppId = "wxcbf80010bbc52ecd";
    context.SessionId = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InZlYlVRb3NwZkxLbEpaTHl3ZkVkQV9ZYU1ybyJ9.eyJhdWQiOiJodHRwczovL21zZGVtby52ZWV2bGluay5jb20vIiwiaXNzIjoiaHR0cDovL3N0cy52ZWV2bGluay5jb20vYWRmcy9zZXJ2aWNlcy90cnVzdCIsImlhdCI6MTUwMTIyMjk2MSwiZXhwIjoxNTMyNzIyOTYxLCJ1cG4iOiJidWJiYS5saUB2ZWV2bGluay5jb20iLCJwcmltYXJ5c2lkIjoiUy0xLTUtMjEtMzMzOTY3Mzg0MC0zNTk1ODQzMDU1LTIwMjk5ODExMTMtMTEyNyIsInVuaXF1ZV9uYW1lIjoiVkVFVkxJTktcXGJ1YmJhLmxpIiwiYXV0aF90aW1lIjoiMjAxNy0wNy0yOFQwNjoyMjo0MC45MjBaIiwiYXV0aG1ldGhvZCI6InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphYzpjbGFzc2VzOlBhc3N3b3JkUHJvdGVjdGVkVHJhbnNwb3J0IiwidmVyIjoiMS4wIiwiYXBwaWQiOiI0QkQwRDNDMi05N0RGLTQwOEItQTZENC1BOEZDRjg0MDMwQzMifQ.TVHPfokM1zFnCueAeKYeMIm9bqHgqYbpm8B8_S71-TDQkCYmmAc4LkveWFQXrNwbRUFl7WzBsh0vhCRF7tiwRBxVi9UeLCqPYk_LfC6Ay4gDATAe971suIoYmCO5lOuWi3i36NCy7OMJ9wHXF2a3fSXCpWZE0GK3qelwxROw4KJIXyqhHx95pZo9U_VlPiP818wvAb05HLhfkaE18BiLJLPg8hbkg1zwXnH38nTq9Nrwkm5fx3hnTaAWlntH_2bhtdK1AV1FyjMWiCrwi0FY_o67_y1AIfsjzLDjOxBiyLBgdfKABgXCelyOYH1YER3QMP22TL5pquDKpLsurKksXQ";
    context.OpenId = "oztIn1UUivm09DvuqJjI8HakCCho";
    context.ApiVersion = "v37.0";
    context.InstanceUrl = "https://msdemo.veevlink.com";
    context.RefreshTokenProxyUrl = "https://dev.veevlink.com/Proxy/SFDCAccessTokenProxy.aspx";
    context.ShowDevError = true;
    context.Domain = "https://dev.veevlink.com";
    context.WEQYUserId = "Sugars";
    context.SFDCUserId = "00528000006o30c";
    context.JSAPITicket = '88888';
    context.AgentId = '5';
    return;
  }
  /**********************以上代码部署到微信环境可以删除******************************/
  //如果code为空，说明不是从微信oauth跳转回来
  if (code == null) {
    //如果appid也为空，说明页面不是从菜单直接点击过来
    if (AppId == null) {
      //如果sessionstorage中也不包含激活的公众号appid，页面不是从正常途径打开，提示错误友好页面
      if (!veevlinkSession.hasOwnProperty(sessionKey)) {
        alert("未授权");
      }
      //如果sessionstorage中包含激活的公众号appid，根据sessionkey取出公众号的appid
      else {
        AppId = veevlinkSession.getItem(sessionKey);
        if (AgentId == null) {
          if (!veevlinkSession.hasOwnProperty(activedAgentIdSessionKey)) {
            localKey = keyPrefix + AppId;
          }
          else {
            AgentId = veevlinkSession.getItem(activedAgentIdSessionKey);
            localKey = keyPrefix + AppId + "_" + AgentId;
          }
        }
        else {
          localKey = keyPrefix + AppId + "_" + AgentId;
          veevlinkSession.setItem(activedAgentIdSessionKey, AgentId);
        }
        if (veevlinkStorage.hasOwnProperty(localKey)) {
          GetContextFromStorage();
        }
        else {
          WechatOAuth(AppId, AgentId);
          //alert("获取Context失败");
        }
      }
    }
    //如果appid不为空，拼接获取localstorage的key
    else {
      if (AgentId == null) {
        if (!veevlinkSession.hasOwnProperty(activedAgentIdSessionKey)) {
          localKey = keyPrefix + AppId;
        }
        else {
          AgentId = veevlinkSession.getItem(activedAgentIdSessionKey);
          localKey = keyPrefix + AppId + "_" + AgentId;
        }
      }
      else {
        localKey = keyPrefix + AppId + "_" + AgentId;
        veevlinkSession.setItem(activedAgentIdSessionKey, AgentId);
      }
      //根据localKey判断localstorage中是否存在对应的Value
      //存在的话，将value取出来，并且转成context对象
      if (veevlinkStorage.hasOwnProperty(localKey)) {
        veevlinkSession.setItem(sessionKey, AppId);
        GetContextFromStorage();
        if (context.OpenId == "" && context.WEQYUserId == "") {
          WechatOAuth(AppId, AgentId);
        }
      }
      //如果不存在，说明从菜单点击过来，并且没有做过授权，跳转到微信oauth，进行身份认证
      else {
        WechatOAuth(AppId, AgentId);

      }
    }
  }
  //如果code不为空，说明是第一次进行身份认证，微信会带着code返回本页面
  else {
    //拼接localKey
    //localKey = keyPrefix + AppId;
    //if (!veevlinkStorage.hasOwnProperty(localKey)) {
    //获取state参数，暂时没用到
    var state = getQueryString("state");
    //动态获取当前url中的protocol和host，
    //var url = window.location.protocol + "//" + window.location.host;
    //拼接进行身份认证服务的url
    var BaseUrl = domain + "/Base.aspx";
    //发送ajax请求到身份认证地址，带上code，appid，state参数
    $.ajax({
      url: BaseUrl,
      data: {"code": code, "AppId": AppId, "AgentId": AgentId, "state": state},
      type: "GET",
      dataType: "json",
      success: function (res) {
        console.log('----------'+res);
        //请求成功后，将返回的json字符串，转换成context对象
        if (res !== null && res !== "") {
          //context = JSON.parse(res);
          context = res;
          // alert("base" + context)
          //设置当前激活的公众号appid为当前appid
          veevlinkSession.setItem(sessionKey, AppId);
          if (AgentId != null) {
            veevlinkSession.setItem(activedAgentIdSessionKey, AgentId);
          }
          //将认证后的信息保存到localstorage
          SetContext(context);
        }
      },
      fail: function (status) {
        alert("获取用户ID失败");
      }
    });
    //} else {
    //GetContextFromStorage();
    //if ((context.OpenId == null || context.OpenId == "") && (context.WEQYUserId == null || context.WEQYUserId == "") && AppId != null && AppId != "") {
    //WechatOAuth(AppId, AgentId);
    //}
    //}
  }
  //如果微信账号为企业号或微信企业，并且context里的SessionId为空，跳转到Salesforce OAuth授权页面
  if ((context.WechatAccountType == "Enterprise" || context.WechatAccountType == "WeWork") && context.WechatIdentityMode == "SSOIntegrated" && (context.SessionId == null || context.SessionId == undefined || context.SessionId == "")) {
    self.location = domain + "/Wechat2SFDC/OAuth/PreOAuth.aspx?sourceid=" + AppId + "&agentid=" + AgentId;
  }
}

//从缓存获取Context
function GetContextFromStorage() {
  context = JSON.parse(veevlinkStorage.getItem(localKey));
  //如过Context已过期，重新从服务器获取
  if (new Date().getTime() > context.ExpireTime || context.ExpireTime == undefined || context.ExpireTime == null || context.ExpireTime == "") {
    //动态获取当前url中的protocol和host，
    //var url = window.location.protocol + "//" + window.location.host;
    //拼接获取Context的url
    var BaseContextUrl = domain + "/BaseContext.aspx";
    //发送ajax请求到获取Context地址，带上appid，userid参数
    ajax({
      url: BaseContextUrl,
      data: {
        "AppId": context.AppId,
        "AgentId": context.AgentId,
        "WEQYUserId": context.WEQYUserId,
        "OpenId": context.OpenId
      },
      type: "GET",
      dataType: "json",
      success: function (res, xml) {
        //请求成功后，将返回的json字符串，转换成context对象
        if (res !== null && res !== "") {
          context = JSON.parse(res);
          // alert("basecontext" + context)
          // resJson.OpenId = context.OpenId;
          // resJson.WEQYUserId = context.WEQYUserId;
          // context = resJson;
          //设置当前激活的公众号appid为当前appid
          veevlinkSession.setItem(sessionKey, context.AppId);
          SetContext(context);
        }
      },
      fail: function (status) {
        alert("获取Context失败");
      }
    });
  }
}
//跳转微信OAuth方法
function WechatOAuth(AppId, AgentId) {
  //var url = window.location.protocol + "//" + window.location.host;
  var BaseOAuthRouterUrl = domain + "/BaseOAuthRouter.aspx";
  //发送ajax请求到BaseOAuthRouterUrl，判断WechatAccount类型及授权方式
  ajax({
    url: BaseOAuthRouterUrl,
    data: {"AppId": AppId},
    type: "GET",
    dataType: "json",
    success: function (res, xml) {
      //请求成功后，将返回的json字符串，转换成context对象
      if (res !== null && res !== "") {
        resJson = JSON.parse(res);

        // setInterval(function () {
        //   if (getQueryString('code') !== null) {
        //     window.location.reload();
        //   }
        // }, 1000);

        //根据微信账号类型及授权方式，跳转OAuth页面
        var redirectUrl = window.location.href;
        redirectUrl = encodeURIComponent(redirectUrl);
        var oauthurl;
        if (resJson.WechatAccountType == "Official") {
          if (resJson.ConnectionType == "Authorization") {
            oauthurl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + AppId + "&redirect_uri=" + redirectUrl + "&response_type=code&scope=snsapi_base&state=STATE&component_appid=" + resJson.ComponentAppId + "#wechat_redirect";
          }
          else {
            oauthurl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + AppId + "&redirect_uri=" + redirectUrl + "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
          }
        }
        else if (resJson.WechatAccountType == "Enterprise" || resJson.WechatAccountType == "WeWork") {
          oauthurl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + AppId + "&redirect_uri=" + redirectUrl + "&response_type=code&scope=snsapi_base&agentid=" + AgentId + "&state=STATE#wechat_redirect";
        }
        if (oauthurl != null) {
          setTimeout(function () {
            if (getQueryString('code') !== null) {
              window.location.reload();
            }
          }, 500);

          self.location = oauthurl;
        }
      }
    },
    fail: function (status) {
      alert("获取微信信息失败");
    }
  });
}

//封装设置Context的方法
function SetContext(context) {
  var contextStr = JSON.stringify(context);
  var AppId = veevlinkSession.getItem(sessionKey);
  var AgentId = veevlinkSession.getItem(activedAgentIdSessionKey);
  if (AgentId == null) {
    localKey = keyPrefix + AppId;
  }
  else {
    localKey = keyPrefix + AppId + "_" + AgentId;
  }
  //localKey = keyPrefix + veevlinkSession.getItem(sessionKey);
  veevlinkStorage.setItem(localKey, contextStr);
}

//利用原生Js发送Ajax请求
function ajax(options) {
  options = options || {};
  options.type = (options.type || "GET").toUpperCase();
  options.dataType = options.dataType || "json";
  var params = formatParams(options.data);
  if (window.XMLHttpRequest) {
    var xhr = new XMLHttpRequest();
  } else {
    var xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      var status = xhr.status;
      if (status >= 200 && status < 300) {
        options.success && options.success(xhr.responseText, xhr.responseXML);
      } else {
        options.fail && options.fail(status);
      }
    }
  };
  if (options.type == "GET") {
    xhr.open("GET", options.url + "?" + params, false);
    xhr.send(null);
  } else if (options.type == "POST") {
    xhr.open("POST", options.url, false);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
  }
}

//格式化URL参数
function formatParams(data) {
  var arr = [];
  for (var name in data) {
    arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
  }
  arr.push(("v=" + Math.random()).replace(".", ""));
  return arr.join("&");
}

//显示调用接口失败的错误信息
function SetCallBackError(error) {
  veevlinkSession.setItem(errorKey, error.responseText + " " + error.status + " " + error.statusText)
}

//Base.js加载完成主动调用GetContext()方法
GetContext();
