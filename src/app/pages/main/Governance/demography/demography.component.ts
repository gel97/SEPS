import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DemographyService } from 'src/app/shared/Governance/demography.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-demography',
  templateUrl: './demography.component.html',
  styleUrls: ['./demography.component.css']
})
export class DemographyComponent implements OnInit {
 // DemographyService: any;


  constructor(private service:DemographyService, private auth:AuthService) { }
  demo:any={};
  Demo:any=[];
  barangays: any=[];
  editmodal:any={};
  ViewBarangayOfficial:any={};

  date = new DatePipe('en-PH')
  ngOnInit(): void {

this.Init();
 this.list_of_barangay();

 }

 Init(){
  this.demo.munCityId=this.auth.munCityId;
  this.service.GetDemography().subscribe(data=>{
   this.Demo=(<any>data);
   console.log(this.Demo)
  })
}


  list_of_barangay(){
    this.service.ListBarangay().subscribe(data=>{
      this.barangays = <any>data;
      console.log("fgxtxgcvcgcf",this.barangays)
    });
    }

  AddDemo() {
    this.demo.munCityId=this.auth.munCityId;
    this.demo.setYear=this.auth.activeSetYear;
    this.service.AddDemography(this.demo).subscribe(_data=>{

      Swal.fire(
        'Good job!',
        'Data Added Successfully!',
        'success'
      );
      this.Init();
      this.demo = {};

    },err=>{
      Swal.fire(
        'Data already exists.!',
      );

      this.Init();
      this.demo = {};
    });
  }


  editdemo(editdemo:any={}) {
    this.editmodal=editdemo;
      //passing the data from table (modal)
    this.Init();
    }

  //for modal
  update(){
    this.service.UpdateDemography(this.editmodal).subscribe({next:(_data)=>{
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
