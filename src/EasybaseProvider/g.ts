import { Ebconfig, EasybaseProviderPropsOptions, Globals, EasybaseProviderProps } from "./types";

namespace GlobalNamespace {
    export let ebconfig: Ebconfig;
    export let token: string;
    export let refreshToken: string;
    export let session: number;
    export let options: EasybaseProviderPropsOptions;
    export let instance: "Node" | "React" | "React Native";
    export let mounted: boolean;
    export let newTokenCallback: () => {};
    export let userID: string;
    export let analyticsEnabled: boolean;
    export let analyticsEvent: () => {};
    export let analyticsIdentify: () => {};
    export let GA_USER_ID_SALT: string; // https://support.google.com/analytics/answer/6366371?hl=en#hashed
}

const _g: Globals = { ...GlobalNamespace };

export default _g;

export function gFactory({ ebconfig, options }: EasybaseProviderProps): Globals {
    const defaultG = {
        options: { ...options },
        ebconfig: ebconfig,
        GA_USER_ID_SALT: "m83WnAPrq"
    }
    return { ...GlobalNamespace, ...defaultG } as Globals;
}
