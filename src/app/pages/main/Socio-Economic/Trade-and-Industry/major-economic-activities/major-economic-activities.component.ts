import { MajorEconomicService } from './../../../../../shared/Trade&_Industry/major-economic.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-major-economic-activities',
  templateUrl: './major-economic-activities.component.html',
  styleUrls: ['./major-economic-activities.component.css']
})
export class MajorEconomicActivitiesComponent implements OnInit {

  constructor( private service:MajorEconomicService, private auth:AuthService) { }
  MajorAct:any=[];
  mjr:any={};
  editmodal:any={};

  date = new DatePipe('en-PH')
  ngOnInit(): void {
  this.Init(
      );
 }


 Init(){
  this.service.GetMajorEco().subscribe((data: any)=>{
  this.MajorAct=(<any>data);
  this.MajorAct=this.MajorAct.filter((s:any) => s.tag == 1); // filter by tag
  console.log(this.MajorAct)
 // this.isLoading = false;

 })
}


  AddMajorAct(){
    this.mjr.munCityId=this.auth.munCityId;
    this.mjr.setYear=this.auth.setYear;
    this.mjr.transId = this.date.transform(Date.now(),'YYMM');
    this.mjr.tag = 1;
    this.service.AddMajorEco(this.mjr).subscribe(_data=>{
      Swal.fire(
        'Good job!',
        'Data Added Successfully!',
        'success'
      );
      this.Init();
      this.mjr = {};

    },err=>{
      Swal.fire(
        'ERROR!',
        'Error',
        'error'
      );

      this.Init();
      this.mjr = {};
    });
  }


  editmajor(editmajor:any={}) {
    this.editmodal=editmajor;
    this.Init();
    }

  //for modal
  UpdateMajorAct(){
    this.service.UpdateMajorEco(this.editmodal).subscribe({next:(_data)=>{
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
