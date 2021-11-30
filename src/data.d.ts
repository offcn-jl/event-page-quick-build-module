export namespace Types {
    type Log = {
        time?: Date;
        type: 'info' | 'warn' | 'error' | 'table';
        info: any;
        title?: string;
    }
    type Product = {
        name: any; description: any; version: any
    }
    type Info = {
        modulePath?: string; // 模块路径
        type: 'lite' | 'customization' | 'manual' | 'all-a-tag' | 'a-tag'; // 登陆模块类型: lite, 轻量版; customization, 自行实现; manual, 手动触发; all-a-tag, 拦截全部 a 标签; a-tag, 拦截部分 a 标签;
        completed: boolean; // 模块是否加载完成
        api: { // 接口域名
            chaos: string; // 综合活动平台
        }
        redirect: '0' | '1'; // 在打开新页面登陆 0, 否; 1, 真;
        suffix: { // 推广后缀信息 对象
            owner?: string;
            channel?: string;
            orgn?: string;
            erp?: string;
            erpcity?: string;
            c2?: string;
            scode?: string;
            misid?: string;
        };
        suffixStr?: string; // 推广后缀信息 字符串
        contactInformation?: {
            MisID: string;   // Mis 身份标识号
            ConsultationPhone: string // 咨询电话
            SobotChannelID: number;   // 智齿 ChannelID
            SobotGroupID: string;// 智齿 技能组 ID
            WechatWorkQrCode: string;// 企业微信 二维码
            WechatWorkContactMePlugID: string;// 企业微信 联系我插件 ID
        };
        crmSid?: string;
    }
    type Functions = {
        dynamicLoading: {
            CSS(path: string): void;
            JS(path: string, callback?: any): void;
        }
        logger: {
            logs: Log[];
            push(log: Log): void;
            print(): void;
        }
        getAttr(node: Element, attr: string, defaultValue: string): string;
        getQueryString(name: string): string | null;
        request({ url, method, data, queryData }: { url: string; method?: string; data?: object; queryData?: object; }): Promise<unknown>;
    }
}
