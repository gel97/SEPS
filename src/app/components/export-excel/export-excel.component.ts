import { Component, OnInit, Output, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SepDataService } from 'src/app/shared/Tools/sep-data.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
@Component({
  selector: 'app-export-excel',
  templateUrl: './export-excel.component.html',
  styleUrls: ['./export-excel.component.css']
})
export class ExportExcelComponent implements OnInit {
  list_sep_year   :any = [];
  filter_sep_year :any = [];
  data            :any = {};

  @Input() apiControllerName:any;

  constructor(private sepDataService:SepDataService, private authService: AuthService, private reportService: ReportsService) 
  {}

  ngOnInit(): void {
    this.GetListSepYear();
  }

  ExportExcel(){  
    this.reportService.GetExcelExport(
      this.authService.setYear,
      this.authService.munCityId,
      this.apiControllerName
    );
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
