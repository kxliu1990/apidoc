//******* 核心帮助对象(模块化) ********
var DistHelper = {
    //展示地址
    dist_url: "",
    //模块地址(json)
    module_url: "",
    //生成文档地址
    covert_url: "",
    http_protocol: "http:",//协议
    query_params: [],
    init: function () {
        // 获取相对地址
        var urls = this.get_relative_url().split('/');
        for (var i = 0; i < urls.length; i++) {
            if (urls[i] == "" || typeof(urls[i]) == "undefined") {
                urls.splice(i, 1);
                i--;
            }
        }
        //获取对应参数
        this.query_params = this.getQueryString();
        // 拼接地址
        var host = window.location.host;
        this.http_protocol = window.location.protocol;
        //初始化地址()
        this.dist_url = this.http_protocol + '//' + host + '/' + [urls[0], urls[1]].join('/');
        var module_json_name = this.query_params['num'];
        this.module_url = this.dist_url + "/json/module/" + module_json_name + ".json";
        this.covert_url = this.http_protocol + '//' + host + '/' + [urls[0], "covert"].join("/");
        //绑定模块点击事件
        this.module_bind_click();
        return this;
    },
    /**
     * 获取模块列表
     * @returns {DistHelper}
     */
    get_module: function () {
        //获取接口模块json 并解析
        self = this;
        $.ajax({
            url: this.module_url,
            type: 'get',
            dataType: "json",
            success: function (jsonData) {
                if (!jsonData) {
                    this.show_error('未发现对应的模块数据:(' + xr.status + ')')
                }
                //拼接模板 并展示
                var html = "";
                html += "<div class='module' style='overflow-y: auto;padding:4px;background: #F2EEE6;min-height:140px;'>";
                for (var i in jsonData) {
                    html += "<div class='module-div' style='border-radius: 5px;text-align: center;border: 1px solid black;background: #89bf04;color:white;margin-bottom: 4px;cursor: pointer' data-json-name='" + $.md5(jsonData[i]['title']) + "' >" + jsonData[i]['title'] + "</div>";
                }
                html += "</div>";
                layer.closeAll();
                layer.open({
                    type: 1,
                    closeBtn: false,
                    title: '模块列表选择',
                    shade: false,
                    offset: 'rt',
                    maxmin: true,
                    skin: 'layer-self', //加上边框
                    area: ['320px', '240px'], //宽高
                    content: html
                });
                $('div.module-div:eq(0)').trigger('click');
            },
            error: function (xr) {
                self.show_error('未发现对应的模块数据:(' + xr.status + ')');
            }
        });

        return this;
    },
    /**
     *  显示错误信息
     * @param message
     * @returns {DistHelper}
     */
    show_error: function (message) {
        $('.apidoc-message').css('padding', '20px').html(message);
        return this;

    },
    /**
     * 模块绑定事件(点击展示对应模块接口)
     * @returns {DistHelper}
     */
    module_bind_click: function () {
        var self = this;
        //模块列表点击事件
        $("body").delegate("div.module-div", 'click', function () {
            var json_name = $(this).attr('data-json-name');
            //拼接json地址
            var url = self.dist_url + "/json/" + json_name + ".json";
            $("div.module-div").css('background', '#89bf04');
            $(this).css('background', '#2aabd2');
            // Build a system
            window.ui = SwaggerUIBundle({
                url: url,
                validatorUrl: false,
                dom_id: '#apidoc-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
            })
            $('.download-url-wrapper').css('display','none');
            //$(".opblock-tag-section").trigger('click')

        });
        return this;

    },
    /**
     *  获取相对地址(http://xxx.com(此处地址)?a=1)
     * @returns {string|*}
     */
    get_relative_url: function () {
        var url = document.location.toString();
        var arrUrl = url.split("//");
        var start = arrUrl[1].indexOf("/");
        var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符
        if (relUrl.indexOf("?") != -1) {
            relUrl = relUrl.split("?")[0];
        }
        return relUrl;
    },
    /**
     * 获取url中的参数
     * @returns {{}}
     */
    getQueryString: function () {
        var qs = location.search.substr(1), // 获取url中"?"符后的字串
            args = {}, // 保存参数数据的对象
            items = qs.length ? qs.split("&") : [], // 取得每一个参数项,
            item = null,
            len = items.length;

        for (var i = 0; i < len; i++) {
            item = items[i].split("=");
            var name = decodeURIComponent(item[0]),
                value = decodeURIComponent(item[1]);
            if (name) {
                args[name] = value;
            }
        }
        return args;
    }
}
//初始化对象
window.DistHelper = DistHelper.init();