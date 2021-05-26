import { POST_TYPES, AuthPostResponse, Globals, StatusResponse, EmailTemplate } from "./types";
import _g from "./g";
import utilsFactory from "./utils";
import fetch from 'cross-fetch';

export default function authFactory(globals?: Globals): any {
    const g = globals || _g;

    const { generateBareUrl, generateAuthBody, log } = utilsFactory(g);

    const getUserAttributes = async (): Promise<Record<string, string>> => {
        try {
            const attrsRes = await tokenPost(POST_TYPES.USER_ATTRIBUTES);
            return attrsRes.data;
        } catch (error) {
            console.error(error)
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
                message: error.message || "Error",
                errorCode: error.errorCode || undefined
            };
        }
    }

    const forgotPassword = async (username: string, emailTemplate?: EmailTemplate): Promise<StatusResponse> => {
        try {
            const setAttrsRes = await tokenPost(POST_TYPES.FORGOT_PASSWORD_SEND, {
                username,
                emailTemplate
            });

            return {
                success: setAttrsRes.success,
                message: setAttrsRes.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || "Error",
                errorCode: error.errorCode || undefined
            };
        }
    }

    const forgotPasswordConfirm = async (code: string, username: string, newPassword: string): Promise<StatusResponse> => {
        try {
            const setAttrsRes = await tokenPost(POST_TYPES.FORGOT_PASSWORD_CONFIRM, {
                username,
                code,
                newPassword
            });

            return {
                success: setAttrsRes.success,
                message: setAttrsRes.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || "Error",
                errorCode: error.errorCode || undefined
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
                message: error.message || "Error",
                errorCode: error.errorCode || undefined
            }
        }
    }

    const signIn = async (userID: string, password: string): Promise<StatusResponse> => {
        const t1 = Date.now();
        g.session = Math.floor(100000000 + Math.random() * 900000000);

        const integrationType = g.ebconfig.integration.split("-")[0].toUpperCase() === "PROJECT" ? "PROJECT" : "REACT";

        try {
            const res = await fetch(generateBareUrl(integrationType, g.integrationID), {
                method: "POST",
                headers: {
                    'Eb-Post-Req': POST_TYPES.HANDSHAKE,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    version: g.ebconfig.version,
                    session: g.session,
                    instance: g.instance,
                    userID,
                    password
                })
            });

            const resData = await res.json();

            if (resData.token) {
                g.token = resData.token;
                g.refreshToken = resData.refreshToken;
                g.newTokenCallback();
                g.mounted = true;
                const validTokenRes = await tokenPost(POST_TYPES.VALID_TOKEN);
                const elapsed = Date.now() - t1;
                if (validTokenRes.success) {
                    log("Valid auth initiation in " + elapsed + "ms");
                    return {
                        success: true,
                        message: "Successfully signed in user"
                    };
                } else {
                    return {
                        success: false,
                        message: "Could not sign in user"
                    };
                }
            } else {
                return {
                    success: false,
                    message: "Could not sign in user"
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message || "Error",
                errorCode: error.errorCode || undefined
            };
        }
    }

    const resetUserPassword = async (newPassword: string): Promise<StatusResponse> => {
        if (typeof newPassword !== "string" || newPassword.length > 100) {
            return {
                success: false,
                message: "newPassword must be of type string"
            };
        }

        try {
            const setAttrsRes = await tokenPost(POST_TYPES.RESET_PASSWORD, { newPassword });

            return {
                success: setAttrsRes.success,
                message: JSON.stringify(setAttrsRes.data)
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || "Error",
                errorCode: error.errorCode || undefined
            };
        }
    }

    const isUserSignedIn = (): boolean => g.token.length > 0;

    const signOut = (): void => {
        g.token = "";
        g.newTokenCallback();
    }

    const initAuth = async (): Promise<boolean> => {
        const t1 = Date.now();
        g.session = Math.floor(100000000 + Math.random() * 900000000);

        log(`Handshaking on${g.instance} instance`);

        const integrationType = g.ebconfig.integration.split("-")[0].toUpperCase() === "PROJECT" ? "PROJECT" : "REACT";

        try {

            const res = await fetch(generateBareUrl(integrationType, g.integrationID), {
                method: "POST",
                headers: {
                    'Eb-Post-Req': POST_TYPES.HANDSHAKE,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    version: g.ebconfig.version,
                    tt: g.ebconfig.tt,
                    session: g.session,
                    instance: g.instance
                })
            });

            const resData = await res.json();

            if (resData.token) {
                g.token = resData.token;
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

        const res = await fetch(generateBareUrl(integrationType, g.integrationID), {
            method: "POST",
            headers: {
                'Eb-Post-Req': postType,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _auth: generateAuthBody(),
                ...body
            })
        });

        const resData = await res.json();

        if ({}.hasOwnProperty.call(resData, 'ErrorCode') || {}.hasOwnProperty.call(resData, 'code')) {
            if (resData.code === "JWT EXPIRED") {
                if (integrationType === "PROJECT") {
                    const req_res = await tokenPost(POST_TYPES.REQUEST_TOKEN, {
                        refreshToken: g.refreshToken,
                        token: g.token
                    });

                    if (req_res.success) {
                        g.token = req_res.data.token
                        g.newTokenCallback();
                        return tokenPost(postType, body);
                    } else {
                        g.token = "";
                        g.refreshToken = "";
                        g.newTokenCallback();
                        return {
                            success: false,
                            data: req_res.data
                        }
                    }
                } else {
                    await initAuth();
                }
                return tokenPost(postType, body);
            } else {
                const err = new Error(resData.body || resData.ErrorCode || resData.code || "Error");
                (err as any).errorCode = resData.ErrorCode || resData.code;
                throw err;
            }
        } else {
            return {
                success: resData.success,
                data: resData.body
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

        const integrationType = g.ebconfig.integration.split("-")[0].toUpperCase() === "PROJECT" ? "PROJECT" : "REACT";

        const res = await fetch(generateBareUrl(integrationType, g.integrationID), {
            method: "POST",
            headers: {
                'Eb-Post-Req': POST_TYPES.UPLOAD_ATTACHMENT,
                ...customHeaders,
                ...attachmentAuth
            },
            body: formData
        });

        const resData = await res.json();

        if ({}.hasOwnProperty.call(resData, 'ErrorCode') || {}.hasOwnProperty.call(resData, 'code')) {
            if (resData.code === "JWT EXPIRED") {
                if (integrationType === "PROJECT") {
                    const req_res = await tokenPost(POST_TYPES.REQUEST_TOKEN, {
                        refreshToken: g.refreshToken,
                        token: g.token
                    });

                    if (req_res.success) {
                        g.token = req_res.data.token
                        g.newTokenCallback();
                        return tokenPostAttachment(formData, customHeaders);
                    } else {
                        g.token = "";
                        g.refreshToken = "";
                        g.newTokenCallback();
                        return {
                            success: false,
                            data: req_res.data
                        }
                    }
                } else {
                    await initAuth();
                }
                return tokenPostAttachment(formData, customHeaders);
            } else {
                const err = new Error(resData.body || resData.ErrorCode || resData.code || "Error");
                (err as any).errorCode = resData.ErrorCode || resData.code;
                throw err;
            }
        } else {
            return {
                success: resData.success,
                data: resData.body
            }
        }
    }

    return {
        initAuth,
        tokenPost,
        tokenPostAttachment,
        signUp,
        setUserAttribute,
        getUserAttributes,
        isUserSignedIn,
        signIn,
        signOut,
        resetUserPassword,
        forgotPassword,
        forgotPasswordConfirm
    }
}
