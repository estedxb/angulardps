import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AppConfig } from './../app.config';
@Injectable({
    providedIn: 'root'
})

export class DataService {
    protected apiServer = AppConfig.settings.apiServer;
    private messageService = new BehaviorSubject<any>('default message');
    currentMessage = this.messageService.asObservable();
    private isRequireAuth: boolean = AppConfig.settings.aad.requireAuth;

    constructor() {
        if (this.isRequireAuth) {
            alert('Authentication Required');
        }
    }

    changeMessage(message: any) {
        this.messageService.next(message);
    }
}
