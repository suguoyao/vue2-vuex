var SFDCApi = {};
//实例化forcetk
var client = new dynamictk.Client();

//设置SessionToken
var InstanceUrl;
if (context.EnableReverseProxy) {
  InstanceUrl = context.ReverseProxyUrl;
}
else {
  InstanceUrl = context.InstanceUrl;
}
client.setSessionToken(context.SessionId, context.ApiVersion, InstanceUrl);

//设置RefreshTokenProxy，AccessToken失效后会调用RefreshTokenProxy刷新AccessToken
client.setRefreshTokenProxy(context.OpenId, context.WEQYUserId, context.AppId, context.RefreshTokenProxyUrl, context.SFDCUserId);
