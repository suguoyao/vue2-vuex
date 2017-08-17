var DynamicApi = {};
//实例化forcetk
var client = new dynamictk.Client();
//设置SessionToken
client.setSessionToken(context.SessionId, context.ApiVersion, context.InstanceUrl);
//设置RefreshTokenProxy，AccessToken失效后会调用RefreshTokenProxy刷新AccessToken
client.setRefreshTokenProxy(context.OpenId, context.AppId, context.RefreshTokenProxyUrl);
//身份验证方法,如果打开的页面需要身份验证直接在window.onload调用此方法即可
/*DynamicApi.Authentication = function (callback) {
  if (context.OpenId == null || context.OpenId == '') {
    callback(false);
  } else {
    //获取全局Context
    if (context.IsLogin) {
      callback(true);
    } else {
      //调用Apex Rest API
      client.query(
        "",
        //Call成功回调方法
        function (data, textStatus, jqXHR) {
          if (jqVersion == '1.3') {
            userinfo = JSON.parse(data);
          } else if (jqVersion == '2.1') {
            userinfo = data;
          }
          console.log(userinfo);
          if (userinfo.totalSize > 0) {
            if ((userinfo.records[0].Register_User__c == null || !userinfo.records[0].Wechat_Login__c)&&!userinfo.records[0].Is_Scan__c) {
              //window.location.href = "../User/Register.html";
              callback(false);
            }
            else {
              //设置用户登录状态
              context.IsLogin = true;
              SetContext(context);
              callback(true);
            }
          } else {
            ShowError("没有查到您的用户信息,请您重新关注公众号!");
          }
        },
        //Call失败回调方法
        function (jqXHR, textStatus, errorThrown) {
          ShowError(jqXHR);
        }
      );
    }
  }
};*/
