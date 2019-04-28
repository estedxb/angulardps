import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
    providedIn: 'root'
})

export class DataService {

    private messageService = new BehaviorSubject<any>("default message");
    currentMessage = this.messageService.asObservable();

    constructor() {}

    changeMessage(message: any) {
        this.messageService.next(message);
    }

}