import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomersService } from '../../shared/customers.service';
import { AuthService } from '../../shared/auth.service';
import { LoggingService } from '../../shared/logging.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private router: Router, public authService: AuthService, private logger: LoggingService) { }
  ngOnInit() { }

  logout(): void {
    this.logger.log('Logout');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
