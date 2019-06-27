import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit() {

      /** spinner starts on init */
      // this.spinner.show();

      this.spinner.show('mySpinner', {
        type: 'line-scale-party', 
        size: 'large', 
        bdColor: 'rgba(100,149,237, .8)', 
        color: 'white'
      });

      // setTimeout(() => {
      //     /** spinner ends after 5 seconds */
      //     this.spinner.hide();
      // }, 15000);
  }

}
