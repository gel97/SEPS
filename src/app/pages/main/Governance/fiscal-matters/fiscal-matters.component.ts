import { CityOfficialService } from 'src/app/shared/Governance/city-official.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import Swal from 'sweetalert2';
import { FiscalMattersService } from 'src/app/shared/Governance/fiscal-matters.service';

@Component({
  selector: 'app-fiscal-matters',
  templateUrl: './fiscal-matters.component.html',
  styleUrls: ['./fiscal-matters.component.css'],
  providers:[ FilterPipe],
})
export class FiscalMattersComponent implements OnInit {

  constructor(private service:FiscalMattersService, private auth:AuthService) { }
  fiscal:any={};
  FisView:any =[];
  editmodal:any={};

  date = new DatePipe('en-PH')
  ngOnInit(): void {
  this.Init(
      );

 }

  Init(){
     this.fiscal.munCityId=this.auth.munCityId;
     this.fiscal.activeSetYear=this.auth.activeSetYear;
      this.service.GetFiscal().subscribe(data=>{
      this.FisView=(<any>data);
      this.FisView.sort((n1:any,n2:any)=>{ //order by Descending
        if(n1.fiscalYear<n2.fiscalYear)return 1;
        if(n1.fiscalYear>n2.fiscalYear)return -1;
        else return 0;
      })
      console.log(this.FisView)
     })
  }


    AddFiscal() {
      this.fiscal.transId = this.date.transform(Date.now(),'YYMM');
      this.fiscal.munCityId=this.auth.munCityId;
      this.fiscal.activeSetYear=this.auth.activeSetYear;
      // this.barangay.tag = 1;
      this.service.Addfiscal(this.fiscal).subscribe(_data=>{

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

    editfiscal(editfiscal:any={}) {
    this.editmodal=editfiscal;
    //passing the data from table (modal)
    this.Init();

    }


//for modal
update(){
  this.service.Updatefiscal(this.editmodal).subscribe({next:(_data)=>{
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



    }






