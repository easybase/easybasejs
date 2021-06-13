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
    export let GA_AUTH_SALT: string | undefined;
    export let analyticsEnabled: boolean;
    export let analyticsEvent: () => {};
    export let analyticsIdentify: () => {};
}

const _g: Globals = { ...GlobalNamespace };

export default _g;

export function gFactory({ ebconfig, options }: EasybaseProviderProps): Globals {
    const defaultG = {
        options: { ...options },
        ebconfig: ebconfig,
    }
    return { ...GlobalNamespace, ...defaultG } as Globals;
}
