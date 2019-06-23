import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoggingService } from './shared/logging.service';
import { LoginToken } from './shared/models';
import { environment } from 'src/environments/environment.stag';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
  constructor(private router: Router, private logger: LoggingService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.verifyLogin(url);
  }

  verifyLogin(url): boolean {
    if (!this.isLoggedIn()) {
      this.logger.log(this.constructor.name + ' - ' + 'Redirect... Login');
      this.router.navigate([environment.logInRedirectURL]);
      return false;
    } else if (this.isLoggedIn()) {
      return true;
    }
  }
  public isLoggedIn(): boolean {
    let status = false;
    if (this.dpsLoginToken.isLoggedIn === true) {
      status = true;
    } else {
      status = false;
    }
    return status;
  }
}
