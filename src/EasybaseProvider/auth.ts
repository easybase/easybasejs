import axios from "axios";
import { POST_TYPES, AuthPostResponse, Globals, StatusResponse } from "./types";
import _g from "./g";
import utilsFactory from "./utils";

export default function authFactory(globals?: Globals): any {
    const g = globals || _g;

    const { generateBareUrl, generateAuthBody, log } = utilsFactory(g);

    const getUserAttributes = async (): Promise<Record<string, string>> => {
        try {
            const attrsRes = await tokenPost(POST_TYPES.USER_ATTRIBUTES);
            return attrsRes.data;   
        } catch (error) {
            return error;
        }
    }

    const setUserAttribute = async (key: string, value: string): Promise<StatusResponse> => {
        try {
            const setAttrsRes = await tokenPost(POST_TYPES.SET_ATTRIBUTE, {
                key,
                value
            });

            return {
                success: setAttrsRes.success,
                message: JSON.stringify(setAttrsRes.data)
            };
        } catch (error) {
            return {
                success: false,
                message: "Error",
                error
            };
        }
    }

    const signUp = async (newUserID: string, password: string, userAttributes?: Record<string, string>): Promise<StatusResponse> => {
        try {
            const signUpRes = await tokenPost(POST_TYPES.SIGN_UP, {
                newUserID,
                password,
                userAttributes
            });
            return {
                success: signUpRes.success,
                message: signUpRes.data
            }   
        } catch (error) {
            return {
                success: false,
                message: "Error",
                error
            }
        }
    }

    const initAuth = async (): Promise<boolean> => {
        const t1 = Date.now();
        g.session = Math.floor(100000000 + Math.random() * 900000000);
    
        log(`Handshaking on${g.instance} instance`);
    
        const integrationType = g.ebconfig.integration.split("-")[0].toUpperCase() === "PROJECT" ? "PROJECT" : "REACT";

        try {
            const res = await axios.post(generateBareUrl(integrationType, g.integrationID), {
                version: g.ebconfig.version,
                tt: g.ebconfig.tt,
                session: g.session,
                instance: g.instance
            }, { headers: { 'Eb-Post-Req': POST_TYPES.HANDSHAKE } });
    
            if (res.data.token) {
                g.token = res.data.token;
                g.mounted = true;
                const validTokenRes = await tokenPost(POST_TYPES.VALID_TOKEN);
                const elapsed = Date.now() - t1;
                if (validTokenRes.success) {
                    log("Valid auth initiation in " + elapsed + "ms");
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    
    const tokenPost = async (postType: POST_TYPES, body?: {}): Promise<AuthPostResponse> => {

        if (!g.mounted) {
            await initAuth();
        }

        const integrationType = g.ebconfig.integration.split("-")[0].toUpperCase() === "PROJECT" ? "PROJECT" : "REACT";

        try {
            const res = await axios.post(generateBareUrl(integrationType, g.integrationID), {
                _auth: generateAuthBody(),
                ...body
            }, { headers: { 'Eb-Post-Req': postType } });
    
            if ({}.hasOwnProperty.call(res.data, 'ErrorCode') || {}.hasOwnProperty.call(res.data, 'code')) {
                if (res.data.code === "JWT EXPIRED") {
                    await initAuth();
                    return tokenPost(postType, body);
                }
    
                return {
                    success: false,
                    data: res.data.body
                }
            } else {
                return {
                    success: res.data.success,
                    data: res.data.body
                }
            }
        } catch (error) {
            return {
                success: false,
                data: error
            }
        }
    }
    
    const tokenPostAttachment = async (formData: FormData, customHeaders: {}): Promise<AuthPostResponse> => {

        if (!g.mounted) {
            await initAuth();
        }

        const regularAuthbody = generateAuthBody();
    
        const attachmentAuth = {
            'Eb-token': regularAuthbody.token,
            'Eb-token-time': regularAuthbody.token_time,
            'Eb-now': regularAuthbody.now
        };
    
        try {
            const res = await axios.post(generateBareUrl("REACT", g.integrationID), formData, {
                headers: {
                    'Eb-Post-Req': POST_TYPES.UPLOAD_ATTACHMENT,
                    'Content-Type': 'multipart/form-data',
                    ...customHeaders,
                    ...attachmentAuth
                }
            });
    
            if ({}.hasOwnProperty.call(res.data, 'ErrorCode') || {}.hasOwnProperty.call(res.data, 'code')) {
                if (res.data.code === "JWT EXPIRED") {
                    await initAuth();
                    return tokenPostAttachment(formData, customHeaders);
                }
    
                return {
                    success: false,
                    data: res.data.body
                }
            } else {
                return {
                    success: res.data.success,
                    data: res.data.body
                }
            }
        } catch (error) {
            return {
                success: false,
                data: error
            }
        }
    }
    
    return {
        initAuth,
        tokenPost,
        tokenPostAttachment,
        signUp,
        setUserAttribute,
        getUserAttributes
    }
}
