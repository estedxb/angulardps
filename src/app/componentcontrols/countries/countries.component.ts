import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../shared/countries.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})

export class CountriesComponent implements OnInit {
  public countrieslists = [];
  public errorMsg;

  constructor(private countriesService: CountriesService) { }

  ngOnInit() { this.countriesService.getCountriesList().subscribe(data => this.countrieslists = data , error => this.errorMsg = error); }
}
