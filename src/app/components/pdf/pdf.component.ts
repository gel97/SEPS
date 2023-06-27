import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AuthService } from 'src/app/services/auth.service';
import { PdfService } from 'src/app/services/pdf.service';
import { SepDataService } from 'src/app/shared/Tools/sep-data.service';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent implements OnInit {
  list_sep_year:any = [];
  filter_sep_year:any = [];

  data:any = {};
  @Output() myEvent = new EventEmitter<any>();

  constructor(private sepDataService:SepDataService, private authService:AuthService) {
    // this.data.start = this.authService.activeSetYear - 1;
    // this.data.end = this.authService.activeSetYear - 1;
    this.data.year = this.authService.activeSetYear - 1;
    this.data.allMunCity = true;
    this.data.munCityId = this.authService.munCityId;
  }

  ngOnInit(): void {
    this.GetListSepYear();
  }

  generatePdf() {
    //this.data.isRange     = this.data.isRange? 1:0;
    this.data.allMunCity  = this.data.allMunCity? 1:0;
    this.myEvent.emit();
  }

  GetListSepYear(){
     this.sepDataService.ListSepYear().subscribe({
      next:(response)=>{
        this.list_sep_year =(<any>response);         
      },
      error: ()=>{

      },
      complete: ()=>{
        this.FilterByNotActiveYear();
      }
     });
  }

  FilterByNotActiveYear() {
    this.filter_sep_year = [];

    this.list_sep_year.forEach((a: any) => {

      if(a.isActive == 0)
      {
        this.filter_sep_year.push(a);
      }      
    });
  }
}
