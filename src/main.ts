import { product } from "./product";
import { Types } from "./data";

class OffcnEventPageQuickBuildModule {
    // 模块产品信息
    public product: Types.Product = product;

    // 模块信息
    public infos: Types.Info = {
        type: 'lite', // 登陆模块类型
        completed: false, // 模块是否加载完成
        api: {
            chaos: process.env.NODE_ENV === 'production' ? 'https://appopenbg.offcn.com/apis' : 'https://wt-backend.t.eoffcn.com/apis',
        },
        redirect: "1", // 在打开新页面登陆
        suffix: {}, // 推广后缀信息 对象
        suffixStr: '', // 推广后缀信息 字符串
    }

    // 公共函数
    public functions: Types.Functions = {
        // 获取节点 attr 属性的值
        // https://github.com/hustcc/ribbon.js/blob/master/src/ribbon.js
        getAttr: (node, attr, defaultValue) => node.getAttribute(attr) || defaultValue,
        // 获取查询字符串中参数的值
        getQueryString: (name) => {
            let r = window.location.search.substr(1).match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"));
            if (r !== null) {
                return unescape(r[2]);
            }
            // tslint:disable-next-line:no-null-keyword
            return null;
        },
        // 异步加载 CSS 与 JS 工具
        dynamicLoading: {
            CSS: (path) => {
                if (!path || path.length === 0) {
                    throw new Error("参数 'path' 是必填项 !")
                }
                let newCSS = document.createElement("link")
                newCSS.href = path
                newCSS.rel = "stylesheet"
                newCSS.type = "text/css"
                document.getElementsByTagName(this.product.name)[0].appendChild(newCSS);
            },
            JS: (path, callback) => {
                if (!path || path.length === 0) {
                    throw new Error("参数 'path' 是必填项 !")
                }
                let newJS = document.createElement("script");
                newJS.src = path;
                newJS.type = "text/javascript";
                document.getElementsByTagName(this.product.name)[0].appendChild(newJS);
                if (callback) {
                    if (document.all) {
                        // ie
                        // @ts-ignore
                        newJS.onreadystatechange = function() {
                            const state = this.readyState;
                            if (state === 'loaded' || state === 'complete') {
                                callback();
                            }
                        }
                    } else {
                        // firefox, chrome
                        newJS.onload = function() {
                            callback();
                        }
                    }
                }
            }
        },
        // 日志工具
        logger: {
            // 日志列表
            logs: [],
            // 推入日志
            push: (log) => {
                log.time = (new Date()); // 直接使用 Date() 返回的是当前时间的字符串， (new Date()) 才可以获取到当前时间的对象。
                this.functions.logger.logs.push(log);
            },
            // 打印日志
            print: () => {
                let type;
                switch (this.infos.type) {
                    case "lite":
                        type = '轻量版';
                        break;
                    case "customization":
                        type = '自行实现';
                        break;
                    case "manual":
                        type = '手动触发';
                        break;
                    case "all-a-tag":
                        type = '拦截全部 a 标签';
                        break;
                    case "a-tag":
                        type = '拦截部分 a 标签';
                        break;
                }
                // 将显示的信息分组
                console.group(
                    `%c ${this.product.name} ${this.product.description ? `${this.product.description}` : ''} %c ${this.product.version}_${process.env.NODE_ENV} %c`,
                    "background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;",
                    "background:" + (process.env.NODE_ENV === 'production' ? "#00965e" : process.env.NODE_ENV === 'test' ? "#3488ff" : "#e6a23c") + "; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;",
                    "background:transparent"
                )
                console.log(`运行模式: %c${type}`,'color: green;')
                // 遍历日志对象
                this.functions.logger.logs.forEach((log) => {
                    switch (log.type) {
                        case "info":
                            console.info(log.time + " >> " + log.info);
                            break;
                        case "warn":
                            console.warn(log.time + " >> " + log.info);
                            break;
                        case "error":
                            console.error(log.time + " >> " + log.title);
                            console.error(log.info);
                            break;
                        case "table":
                            console.info(log.time + " >> " + log.title);
                            console.table(log.info);
                            break;
                        default:
                            console.log(log.time + " >> " + JSON.stringify(log));
                    }
                });
                console.log('执行 OffcnEventPageQuickBuildModule.functions.logger.print() 命令可再次输出日志。')
                // 结束分组
                console.groupEnd();
            },
        },
        // 发送请求工具
        request: ({ url, method = 'GET', data, queryData }) => {
            // 将 queryData 对象转换为 queryString
            let currentURL = `${url}${url.indexOf('?') === -1 ? '?' : '&'}`;
            for (let key in queryData) {
                if (queryData.hasOwnProperty(key)) {
                    currentURL += `${key}=${queryData[key]}&`;
                }
            }
            currentURL = currentURL.substr(0, currentURL.length - 1); // 裁剪最后一个 &

            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {  // 200 表示相应成功 304 表示缓存中存在请求的资源
                            // 处理返回的内容
                            try {
                                if (xhr.response !== '') {
                                    xhr["responseJson"] = JSON.parse(xhr.response)
                                }
                            } catch (e) {
                                this.functions.logger.push({ type: 'error', title: `request[${method}]: 将 response 反序列化为 responseJson 失败`, info: e });
                            }
                            resolve(xhr);
                        } else {
                            let code = 0;
                            try {
                                code = JSON.parse(xhr.response).code;
                            } catch (e) {
                                this.functions.logger.push({ type: 'error', title: `request[${method}]: 获取错误代码 code 失败`, info: e });
                            }
                            if (code !== 0) {
                                let error = "未知错误";
                                try {
                                    const responseJson = JSON.parse(xhr.response);
                                    if (responseJson.errorMessage) { error = responseJson.errorMessage }
                                } catch (e) {
                                    this.functions.logger.push({ type: 'error', title: `request[${method}]: 获取错误内容 error 失败`, info: e });
                                }
                                switch (xhr.status) {
                                    case 400:
                                        alert("[ 请求错误 ] " + error);
                                        break;
                                    case 401:
                                        alert("[ 未授权 ] " + error);
                                        break;
                                    case 403:
                                        alert("[ 拒绝访问 ] " + error);
                                        break;
                                    case 404:
                                        alert("[ 请求出错 ] " + error);
                                        break;
                                    case 408:
                                        alert("[ 请求超时 ] " + error);
                                        break;
                                    case 500:
                                        alert("[ 服务器内部错误 ] " + error);
                                        break;
                                    case 501:
                                        alert("[ 服务未实现 ] " + error);
                                        break;
                                    case 502:
                                        alert("[ 网关错误 ] " + error);
                                        break;
                                    case 503:
                                        alert("[ 服务不可用 ] " + error);
                                        break;
                                    case 504:
                                        alert("[ 网关超时 ] " + error);
                                        break;
                                    case 505:
                                        alert("[ HTTP版本不受支持 ] " + error);
                                        break;
                                    default:
                                        break
                                }
                            }
                            reject(xhr);
                        }
                    }
                };
                xhr.open(method, currentURL, true);
                if (method.toUpperCase() === 'GET') {
                    xhr.send();
                } else {
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify(data));
                }
            });
        },
    }

    // 全局钩子
    public hooks = {
        // 登陆注册提交前
        // 返回 false 可阻止继续提交
        beforeSubmit: undefined,
        // 登陆注册提交后
        // 返回 false 可阻止提交后默认的逻辑执行, 如弹窗提示和推送 CRM
        afterSubmit: undefined,
        // 隐藏登陆注册窗口
        hideLogin: undefined,
        // 显示登陆注册窗口
        showLogin: undefined,
        // 推送数据
        push: (mobile) => {
            if (!mobile) {
                this.functions.logger.push({ type: 'warn', info: `未传入 mobile 参数，跳过数据推送逻辑.` });
                return;
            }
            if (!this.infos.crmSid) {
                this.functions.logger.push({ type: 'warn', info: `未配置 data-crm-sid 属性，跳过数据推送逻辑.` });
                return;
            }
            // 将 queryData 对象转换为 queryString
            const queryData = {
                mobile,
                sid: this.infos.crmSid,
                ...this.infos.suffix
            }
            let queryString = '&';
            for (let key in queryData) {
                if (queryData.hasOwnProperty(key)) {
                    queryString += `${key}=${queryData[key]}&`;
                }
            }
            queryString = queryString.substr(0, queryString.length - 1); // 裁剪最后一个 &

            // 推送数据到 CRM
            let url = 'https://dc.offcn.com:8443/a.gif';
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `${url}?${queryString}`, true);
            xhr.send();

            // 记录推送日志
            const xhr1 = new XMLHttpRequest();
            url = `${window['OffcnEventPageQuickBuildModule'].infos.api.chaos}/crm/push/log`;
            xhr1.open('GET', `${url}?${queryString}`, true);
            xhr1.send();

            this.functions.logger.push({ type: 'info', info: `数据推送完成.` });
        }
    }

    private scriptElement: HTMLScriptElement = document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1];

    // 构造函数
    constructor() {
        // 打印警告
        this.functions.logger.push({ type: 'warn', info: '中公教育网站专题页快速构建模块 ( 主程序 ) 中定义了以下全局变量:\n\n[ OffcnEventPageQuickBuildModule ( 模块根节点 ) ]\n\n请注意不要覆盖！' });

        // 初始化模块信息
        this.infos = { ...this.infos, ...this.scriptElement.dataset, modulePath: this.functions.getAttr(this.scriptElement, 'src', '').slice(0, this.functions.getAttr(this.scriptElement, 'src', '').lastIndexOf('/')) }; // 先展开 info 中的数据，再展开 script dom 的 dataset。这样做可以实现在 info 中定义各种配置的默认值，然后在 script 的 dataset 中覆盖默认值的效果。

        // 等待 body 的 dom 被挂载到页面
        const timer = setInterval(async () => {
            if (typeof (document.getElementsByTagName("body")[0]) === "object") {
                // body 的 dom 已经挂载到页面
                clearInterval(timer);

                // 判断 Dom 是否存在登陆模块自定义标签
                if (typeof (document.getElementsByTagName(this.product.name)[0]) !== "object") {
                    // 向 Dom 中添加登陆模块自定义标签
                    const ssoDom = document.createElement(this.product.name);
                    document.getElementsByTagName("body")[0].appendChild(ssoDom)
                }

                // 加载调试工具
                this.loadDebugTool();

                // 轻量版, 不加载 sso
                if (this.infos.type === 'lite') {
                    // 获取并矫正个人推广后缀
                    await this.getAndCorrectSuffixes();
                    // 填充 个人推广后缀 链接
                    this.paddingSuffixLink();
                    // 填充 联系方式
                    await this.paddingContactInformation();
                    // 加载完毕 保存状态
                    this.infos.completed = true;
                    // 打印日志
                    this.functions.logger.print();
                    return;
                }

                // 注入网校 sso 模块
                this.functions.dynamicLoading.JS(`/ssogateway/v1/web/sdk?ssoAppId=10020&redirect=${this.infos.redirect}`, async ()=>{
                    // 网校 sso 未完成跳转注入 cookie 的时候，不执行后续操作，跳转前无用的重复请求给服务器带来压力
                    // 参考 网校 sso 的业务逻辑实现
                    if (typeof window['ssoCookie'] === 'function' && window['ssoCookie']('sso-gateway-silent')) {
                        return;
                    }

                    // 获取并矫正个人推广后缀
                    await this.getAndCorrectSuffixes();

                    // 填充 个人推广后缀 链接
                    this.paddingSuffixLink();

                    // 填充 联系方式
                    await this.paddingContactInformation();

                    // 填充当前登陆用户
                    this.functions.logger.push({ type: 'info', info: `开始填充 当前登陆用户.` });
                    const doms = document.getElementsByClassName("offcn-sso-current-user");
                    let count = 0;
                    for (let key in doms) {
                        if (doms.hasOwnProperty(key)) {
                            (doms[key] as HTMLElement).innerText = window['ssoGatewayInfo'].username || '未登录';
                            count++;
                        }
                    }
                    this.functions.logger.push({ type: 'info', info: `当前登陆用户 填充完成，共填充 ${count} 个.` });

                    // 退出登陆
                    let doms0 = document.getElementsByClassName('offcn-sso-logout');
                    for (let key in doms0) {
                        if (doms0.hasOwnProperty(key)) {
                            doms0[key].addEventListener('click', () => {
                                if (!window['ssoGatewayInfo'].username) {
                                    alert('您还没有登陆！');
                                } else {
                                    window.location.href = `/ssogateway/v1/web/logout?ssoAppId=${window['ssoGateway'].id}`;
                                }
                            });
                        }
                    }

                    // 如果未登录
                    // 此处无需判断 sso 是否是 未登录则自动跳转至授权页 模式。因为是此模式时，不会出现状态为未登录的情况。
                    if (!window['ssoGatewayInfo'].username) {
                        if (this.infos.type === 'customization') {
                            // 选择 自行实现 时不加载登陆及拦截逻辑
                            this.functions.logger.push({ type: 'info', info: `SSO 模式为 自行实现 不加载登陆及拦截逻辑.` });
                            this.infos.completed = true;
                            this.functions.logger.print();
                            return;
                        }

                        // 加载登陆逻辑
                        // 加载样式
                        this.functions.dynamicLoading.CSS(`${this.infos.modulePath}/css/sso.css`);
                        // 加载 js
                        this.functions.logger.push({ type: 'info', info: `开始加载 SSO 登陆逻辑.` });
                        this.functions.dynamicLoading.JS(`${this.infos.modulePath}/sso.js`, ()=>{
                            // window['eruda'].init();
                            this.functions.logger.push({ type: 'info', info: `SSO 登陆逻辑 加载完成.` });
                            // 加载拦截逻辑
                            this.functions.logger.push({ type: 'info', info: `开始加载 SSO 拦截逻辑.` });
                            switch (this.infos.type) {
                                case "a-tag":
                                    // 拦截部分 a 标签
                                    this.functions.logger.push({ type: 'info', info: `SSO 拦截逻辑 拦截部分 a 标签 开始执行拦截操作.` });
                                    const doms = document.getElementsByClassName("offcn-sso-need-login");
                                    let count = 0;
                                    for (let key in doms) {
                                        if (doms.hasOwnProperty(key)) {
                                            const doms1 = doms[key].getElementsByTagName("a");
                                            for (let key in doms1) {
                                                if (doms1.hasOwnProperty(key) && doms1[key].getAttribute('href').indexOf('/ssogateway/v1/web/logout') === -1) {
                                                    // 移除 a 标签原有的属性 href
                                                    doms1[key].setAttribute('href', '');
                                                    // 监听点击事件
                                                    doms1[key].addEventListener("click", (event) => {
                                                        this.hooks.showLogin();
                                                        event.preventDefault() // 阻止a标签默认事件
                                                    });
                                                    count++;
                                                }
                                            }
                                        }
                                    }
                                    this.functions.logger.push({ type: 'info', info: `SSO 拦截逻辑 拦截部分 a 标签 加载成功，共拦截 ${count} 个.` });
                                    break;
                                case "all-a-tag":
                                    // 拦截全部 a 标签
                                    this.functions.logger.push({ type: 'info', info: `SSO 拦截逻辑 拦截全部 a 标签 开始执行拦截操作.` });
                                    const doms2 = document.getElementsByTagName("a");
                                    let count1 = 0;
                                    for (let key in doms2) {
                                        if (doms2.hasOwnProperty(key) && doms2[key].getAttribute('href').indexOf('/ssogateway/v1/web/logout') === -1) {
                                            // 移除 a 标签原有的属性 href
                                            doms2[key].setAttribute('href', '');
                                            // 移除 a 标签原有的属性 target
                                            doms2[key].removeAttribute('target');
                                            // 监听点击事件
                                            doms2[key].addEventListener("click", (event) => {
                                                this.hooks.showLogin();
                                                event.preventDefault() // 阻止a标签默认事件
                                            });
                                            count1++;
                                        }
                                    }
                                    this.functions.logger.push({ type: 'info', info: `SSO 拦截逻辑 拦截全部 a 标签 加载成功，共拦截 ${count1} 个.` });
                                    break;
                                default:
                                // 默认为 manual 模式 手动触发
                            }
                            this.functions.logger.push({ type: 'info', info: `SSO 拦截逻辑 加载完成.` });
                            this.infos.completed = true;
                            this.functions.logger.print();
                        });
                    } else {
                        this.functions.logger.push({ type: 'info', info: `用户已经登陆，执行数据推送操作.` });
                        this.hooks.push(window['ssoGatewayInfo'].username);
                        this.infos.completed = true;
                        this.functions.logger.print();
                    }
                });
            }
        }, 50);
    }

    // 加载调试工具
    private loadDebugTool() {
        if (process.env.NODE_ENV === 'production' && navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|IEMobile)/i)) {
            this.functions.dynamicLoading.JS("https://cdn.jsdelivr.net/npm/eruda", ()=>{
                window['eruda'].init();
            });
        }
    }

    // 获取并矫正个人推广后缀
    private getAndCorrectSuffixes() {
        // 根据入参创建个人推广后缀对象
        if (this.functions.getQueryString('owner')) { this.infos.suffix.owner = this.functions.getQueryString('owner') }
        if (this.functions.getQueryString('channel')) { this.infos.suffix.channel = this.functions.getQueryString('channel') }
        if (this.functions.getQueryString('orgn')) { this.infos.suffix.orgn = this.functions.getQueryString('orgn') }
        if (this.functions.getQueryString('erp')) { this.infos.suffix.erp = this.functions.getQueryString('erp') }
        if (this.functions.getQueryString('erp')) { this.infos.suffix.erpcity = this.functions.getQueryString('erp') }
        if (this.functions.getQueryString('c2')) { this.infos.suffix.c2 = this.functions.getQueryString('c2') }
        if (this.functions.getQueryString('scode')) { this.infos.suffix.scode = this.functions.getQueryString('scode') }
        if (this.functions.getQueryString('misid')) { this.infos.suffix.misid = this.functions.getQueryString('misid') }

        // 生成个人推广后缀字符串
        for (let key in this.infos.suffix) {
            if (this.infos.suffix.hasOwnProperty(key)) {
                this.infos.suffixStr += `${key}=${this.infos.suffix[key]}&`;
            }
        }
        this.infos.suffixStr = this.infos.suffixStr.substr(0, this.infos.suffixStr.length - 1); // 裁剪最后一个 &

        // 矫正个人推广后缀
        return new Promise((resolve, reject) => {
            if (this.infos.suffixStr.length > 0) {
                this.functions.request({ url: `${this.infos.api.chaos}/suffix/check`, queryData: this.infos.suffix }).then(res => {
                    // 填充矫正后的个人推广后缀
                    const suffixInfo = res['responseJson'].data;
                    if (suffixInfo) {
                        if (suffixInfo.Erp) { this.infos.suffix.erp = suffixInfo.Erp; }
                        if (suffixInfo.Erp) { this.infos.suffix.erpcity = suffixInfo.Erp; }
                        if (suffixInfo.MisId) { this.infos.suffix.misid = suffixInfo.MisId; }
                        if (suffixInfo.Organization) { this.infos.suffix.orgn = suffixInfo.Organization; }
                        if (suffixInfo.Owner) { this.infos.suffix.owner = suffixInfo.Owner; }
                        if (suffixInfo.SCode) { this.infos.suffix.scode = suffixInfo.SCode; }
                        this.infos.suffixStr = '';
                        for (let key in this.infos.suffix) {
                            if (this.infos.suffix.hasOwnProperty(key)) {
                                this.infos.suffixStr += `${key}=${this.infos.suffix[key]}&`;
                            }
                        }
                        this.infos.suffixStr = this.infos.suffixStr.substr(0, this.infos.suffixStr.length - 1); // 裁剪最后一个 &
                    }
                    // 打印个人推广后缀信息
                    this.functions.logger.push({type: 'table', title: '个人后缀信息', info: this.infos.suffix})
                    resolve(0);
                }).catch(err => reject(err));
            } else {
                resolve(0);
            }
        });
    }

    // 填充 个人推广后缀 链接
    private paddingSuffixLink() {
        this.functions.logger.push({ type: 'info', info: '开始填充 个人后缀 链接.' });
        const doms = document.getElementsByClassName("offcn-suffix-link") as unknown as HTMLLinkElement;
        let count = 0;
        for (let key in doms) {
            if (doms.hasOwnProperty(key)) {
                if (typeof doms[key].href === "string" && doms[key].href.length > 0) {
                    // 判断是否已经含有参数
                    if (doms[key].href.indexOf("?") !== -1) {
                        // 含有参数, 将后缀拼接到原参数后
                        doms[key].href = doms[key].href + "&" + this.infos.suffixStr;
                    } else {
                        // 没有参数, 直接拼接后缀
                        doms[key].href = doms[key].href + "?" + this.infos.suffixStr;
                    }
                    count++;
                }
            }
        }
        this.functions.logger.push({ type: 'info', info: `个人后缀 链接 填充完成，共填充 ${count} 个.` });
    }

    // 填充 联系方式
    private async paddingContactInformation() {
        await this.functions.request({ url: `${this.infos.api.chaos}/tools-and-service/contact-information`, queryData: this.infos.suffix }).then(res => {
            if (res['responseJson'].success) {
                // 保存联系方式到模块节点中
                this.infos.contactInformation = res['responseJson'].data;

                this.functions.logger.push({ type: 'info', info: '开始填充 联系方式.' });

                this.functions.logger.push({ type: 'info', info: '开始填充 联系方式->智齿咨询.' });
                // 加载 智齿咨询插件
                window['zc'] = function () {
                    window['cbk'] = window['cbk'] || [];
                    window['cbk'].push(arguments);
                }
                const sobotScript = document.createElement('script');
                sobotScript.async = true;
                sobotScript.id = 'zhichiScript';
                sobotScript.className = 'offcn-contact-information-zhichi'; // 该class可自行设置，只需要在使用的自定义入口上同名即可
                sobotScript.src = `https://offcn.sobot.com/chat/frame/v2/entrance.js?sysnum=020bd1a0655d4c5e9603b2d261018f6a&channelid=${this.infos.contactInformation.SobotChannelID}`;
                document.getElementsByTagName(this.product.name)[0].appendChild(sobotScript);
                // 初始化智齿 JSSDK
                window['zc']('config', {
                    manual: true, // 是否手动初始化
                    custom: true, // 自定义按钮
                    refresh: true, // 是否每次展开聊天组件都刷新 默认false
                    groupid: '020bd1a0655d4c5e9603b2d261018f6a',
                });
                // 填充 个人后缀 智齿
                const doms = document.getElementsByClassName("offcn-contact-information-zhichi") as unknown as HTMLLinkElement;
                let count = 0;
                for (let key in doms) {
                    if (doms.hasOwnProperty(key) && doms[key].nodeName !== 'SCRIPT') {
                        doms[key].addEventListener("click", () => {
                            if (typeof zc === "function") {
                                zc('config', {
                                    custom: true,
                                    reload: true,
                                    groupid: this.infos.contactInformation.SobotGroupID,
                                    refresh: true, // 是否每次展开聊天组件都刷新 默认false
                                });
                                zc('frame_status', function(data) {
                                    if (data.code === '000002') {
                                        zc('frame_manual', function(res) {
                                            if (res.code === '000000') {
                                                zc('frame_status');
                                            }
                                        })
                                    } else if (data === 'expand') {
                                        zc('frame_status');
                                    }
                                });
                            } else {
                                alert("正在努力加载中～");
                            }
                        });
                        count++;
                    }
                }
                this.functions.logger.push({ type: 'info', info: `联系方式->智齿咨询 填充完成，共填充 ${count} 个.` });

                // 填充 联系方式 微信 企业微信
                this.functions.logger.push({ type: 'info', info: '开始填充 联系方式->微信 企业微信.' });
                const doms1 = document.getElementsByClassName("offcn-contact-information-wechat-work") as unknown as HTMLLinkElement;
                let count1 = 0;
                for (let key in doms1) {
                    if (doms1.hasOwnProperty(key) && doms1[key].nodeName === 'IMG') {
                        doms1[key].src = this.infos.contactInformation.WechatWorkQrCode;
                        count1++;
                    }
                }
                this.functions.logger.push({ type: 'info', info: `联系方式->微信->企业微信 填充完成，共填充 ${count1} 个.` });

                // 填充 联系方式 咨询电话 仅文本
                this.functions.logger.push({ type: 'info', info: '开始填充 联系方式->咨询电话 仅文本.' });
                const doms2 = document.getElementsByClassName("offcn-contact-information-phone-text") as unknown as HTMLLinkElement;
                let count2 = 0;
                for (let key in doms2) {
                    if (doms2.hasOwnProperty(key)) {
                        doms2[key].innerHTML = this.infos.contactInformation.ConsultationPhone;
                        count2++;
                    }
                }
                this.functions.logger.push({ type: 'info', info: `联系方式->咨询电话->仅文本 填充完成，共填充 ${count2} 个.` });

                // 填充 联系方式 咨询电话 仅拨打电话
                this.functions.logger.push({ type: 'info', info: '开始填充 联系方式->咨询电话->仅拨打电话.' });
                const doms3 = document.getElementsByClassName("offcn-contact-information-phone-call") as unknown as HTMLLinkElement;
                let count3 = 0;
                for (let key in doms3) {
                    if (doms3.hasOwnProperty(key)) {
                        doms3[key].addEventListener("click", () => {
                            window.location.href = `tel:${this.infos.contactInformation.ConsultationPhone}`;
                        });
                        count3++;
                    }
                }
                this.functions.logger.push({ type: 'info', info: `联系方式->咨询电话->仅拨打电话 填充完成，共填充 ${count3} 个.` });

                // 填充 联系方式 咨询电话 文本加拨打电话
                this.functions.logger.push({ type: 'info', info: '开始填充 联系方式->咨询电话->文本加拨打电话.' });
                const doms4 = document.getElementsByClassName("offcn-contact-information-phone") as unknown as HTMLLinkElement;
                let count4 = 0;
                for (let key in doms4) {
                    if (doms4.hasOwnProperty(key)) {
                        doms4[key].innerHTML = `${doms4[key].dataset.perfix}${this.infos.contactInformation.ConsultationPhone}${doms4[key].dataset.suffix}`;
                        doms4[key].addEventListener("click", ()  => {
                            // @ts-ignore
                            window.location.href = `tel:${this.infos.contactInformation.ConsultationPhone}`;
                        });
                        count4++;
                    }
                }
                this.functions.logger.push({ type: 'info', info: `联系方式->咨询电话->文本加拨打电话 填充完成，共填充 ${count4} 个.` });

                this.functions.logger.push({ type: 'info', info: `联系方式 填充完成，共填充 ${count+count1+count2+count3+count4} 个.` });
            } else {
                this.functions.logger.push({ type: 'error',title: '填充 联系方式 失败 [ 获取联系方式信息失败 ]', info: res['responseJson'] });
            }
        }).catch(e => {
            this.functions.logger.push({ type: 'error',title: '填充 联系方式 失败 [ 获取联系方式信息失败 ]', info: e })
        });
    }
}

// 把模块挂载到 window
window['OffcnEventPageQuickBuildModule'] = new OffcnEventPageQuickBuildModule();
