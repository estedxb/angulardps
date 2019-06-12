import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfig } from './app-config.model';
import { environment } from '../environments/environment';
import { LoggingService } from './shared/logging.service';

@Injectable()
export class AppConfig {
    static settings: IAppConfig;
    constructor(private http: HttpClient, private logger: LoggingService) { }
    load() {
        this.logger.log('environment.name = ' + environment.name);
        const jsonFile = './../assets/config/config.' + environment.name + '.json';
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response: IAppConfig) => {
                AppConfig.settings = response as IAppConfig;
                resolve();
            }).catch((response: any) => {
                reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }
}
