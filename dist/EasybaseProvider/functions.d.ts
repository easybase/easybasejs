export default function functionsFactory(globals?: any): {
    callFunction: (route: string, postBody?: Record<string, any>) => Promise<string | undefined>;
};
