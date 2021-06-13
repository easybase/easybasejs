import { Ebconfig, EasybaseProviderPropsOptions, Globals } from "./types";

namespace GlobalNamespace {
    export let ebconfig: Ebconfig;
    export let token: string;
    export let refreshToken: string;
    export let integrationID: string;
    export let session: number;
    export let options: EasybaseProviderPropsOptions;
    export let instance: "Node" | "React" | "React Native";
    export let mounted: boolean;
    export let newTokenCallback: () => {};
    export let userID: string;
    export let GA_AUTH_SALT: string; // https://support.google.com/analytics/answer/6366371?hl=en#hashed
    export let analyticsEvent: () => {};
    export let analyticsIdentify: () => {};
    export let analyticsEnabled: boolean;
}

const _g: Globals = { ...GlobalNamespace };

export default _g;

export function gFactory(ebconfig: Ebconfig, options: EasybaseProviderPropsOptions, instance: "Node" | "React" | "React Native"): Globals {
    const defaultParams = {
        options: { ...options },
        integrationID: ebconfig.integration,
        ebconfig: ebconfig,
        instance
    }

    if (ebconfig.integration && options && options.googleAnalyticsId) {
        if (options.googleAnalyticsId.startsWith("G-")) {
            if (instance === "React") {
                return {
                    ...GlobalNamespace,
                    ...defaultParams,
                    GA_AUTH_SALT: "p8YpJmWxF",
                    analyticsEnabled: true,
                    analyticsEvent: (event: string, params: Record<string, any>) => {
                        window && window.gtag && window.gtag('event', event, params);
                    },
                    analyticsIdentify: (userId: string) => {
                        gtag('config', 'GA_MEASUREMENT_ID', { 'user_id': userId });
                    }
                } as Globals;
            }
        } else if (options.googleAnalyticsId.startsWith("UA-")) {
            console.error("Universal Analytics tracking Id detected. This version is not supported, please update to Google Analytics 4 instead – https://support.google.com/analytics/answer/9744165?hl=en")
        }
    }

    return { ...GlobalNamespace, ...defaultParams, analyticsEnabled: false } as Globals;
}
