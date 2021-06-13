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

export function gFactory(integration: string, options?: EasybaseProviderPropsOptions): Globals {
    if (integration && options && options.googleAnalyticsId) {
        if (options.googleAnalyticsId.startsWith("G-")) {
            // TODO: handle GA4 https://github.com/DavidWells/analytics
            console.error("Google Analytics 4 tracking Id detected. This version is not supported, please use Universal Analytics instead – https://support.google.com/analytics/answer/10269537?hl=en")
            return { ...GlobalNamespace } as Globals;
        } else {
            const analytics = Analytics({
                app: integration,
                plugins: [
                    googleAnalytics({
                        trackingId: options.googleAnalyticsId,
                        debug: process ? process.env.NODE_ENV === 'development' : false
                    })
                ]
            })
            return { ...GlobalNamespace, analytics, GA_AUTH_SALT: "p8YpJmWxF" } as Globals;
        }
    } else {
        return { ...GlobalNamespace } as Globals;
    }
}
