import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
// import { ManEstabService } from 'src/app/shared/Trade&_Industry/man-estab.service';
import { SepDataService } from 'src/app/shared/Tools/sep-data.service';

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css']
})
export class ExcelComponent implements OnInit {
  list_sep_year:any = [];
  filter_sep_year:any = [];
  // export_template: any = {};
  data:any = {};
  @Output() myEvent = new EventEmitter<any>();

  constructor(private sepDataService:SepDataService, private authService: AuthService,) {
    // this.data.munCityId = this.authService.munCityId;
    // this.data.allMunCity = true;
    // this.data.munCityId = this.authService.munCityId;
   }

  ngOnInit(): void {
    this.GetListSepYear();
  }


  ExportExcel(){
    // this.data.allMunCity  = this.data.allMunCity? 1:0;
  
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
