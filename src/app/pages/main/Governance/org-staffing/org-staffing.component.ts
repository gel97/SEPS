import { CityOfficialService } from '../../../../shared/Governance/city-official.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { OrgStaffingService } from 'src/app/shared/Governance/org-staffing.service';

@Component({
  selector: 'app-org-staffing',
  templateUrl: './org-staffing.component.html',
  styleUrls: ['./org-staffing.component.css']
})
export class OrgStaffingComponent implements OnInit {

  constructor(private service:OrgStaffingService,private auth:AuthService) { }
  org:any={};
  vieworg:any=[];
  inputDisabled:boolean=false;
  editO:any={};



  date = new DatePipe('en-PH')
  ngOnInit(): void {
  this.Init(
      );
}

Init(){
  this.org.munCityId=this.auth.munCityId;
  this.org.activeSetYear=this.auth.activeSetYear;
  this.service.GetOrg().subscribe(data=>{
  this.vieworg =(<any>data);
    //textfield(enable/disabled)
  this.inputDisabled = this.vieworg !=null?true:false;
  if(this.vieworg !== null)
      {
        this.org = this.vieworg;
      }

  console.log(this.org)
 })
}

  AddOrg(){
    this.org.munCityId=this.auth.munCityId;
    this.org.setYear=this.auth.activeSetYear;
    this.service.AddOrg(this.org).subscribe(_data=>{
      Swal.fire(
        'Good job!',
        'Data Added Successfully!',
        'success'
      );
      this.Init();
      this.org = {};

    },err=>{
      Swal.fire(
        'ERROR!',
        'Error',
        'error'
      );
      this.Init();
      this.org= {};
    });
  }


  editorg(editorg:any={}) {
    this.editO=editorg;
  //passing the data from table (modal)
  this.Init();
  }

  //for modal
  update(){
  this.service.UpdateOrg(this.editO).subscribe({next:(_data)=>{
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
  this.editO ={};

  }



}
