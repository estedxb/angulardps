export interface IAppConfig {
    env: {
        name: string;
    };
    appInsights: {
        instrumentationKey: string;
    };
    logging: {
        console: boolean;
        appInsights: boolean;
    };
    adalConfig: {
        clientId: string;
        tenant: string;
        cacheLocation: string;
        endpoints: {
            api: string
        }
    };
    apiServer: {
        metadata: string;
        rules: string;
    };
}