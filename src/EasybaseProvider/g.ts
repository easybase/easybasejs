import { Ebconfig, EasybaseProviderPropsOptions, Globals } from "./types";
import Analytics, { AnalyticsInstance } from 'analytics';
import googleAnalytics from '@analytics/google-analytics'

namespace GlobalNamespace {
    export let ebconfig: Ebconfig;
    export let token: string;
    export let refreshToken: string;
    export let integrationID: string;
    export let session: number;
    export let options: EasybaseProviderPropsOptions;
    export let instance: string;
    export let mounted: boolean;
    export let newTokenCallback: () => {};
    export let userID: string;
    export let analytics: AnalyticsInstance;
    export let GA_AUTH_SALT: string; // https://support.google.com/analytics/answer/6366371?hl=en#hashed
}

const _g: Globals = { ...GlobalNamespace };

export default _g;

export function gFactory(ebconfig: Ebconfig, options?: EasybaseProviderPropsOptions): Globals {
    const defaultParams = {
        options: { ...options },
        integrationID: ebconfig.integration,
        ebconfig: ebconfig
    }

    if (ebconfig.integration && options && options.googleAnalyticsId) {
        if (options.googleAnalyticsId.startsWith("G-")) {
            // TODO: handle GA4 https://github.com/DavidWells/analytics
            console.error("Google Analytics 4 tracking Id detected. This version is not supported, please use Universal Analytics instead – https://support.google.com/analytics/answer/10269537?hl=en")
            return { ...GlobalNamespace, ...defaultParams } as Globals;
        } else {
            const analytics = Analytics({
                app: ebconfig.integration,
                plugins: [
                    googleAnalytics({
                        trackingId: options.googleAnalyticsId,
                        debug: process ? process.env.NODE_ENV === 'development' : false
                    })
                ]
            })
            return { ...GlobalNamespace, ...defaultParams, analytics, GA_AUTH_SALT: "p8YpJmWxF" } as Globals;
        }
    } else {
        return { ...GlobalNamespace, ...defaultParams } as Globals;
    }
}
