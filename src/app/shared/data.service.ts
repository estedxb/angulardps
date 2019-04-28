import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

    private messageService = new BehaviorSubject<string>("default message");
    currentMessge = this.messageService.asObservable();

    constructor() {}

    changeMessage(message: string) {
        this.messageService.next(message);
    }    
}