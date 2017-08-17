/**
 * Function : This is a JS toolkit for CRUD operation in MSCRM
 * Date : 2017-7-24 16:33:06
 * Author : Rose
 */
var dynamictk = window.dynamictk;
var refreshtokenCount = 0;
if (dynamictk === undefined) {
    dynamictk = {};
}

if (dynamictk.Client === undefined) {
    /**
     * The Client provides a convenient wrapper for the Force.com REST API,
     * allowing JavaScript in Visualforce pages to use the API via the Ajax
     * Proxy.
     * @param [clientId=null] 'Consumer Key' in the Remote Access app settings
     * @param [loginUrl='https://login.salesforce.com/'] Login endpoint
     * @param [proxyUrl=null] Proxy URL. Omit if running on Visualforce or
     *                  PhoneGap etc
     * @constructor
     */
    dynamictk.Client = function () {
        'use strict';
        this.sessionId = null;
        this.apiVersion = null;
        this.instanceUrl = null;
        this.authzHeader = "Authorization";
        this.asyncAjax = true;
        this.refreshtokenProxyUrl = null;
        this.openId = null;
        this.sourceId = null;
        this.userId = null;
        this.weqyUserId = null;
    };

    /**
     * Set a session token and the associated metadata in the client.
     * @param sessionId a dynamics session ID.
     * @param [apiVersion="v29.0"] Force.com API version
     * @param [instanceUrl] Omit this if running on Visualforce; otherwise
     *                   use the value from the OAuth token.
     */
    dynamictk.Client.prototype.setSessionToken = function (sessionId, apiVersion, instanceUrl) {
        'use strict';
        this.sessionId = sessionId;
        //set the api version
        this.apiVersion = (apiVersion === undefined || apiVersion === null) ? 'v8.2' : apiVersion;
        if (instanceUrl === undefined || instanceUrl === null) {
            this.visualforce = true;

            //TODO : 修改成mjn.veevlink.com
            // location.hostname can be of the form 'abc.na1.visual.force.com',
            // 'na1.salesforce.com' or 'abc.my.salesforce.com' (custom domains).
            // Split on '.', and take the [1] or [0] element as appropriate
            var elements = location.hostname.split("."),
                instance = null;
            if (elements.length === 4 && elements[1] === 'my') {
                instance = elements[0] + '.' + elements[1];
            } else if (elements.length === 3) {
                instance = elements[0];
            } else {
                instance = elements[1];
            }

            this.instanceUrl = "https://" + instance + "/api/data/";
        } else {
            this.instanceUrl = instanceUrl;
        }
    };

    /**
     * Set RefreshTokenProxy，call RefreshTokenProxy refresh AccessToken when AccessToken is invalid
     */
    dynamictk.Client.prototype.setRefreshTokenProxy = function (openId, weqyUserId, sourceId, refreshtokenProxyUrl, userId) {
        'use strict';
        this.openId = openId;
        this.weqyUserId = weqyUserId;
        this.sourceId = sourceId;
        this.refreshtokenProxyUrl = refreshtokenProxyUrl;
        this.userId = userId;
    }

    /**
     * Call RefreshTokenProxy to refresh AccessToken
     */
    dynamictk.Client.prototype.refreshAccessTokenByProxy = function (callback, error) {
        'use strict';
        var that = this,
            url = this.refreshtokenProxyUrl + '?openId=' + this.openId + '&WEQYUserId=' + this.weqyUserId + '&SourceId=' + this.sourceId + '&userId=' + this.userId;
        return $.ajax({
            type: 'GET',
            url: url,
            cache: false,
            processData: false,
            data: null,
            success: callback,
            error: error,
            dataType: "json"
        });
    };

    /**
     * Low level utility function to call the dynamics WEB API.
     * @param path resource path relative to /api/data/apiVersion/
     * @param callback function to which response will be passed(success callback)
     * @param [error=null] function to which jqXHR will be passed in case of error
     * @param [method="GET"] HTTP method for call
     * @param [payload=null] payload for POST/PATCH etc
     * @param [dataType=null] the type of return data
     */
    dynamictk.Client.prototype.ajax = function (path, callback, error, method, payload, dataType) {
        'use strict';
        var that = this,
            //todo:版本号不使用固定编码,待修改为apiVersion
            url = this.instanceUrl + '/api/data/v8.2/' + path;
            // url = 'https://msdev.veevlink.com/api/data/v8.2/' + path;
        console.log("Request URL:" + url);
        return $.ajax({
            type: method || "GET",
            async: this.asyncAjax,
            url: url,
            contentType: method === "DELETE" ? null : 'application/json',
            cache: true,  //cache = true 防止查询ajax处理相同请求时会添加后缀
            processData: false,
            data: payload,
            success: callback,
            error: function (jqXHR, textStatus, errorThrown) {
                if ((jqXHR.status === 401 || jqXHR.status === 0) && refreshtokenCount < 3) {
                    refreshtokenCount++;
                    that.refreshAccessTokenByProxy(function (proxyResponse) {
                            if (proxyResponse.error != undefined) {
                                //如果错误信息是400，并且微信账号是企业号或企业微信，说明RefreshAccessToken已过期，需要重新授权
                                if (proxyResponse.error.indexOf('400') > -1 && (context.WechatAccountType == "Enterprise" || context.WechatAccountType == "WeWork") && context.WechatIdentityMode == "SSOIntegrated") {
                                    //TODO dynamics授权页面修改
                                    self.location = domain + "/Wechat2SFDC/OAuth/PreOAuth.aspx?sourceid=" + context.AppId + "&agentid=" + context.AgentId;
                                }
                                else {
                                    error(proxyResponse.error);
                                }
                            }
                            else {
                                context.SessionId = proxyResponse.access_token;
                                SetContext(context);
                                that.sessionId = proxyResponse.access_token;
                                that.ajax(path, callback, error, method, payload);
                            }
                        },
                        error);
                } else {
                    refreshtokenCount = 0;
                    error(jqXHR, textStatus, errorThrown);
                }
            },
            dataType: method === "GET" ? "json" : null,
            beforeSend: function (xhr) {
                if (that.sessionId !== null) {
                    xhr.setRequestHeader(that.authzHeader, "Bearer " + that.sessionId);
                    xhr.setRequestHeader("OData-MaxVersion", "4.0");
                    xhr.setRequestHeader("OData-Version", "4.0");
                }
                //xhr.setRequestHeader('X-User-Agent', 'salesforce-toolkit-rest-javascript/' + that.apiVersion);
            }
        });
    };

    /**
     * Local utility to create a random string for multipart boundary
     * */
    var randomString = function () {
        'use strict';
        var str = '',
            i;
        for (i = 0; i < 4; i += 1) {
            str += (Math.random().toString(16) + "000000000").substr(2, 8);
        }
        return str;
    };

    /**
     * Low level utility function to call the dynamics WEB API.
     * @param path resource path relative to /api/data/apiVersion/
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     * @param [method="GET"] HTTP method for call
     * @param [payload=null] string or object with payload for POST/PATCH etc or params for GET
     * @param [paramMap={}] parameters to send as header values for POST/PATCH etc
     * @param [retry] specifies whether to retry on error
     */
    dynamictk.Client.prototype.apexrest = function (path, callback, error, method, payload, paramMap, retry) {
        'use strict';
        var that = this,
            //todo:change to apiversion
            url = this.instanceUrl + '/api/data/v8.2/' + path;
            // url = 'https://msdev.veevlink.com/api/data/v8.2/' + path;

        method = method || "GET";
        if (method === "GET") {
            // Handle proxied query params correctly
            if (this.proxyUrl && payload) {
                if (typeof payload !== 'string') {
                    payload = $.param(payloadpayload);
                }
                url += "?" + payload;
                payload = null;
            }
        } else {
            // Allow object payload for POST etc
            if (payload && typeof payload !== 'string') {
                payload = JSON.stringify(payload);
            }
        }

        return $.ajax({
            type: method,
            async: this.asyncAjax,
            url: url,
            contentType: 'application/json',
            // cache: false,
            cache: true,//cache = true 防止查询ajax处理相同请求时会添加后缀
            processData: false,
            data: payload,
            success: callback,
            error: (!retry) ? error : function (jqXHR, textStatus, errorThrown) {
                if ((jqXHR.status === 401 || jqXHR.status === 0) && refreshtokenCount < 3) {
                    refreshtokenCount++;
                    /*alert(jqXHR.statusText);
                     alert(jqXHR.status);
                     alert(jqXHR.responseText);*/
                    that.refreshAccessTokenByProxy(function (proxyResponse) {
                        //alert("custom " + proxyResponse);
                        //alert("previous" + context.SessionId);
                        //alert(proxyResponse.access_token);
                        //this.sessionId = proxyResponse.access_token;
                        if (proxyResponse.error != undefined) {
                            //如果错误信息是400，并且微信账号是企业号或企业微信，说明RefreshAccessToken已过期，需要重新授权
                            if (proxyResponse.error.indexOf('400') > -1 && (context.WechatAccountType == "Enterprise" || context.WechatAccountType == "WeWork") && context.WechatIdentityMode == "SSOIntegrated") {
                                //todo dynamis 授权页面
                                self.location = domain + "/Wechat2SFDC/OAuth/ProOAuth.aspx?sourceid=" + context.AppId + "&agentid=" + context.AgentId;
                            }
                            else {
                                error(proxyResponse.error);
                            }
                        }
                        else {
                            context.SessionId = proxyResponse.access_token;
                            SetContext(context);
                            that.sessionId = proxyResponse.access_token;
                            that.apexrest(path, callback, error, method, payload, paramMap, true);
                        }
                    }, error);
                } else {
                    refreshtokenCount = 0;
                    error(jqXHR, textStatus, errorThrown);
                }
            },
            dataType: "json",
            beforeSend: function (xhr) {
                var paramName;
                if (that.proxyUrl !== null) {
                    //xhr.setRequestHeader('SalesforceProxy-Endpoint', url);
                }
                //Add any custom headers
                if (paramMap === null) {
                    paramMap = {};
                }
                for (paramName in paramMap) {
                    if (paramMap.hasOwnProperty(paramName)) {
                        xhr.setRequestHeader(paramName, paramMap[paramName]);
                    }
                }
                if (that.sessionId !== null) {
                    xhr.setRequestHeader(that.authzHeader, "Bearer " + that.sessionId);
                    xhr.setRequestHeader("OData-MaxVersion", "4.0");
                    xhr.setRequestHeader("OData-Version", "4.0");
                }
                //xhr.setRequestHeader('X-User-Agent', 'salesforce-toolkit-rest-javascript/' + that.apiVersion);
            }
        });
    };

    /**
     * Creates a new record of the given type.
     * @param objectType object type; e.g. "Account"
     * @param fields an object containing initial field names and values for
     *               the record, e.g. {:Name "dynamics.com", :TickerSymbol
     *               "CRM"}
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     */
    dynamictk.Client.prototype.create = function (objectType, fields, callback, error) {
        'use strict';
        return this.ajax(objectType + "s", callback, error, "POST", JSON.stringify(fields));
    };

    /**
     * Retrieves field values for a record of the given type.
     * @param objectType object type; e.g. "Account"
     * @param id the record's object ID
     * @param [fields=null] optional comma-separated list of fields for which
     *               to return values; e.g. Name,Industry,TickerSymbol
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     */
    dynamictk.Client.prototype.retrieve = function (objectType, id, fieldList, callback, error) {
        'use strict';
        if (arguments.length === 4) {
            error = callback;
            callback = fieldList;
            fieldList = null;
        }
        var fields = fieldList ? '?$select=' + fieldList : '';
        return this.ajax(objectType + "s(" + id + ")" + fields, callback, error, "GET", null);
    };

    /**普通upsert,不使用外部id筛选,自己输入ID*/
    dynamictk.Client.prototype.upsert = function (objtype, externalKey, externalValue, fields, callback, error) {
        'use strict';
        return this.ajax(objtype + 's(' + externalKey + "=" + "\'" + externalValue + "\'" + ")", callback, error, "PATCH", JSON.stringify(fields));
    };

    /**
     * 手动控制upsert，先查询，根据查询结果判断是create/update
     */
    dynamictk.Client.prototype.keyUpsert = function (client, anySql, objtype, fields, callback, error) {
        this.query(anySql, function (msg) {
            client.keyUpsertCallBack(client, msg, objtype, fields, callback, error);
        }, null);
    };

    /**
     * 供进行upsert使用的callback,先查询再根据结果判断是更新还是创建新的
     */
    dynamictk.Client.prototype.keyUpsertCallBack = function (client, msg, objtype, fields, callback, error) {
        var result = JSON.stringify(msg);
        var jsonObject = JSON.parse(result);
        var valueJsonString = JSON.stringify(jsonObject.value);
        //格式化后的valueJsonString包含"[]"括号，去除后再转化成Json
        var trueValueString = valueJsonString.substr(1, valueJsonString.length - 2);
        //取出结果，根据结果判断创建还是更新
        if (trueValueString !== "") {
            var trueValueJsonObject = JSON.parse(trueValueString);
            //已修改成可以根据对象名动态获取ID值
            var key = objtype + "id";
            var queryId = trueValueJsonObject[key];
            console.log("========================找到数据，进行Update=========================")
            console.log("Rose queryId==" + queryId);
            //如果存在,则update
            if (queryId !== null) {
                return client.update(objtype, queryId, fields, callback, error);
            }
        } else {
            console.log("========================未找到数据，进行Create=========================")
            return client.create(objtype, fields, callback, error);
        }
    }

    /**
     * Updates field values on a record of the given type.
     * @param objtype object type; e.g. "Account"
     * @param id the record's object ID
     * @param fields an object containing initial field names and values for the record
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     */
    dynamictk.Client.prototype.update = function (objtype, id, fields, callback, error) {
        'use strict';
        return this.ajax(objtype + 's(' + id + ")", callback, error, "PATCH", JSON.stringify(fields));
    };

    /**
     * Deletes a record of the given type. Unfortunately, 'delete' is a reserved word in JavaScript.
     * @param objtype object type; e.g. "Account"
     * @param id the record's object ID
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     */
    dynamictk.Client.prototype.del = function (objtype, id, callback, error) {
        'use strict';
        return this.ajax(objtype + 's(' + id + ")", callback, error, "DELETE");
    };

    /**
     * Use simple query use sql statement
     * like "select new_name from account where new_name = 'testName' and new_sex = 1"
     * @param sql simple sql statement
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     */
    dynamictk.Client.prototype.query = function (sql, callback, error) {
        'use strict';
        var array = sql.split(/\s+where\s+/g);
        var sqlArray = array[0].split(/\s+/g);
        var fields = sqlArray[1];
        var object = sqlArray[3];
        
        var logicArray = array.length > 1 ? array[1].split(/\s+and\s+/g) : null;
        var resultFilter = "";
        if(logicArray != null){
            $.each(logicArray, function(index){
                //var pa = logicArray[index].split(/\s+/g);
                if(index != 0)
                    resultFilter += ' and ';
                var pa = logicArray[index].replace(/\s/gi, "");
                var r = new RegExp("(\\w+)(=|>=|<=|>|<|!=|<>)(('(.*)'|\"(.*)\"))","i");
                var args = pa.match(r);
                switch (args[2]) {
                    case '=':
                        args[2] = ' eq ';
                        break;
                    case '<>':
                    case '!=':
                        args[2] = ' ne ';
                        break;
                    case '>':
                        args[2] = ' gt ';
                        break;
                    case '>=':
                        args[2] = ' ge ';
                        break;
                    case '<':
                        args[2] = ' lt ';
                        break;
                    case '<=':
                        args[2] = ' le ';
                        break;
                    default:
                        break;
                }
                resultFilter += args[1] + args[2] + args[3];
    
            });
        }
        //assemble the result url
        var resultUrl = object + "s?$select=" + fields;
        if(resultFilter != '')
            resultUrl += "&$filter=" + resultFilter;
        console.log("resultUrl===" + resultUrl);
        return this.ajax(resultUrl, callback, error, "GET");
    };
}
