import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboardaction',
  templateUrl: './dashboardaction.component.html',
  styleUrls: ['./../dashboard.component.css']
})
export class DashboardActionComponent implements OnInit {
  public notificationcount = 12;
  constructor() { }

  ngOnInit() {
  }

}
