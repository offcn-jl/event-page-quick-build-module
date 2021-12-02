(() => {
    // 将登陆框注入页面
    const ssoDiv = document.createElement('div');
    ssoDiv.innerHTML = `
    <div class="offcn-sso">
        <div class="offcn-sso-cover"></div>
        <div class="offcn-sso-modal">
            <div class="offcn-sso-modal-close"></div>
            <div class="offcn-sso-modal-top">
                <span class="offcn-sso-modal-top-span offcn-sso-modal-top-current">密码登陆</span>
                <span class="offcn-sso-modal-top-span">验证码登陆 / 注册</span>
            </div>
            <div class="offcn-sso-modal-middle">
                <span style="font-size: 90%;user-select:none;">
                    <b style="color: #da2d18">中公教育APP</b>、<b style="color: #da2d18">中公网校</b> 的账号可直接登录
                <br/>
                <br/>
                </span>
                <div class="offcn-sso-modal-middle-line">
                    <img class="offcn-sso-modal-middle-icon" src="https://jl.offcn.com/zg/ty/images/bd_icon1.png">
                    <input class="offcn-sso-modal-middle-input" type="text" id="offcn-sso-modal-phone-1" placeholder="手机号码" autocomplete="off">
                </div>
                <div class="offcn-sso-modal-middle-line">
                    <img class="offcn-sso-modal-middle-icon" src="https://jl.offcn.com/zg/ty/images/bd_icon2.png">
                    <input class="offcn-sso-modal-middle-input" type="password" id="offcn-sso-modal-password" placeholder="密码" autocomplete="off">
                </div>
                <input type="button" value="登 陆" class="offcn-sso-modal-middle-input offcn-sso-modal-middle-submit">
                <span style="font-size: 90%;user-select:none;display: block;">
                    <a class="offcn-sso-forget-password" href="https://passport.${process.env.NODE_ENV === 'production' ? '' : 't.'}eoffcn.com/sso/password.html?action=user_name_view&app_id=${window['ssoGateway'].id}" target="_blank">忘记密码?</a>
                    <br/>
                </span>
            </div>
            <div class="offcn-sso-modal-middle" style="height: 0;">
                <div class="offcn-sso-modal-middle-line">
                    <img class="offcn-sso-modal-middle-icon" src="https://jl.offcn.com/zg/ty/images/bd_icon1.png">
                    <input class="offcn-sso-modal-middle-input" type="text" id="offcn-sso-modal-phone-2" placeholder="手机号码" autocomplete="off">
                </div>
                <div class="offcn-sso-modal-middle-line">
                    <img class="offcn-sso-modal-middle-icon" src="https://jl.offcn.com/zg/ty/images/bd_icon2.png">
                    <input class="offcn-sso-modal-middle-input" type="text" id="offcn-sso-modal-code" placeholder="验证码" autocomplete="off">
                    <div class="offcn-sso-modal-middle-get-code">获取验证码</div>
                </div>
                <input type="button" value="登 陆" class="offcn-sso-modal-middle-input offcn-sso-modal-middle-submit">
            </div>
            <div class="offcn-sso-modal-bottom">${window['OffcnEventPageQuickBuildModule'].infos.suffixStr}</div>
        </div>
    </div>
    `;
    document.getElementsByTagName(window['OffcnEventPageQuickBuildModule'].product.name)[0].appendChild(ssoDiv);

    // 注入钩子
    window['OffcnEventPageQuickBuildModule'].hooks.hideLogin = () => {
        (document.getElementsByClassName('offcn-sso-cover')[0] as HTMLDivElement).style.display = 'none';
        (document.getElementsByClassName('offcn-sso-modal')[0] as HTMLDivElement).style.display = 'none';
    }
    window['OffcnEventPageQuickBuildModule'].hooks.showLogin = () => {
        (document.getElementsByClassName('offcn-sso-cover')[0] as HTMLDivElement).style.display = 'block';
        (document.getElementsByClassName('offcn-sso-modal')[0] as HTMLDivElement).style.display = 'block';
    }

    // 关闭窗口
    document.getElementsByClassName('offcn-sso-modal-close')[0].addEventListener('click', () => {
        window['OffcnEventPageQuickBuildModule'].hooks.hideLogin();
    });

    // 切换卡片
    let doms = document.getElementsByClassName('offcn-sso-modal-top-span');
    for (let key in doms) {
        if (doms.hasOwnProperty(key)) {
            doms[key].addEventListener('click', (e) => {
                let doms = document.getElementsByClassName('offcn-sso-modal-top-span');
                for (let key in doms) {
                    if (doms.hasOwnProperty(key)) {
                        doms[key].classList.remove('offcn-sso-modal-top-current');
                    }
                }
                (e.target as HTMLSpanElement).classList.add('offcn-sso-modal-top-current');
                if ((e.target as HTMLSpanElement).innerText === '密码登陆') {
                    (document.getElementsByClassName('offcn-sso-modal-middle')[0] as HTMLDivElement).style.height = "250px";
                    (document.getElementsByClassName('offcn-sso-modal-middle')[0] as HTMLDivElement).style.opacity = "1";
                    (document.getElementsByClassName('offcn-sso-modal-middle')[1] as HTMLDivElement).style.height = "0";
                    (document.getElementsByClassName('offcn-sso-modal-middle')[1] as HTMLDivElement).style.opacity = "0";
                } else {
                    (document.getElementsByClassName('offcn-sso-modal-middle')[0] as HTMLDivElement).style.height = "0";
                    (document.getElementsByClassName('offcn-sso-modal-middle')[0] as HTMLDivElement).style.opacity = "0";
                    (document.getElementsByClassName('offcn-sso-modal-middle')[1] as HTMLDivElement).style.height = "190px";
                    (document.getElementsByClassName('offcn-sso-modal-middle')[1] as HTMLDivElement).style.opacity = "1";
                }
            });
        }
    }

    // 校验手机号码是否合法
    function checkPhone(phone) {
        if (phone === '') {   // 验证手机号是否为空
            alert('请填写手机号码！');
            return false;
        } else if (!(/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/.test(phone))) {   // 验证手机号是否正确
            // 正则来自 https://any86.github.io/any-rule/
            // 中国(严谨), 根据工信部2019年最新公布的手机号段
            alert('请填写正确的手机号码！');
            return false
        } else {
            return true
        }
    }

    // 账号登陆
    document.getElementsByClassName('offcn-sso-modal-middle-submit')[0].addEventListener('click', () => {
        // 等待检查手机号注册状态完成
        if ((document.getElementsByClassName('offcn-sso-modal-middle-submit')[0] as HTMLInputElement).value === "请 稍 候 ...") {
            alert("请 稍 候 ...")
            return;
        }

        const username = (document.getElementById('offcn-sso-modal-phone-1') as HTMLInputElement).value;

        if (checkPhone(username)) {
            const password = (document.getElementById('offcn-sso-modal-password') as HTMLInputElement).value;
            if (!password) {
                alert('请填写登陆密码！');
                return;
            }

            (document.getElementsByClassName('offcn-sso-modal-middle-submit')[0] as HTMLInputElement).value = "请 稍 候 ..."

            // 如果存在提交前中间件，则先将手机号转交处理，若其返回 false 则停止执行后续步骤
            if (typeof window['OffcnEventPageQuickBuildModule'].hooks.beforeSubmit === "function") {
                if (!window['OffcnEventPageQuickBuildModule'].hooks.beforeSubmit(username)) {
                    window['OffcnEventPageQuickBuildModule'].functions.logger.push({ type: 'info', info: 'OffcnEventPageQuickBuildModule.hooks.beforeSubmit ( 提交前事件处理钩子 ) 返回 False, 阻止后续提交步骤.' });
                    (document.getElementsByClassName('offcn-sso-modal-middle-submit')[0] as HTMLInputElement).value = "登 陆"
                    return;
                } else {
                    window['OffcnEventPageQuickBuildModule'].functions.logger.push({ type: 'info', info: 'OffcnEventPageQuickBuildModule..hooks.beforeSubmit ( 提交前事件处理钩子 ) 返回 True, 继续提交.' });
                }
            } else {
                window['OffcnEventPageQuickBuildModule'].functions.logger.push({ type: 'info', info: '未定义 OffcnEventPageQuickBuildModule.hooks.beforeSubmit ( 提交前事件处理钩子 ) , 跳过预检.' });
            }

            // 执行登陆操作
            window['ssoLogin']({ type: 1, username, password },
                               data => {
                                   // 成功
                                   if (typeof window['OffcnEventPageQuickBuildModule'].hooks.afterSubmit === 'function' && !window['OffcnEventPageQuickBuildModule'].hooks.afterSubmit(username, data)) {
                                       return;
                                   }
                                   // 推送数据
                                   window['OffcnEventPageQuickBuildModule'].functions.logger.push({ type: 'info', info: '用户账号登陆成功，执行数据推送操作.' });
                                   window['OffcnEventPageQuickBuildModule'].hooks.push(data.user.info.phone);
                                   // 恢复按钮
                                   (document.getElementsByClassName('offcn-sso-modal-middle-submit')[0] as HTMLInputElement).value = "登 陆";
                                   // 关闭登陆框
                                   window['OffcnEventPageQuickBuildModule'].hooks.hideLogin();
                                   alert('登陆成功');
                               },
                               (code, message) => {
                                   // 失败
                                   window['OffcnEventPageQuickBuildModule'].functions.logger.push({ type: 'warn', info: `用户账号登陆失败，code：${code}，message：${message}.` });
                                   (document.getElementsByClassName('offcn-sso-modal-middle-submit')[0] as HTMLInputElement).value = "登 陆";
                                   alert(`[${code}] ${message}`);
                               },
            );
        }
    });

    // 发送验证码
    document.getElementsByClassName('offcn-sso-modal-middle-get-code')[0].addEventListener('click', () => {
        // 等待检查手机号注册状态完成
        if (document.getElementsByClassName('offcn-sso-modal-middle-get-code')[0].innerHTML === "请稍候...") {
            alert("请稍候...")
            return;
        } else if (document.getElementsByClassName('offcn-sso-modal-middle-get-code')[0].innerHTML.lastIndexOf('秒后重新获取') !== -1) {
            alert(`请等待 ${document.getElementsByClassName('offcn-sso-modal-middle-get-code')[0].innerHTML} !`);
            return;
        }

        const username = (document.getElementById('offcn-sso-modal-phone-2') as HTMLInputElement).value;

        if (checkPhone(username)) {
            document.getElementsByClassName('offcn-sso-modal-middle-get-code')[0].innerHTML = "请稍候...";

            // 如果存在提交前中间件，则先将手机号转交处理，若其返回 false 则停止执行后续步骤
            if (typeof window['OffcnEventPageQuickBuildModule'].hooks.beforeSubmit === "function") {
                if (!window['OffcnEventPageQuickBuildModule'].hooks.beforeSubmit(username)) {
                    window['OffcnEventPageQuickBuildModule'].functions.logger.push({ type: 'info', info: 'OffcnEventPageQuickBuildModule..hooks.beforeSubmit ( 提交前事件处理钩子 ) 返回 False, 阻止后续提交步骤.' });
                    document.getElementsByClassName('offcn-sso-modal-middle-get-code')[0].innerHTML = "获取验证码"
                    return;
                } else {
                    window['OffcnEventPageQuickBuildModule'].functions.logger.push({ type: 'info', info: 'OffcnEventPageQuickBuildModule..hooks.beforeSubmit ( 提交前事件处理钩子 ) 返回 True, 继续提交.' });
                }
            } else {
                window['OffcnEventPageQuickBuildModule'].functions.logger.push({ type: 'info', info: '未定义 OffcnEventPageQuickBuildModule.hooks.beforeSubmit ( 提交前事件处理钩子 ) , 跳过预检.' });
            }

            window['OffcnEventPageQuickBuildModule'].functions.request({ url: '/ssogateway/v1/user/sms/send', method: 'POST', data: { ssoAppId: window['ssoGateway'].id, phone: username } }).then(res => {
                if (res.responseJson.code !== 0) {
                    alert(`[${res.responseJson.code}]${res.responseJson.msg}`);
                    document.getElementsByClassName('offcn-sso-modal-middle-get-code')[0].innerHTML = "获取验证码";
                    return;
                }

                // 倒计时函数
                function countdown(second) {
                    if (second > 0) {
                        document.getElementsByClassName('offcn-sso-modal-middle-get-code')[0].innerHTML = second + "秒后重新获取";
                        // tslint:disable-next-line:no-parameter-reassignment
                        second--;
                        setTimeout(function () {
                            countdown(second)
                        }, 1000);
                    } else {
                        document.getElementsByClassName('offcn-sso-modal-middle-get-code')[0].innerHTML = "获取验证码";
                    }
                }

                alert('发送验证码成功！');
                countdown(120); // 倒计时
            }).catch(e => {
                (document.getElementsByClassName('offcn-sso-modal-middle-get-code')[0] as HTMLInputElement).value = "获取验证码"
                window['OffcnEventPageQuickBuildModule'].functions.logger.push({ type: 'warn', info: `发送验证码失败，错误内容：${e}.` });
                alert(`发送验证码失败`);
            })
        }
    })

    // 短信登陆
    document.getElementsByClassName('offcn-sso-modal-middle-submit')[1].addEventListener('click', () => {
        // 等待检查手机号注册状态完成
        if ((document.getElementsByClassName('offcn-sso-modal-middle-submit')[1] as HTMLInputElement).value === "请 稍 候 ...") {
            alert("请 稍 候 ...")
            return;
        }

        const username = (document.getElementById('offcn-sso-modal-phone-2') as HTMLInputElement).value;

        if (checkPhone(username)) {
            const code = (document.getElementById('offcn-sso-modal-code') as HTMLInputElement).value;
            if (!code) {
                alert('请填写验证码！');
                return;
            }
            if (code.length !== 6) {
                alert('请正确填写验证码！');
                return;
            }

            (document.getElementsByClassName('offcn-sso-modal-middle-submit')[1] as HTMLInputElement).value = "请 稍 候 ..."

            // 如果存在提交前中间件，则先将手机号转交处理，若其返回 false 则停止执行后续步骤
            if (typeof window['OffcnEventPageQuickBuildModule'].hooks.beforeSubmit === "function") {
                if (!window['OffcnEventPageQuickBuildModule'].hooks.beforeSubmit(username)) {
                    window['OffcnEventPageQuickBuildModule'].functions.logger.push({ type: 'info', info: 'OffcnEventPageQuickBuildModule..hooks.beforeSubmit ( 提交前事件处理钩子 ) 返回 False, 阻止后续提交步骤.' });
                    (document.getElementsByClassName('offcn-sso-modal-middle-submit')[1] as HTMLInputElement).value = "登 陆"
                    return;
                } else {
                    window['OffcnEventPageQuickBuildModule'].functions.logger.push({ type: 'info', info: 'OffcnEventPageQuickBuildModule..hooks.beforeSubmit ( 提交前事件处理钩子 ) 返回 True, 继续提交.' });
                }
            } else {
                window['OffcnEventPageQuickBuildModule'].functions.logger.push({ type: 'info', info: '未定义 OffcnEventPageQuickBuildModule.hooks.beforeSubmit ( 提交前事件处理钩子 ) , 跳过预检.' });
            }

            // 执行登陆操作
            window['ssoLogin']({ type: 2, username, code },
                               data => {
                                   // 成功
                                   if (typeof window['OffcnEventPageQuickBuildModule'].hooks.afterSubmit === 'function' && !window['OffcnEventPageQuickBuildModule'].hooks.afterSubmit(username, data)) {
                                       return;
                                   }
                                   // 推送数据
                                   window['OffcnEventPageQuickBuildModule'].functions.logger.push({ type: 'info', info: '用户短信登陆成功，执行数据推送操作.' });
                                   window['OffcnEventPageQuickBuildModule'].hooks.push(data.user.info.phone);
                                   // 恢复按钮
                                   (document.getElementsByClassName('offcn-sso-modal-middle-submit')[1] as HTMLInputElement).value = "登 陆";
                                   // 关闭登陆框
                                   window['OffcnEventPageQuickBuildModule'].hooks.hideLogin();
                                   alert('登陆成功');
                               },
                               (code, message) => {
                                   // 失败
                                   window['OffcnEventPageQuickBuildModule'].functions.logger.push({ type: 'warn', info: `用户短信登陆失败，code：${code}，message：${message}.` });
                                   (document.getElementsByClassName('offcn-sso-modal-middle-submit')[1] as HTMLInputElement).value = "登 陆";
                                   alert(`[${code}] ${message}`);
                               },
            );
        }
    });
})();