import { ProvincialFiscalReportService } from './../../../../shared/Governance/provincial-fiscal-report.service';
import { FiscalMattersService } from 'src/app/shared/Governance/fiscal-matters.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fiscal-report',
  templateUrl: './fiscal-report.component.html',
  styleUrls: ['./fiscal-report.component.css'],
  providers:[ FilterPipe],
})
export class FiscalReportComponent implements OnInit {

  constructor(private service:ProvincialFiscalReportService, private auth:AuthService) { }
  munCityName:string = this.auth.munCityName;

  toValidate:any={};
  fiscal:any={};
  FisView:any =[];
  editmodal:any={};
  list_revenues:any =[];
  list_expend:any=[];

  pageSize = 10;
  p: string|number|undefined;
  count: number =0;
  tableSize:number = 5;
  tableSizes:any =[5,15,25,50,100];

  pageSize2 = 10;
  p2: string|number|undefined;
  count2: number =0;
  tableSize2:number = 5;
  tableSizes2:any =[5,15,25,50,100];


  isCheck: boolean = false;
  visible: boolean = true;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log("isCheck:", this.isCheck);
  }




  date = new DatePipe('en-PH')
  ngOnInit(): void {
  this.Init(
      );

 }

  Init(){
    this.list_revenues =[];
    this.list_expend =[];
     //this.fiscal.setYear=this.auth.activeSetYear;
     //this.fiscal.activeSetYear=this.auth.activeSetYear;
      this.service.GetFiscalReport().subscribe(data=>{
        for(var item of data){

          if(item.category=="1"){
            this.list_revenues.push(item);
          }  else if(item.category=="2")
          {this.list_expend.push(item)}
        }
        console.log(this.list_revenues);
      this.FisView=(<any>data);
      this.list_expend.sort((n1:any,n2:any)=>{ //order by Descending
        if(n1.fiscalYear<n2.fiscalYear)return 1;
        if(n1.fiscalYear>n2.fiscalYear)return -1;
        else return 0;
      })
      this.list_revenues.sort((n1:any,n2:any)=>{ //order by Descending
        if(n1.fiscalYear<n2.fiscalYear)return 1;
        if(n1.fiscalYear>n2.fiscalYear)return -1;
        else return 0;
      })

     })
  }


    AddFiscal() {
      this.toValidate.description = this.fiscal.description == "" || this.fiscal.description == null ? true : false;
      this.toValidate.fiscalYear = this.fiscal.fiscalYear == "" || this.fiscal.fiscalYear == undefined ? true : false;
      this.toValidate.category = this.fiscal.category == "" || this.fiscal.category == undefined ? true : false;


      if (this.toValidate.description == true || this.toValidate.fiscalYear == true || this.toValidate.category ==true) {
        Swal.fire(
          '',
          'Please fill out the required fields',
          'warning'
        );
      } else {
      this.fiscal.setYear = this.auth.activeSetYear;
      this.service.AddfiscalReport(this.fiscal).subscribe(_data=>{

        Swal.fire(
          'Good job!',
          'Data Added Successfully!',
          'success'
        );

        this.Init();
        this.fiscal = {};

      },err=>{
        Swal.fire(
          'ERROR!',
          'Error',
          'error'
        );

        this.Init();
        this.fiscal = {};
      });
    }
  }

  editfiscal(editfiscal:any={}) {
  this.editmodal=editfiscal;
    //passing the data from table (modal)
  this.Init();
  }

//for modal
update(){
  this.service.UpdatefiscalReport(this.editmodal).subscribe({next:(_data)=>{
  // this.editModal();
  },
  });

  Swal.fire({
  position: 'center',
  icon: 'success',
  title: 'Your work has been updated',
  showConfirmButton: false,
  timer: 1000
  });
  this.editmodal ={};

  }

  delete(transId: any, index: any) {
    Swal.fire({

      text: "Do you want to remove this file",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.Delete(transId).subscribe({
          next: (_data) => {
            this.Init();
          },
          error: (err) => {
            this.Init();
          },
        });
        Swal.fire(
          'Deleted!',
          'Your file has been removed.',
          'success'
        )
      }
    })
  }




  onTableDataChange(page:any){ //paginate
    console.log(page)
    this.p = page;

  }
  onTableSizeChange(event:any ){ //paginate
    this.tableSize = event. target.value;
    this.p = 1;

  }



  onTableDataChange2(page:any){ //paginate
    console.log(page)
    this.p2 = page;

  }
  onTableSizeChange2(event:any ){ //paginate
    this.tableSize2 = event. target.value;
    this.p2= 1;

  }






    }






