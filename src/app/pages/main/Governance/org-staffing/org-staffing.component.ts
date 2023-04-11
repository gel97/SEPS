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
  // munCityName:string = this.auth.munCityName;
toValidate:any={};
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
  this.toValidate.permanentNo = this.org.permanentNo=="" || this.org.permanentNo ==null?true:false;
  this.toValidate.temporary = this.org.temporary =="" || this.org.temporary == undefined?true:false;
  this.toValidate.coTerminus = this.org.coTerminus=="" || this.org.coTerminus == undefined?true:false;
  this.toValidate.elected = this.org.elected =="" || this.org.elected == undefined?true:false;
  if (this.toValidate.permanentNo == true||this.toValidate.temporary ==true || this.toValidate.coTerminus == true || this.toValidate.elected  == true
    ){
    Swal.fire(
      '',
      'Please fill out the required fields',
      'warning'
    );
  }else{

  this.org.munCityId=this.auth.munCityId;
  this.org.setYear=this.auth.setYear;
  this.org.tag = 1;
  this.service.AddOrg(this.org).subscribe(request=>{
    console.log(request);
    Swal.fire(
      'Good job!',
      'Data Added Successfully!',
      'success'
    );

   this.org = {};
    this.vieworg.push(request);
  },);
}
}


  editorg(editorg:any={}) {
    this.editO=editorg;
  //passing the data from table (modal)
  this.Init();
  }

  //for modal
  update(){
  this.org.tag = 1;
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

//   delete(munCityId:any, setYear:any, index:any){
//     Swal.fire({
//       text: 'Do you want to remove this file?',
//       icon: 'warning',
//       showConfirmButton: true,
//       showCancelButton: true,
//       confirmButtonText: 'Yes, remove it!'
//     }).then((result)=>{

//       if(result.value){
//         for(let i = 0; i < this.org.length;i++){
//           if(this.org[i].munCityId == munCityId){
//             this.org.splice(i,1);
//             Swal.fire(
//               'Deleted',
//               'Removed successfully',
//               'success'
//             );
//           }
//         }


//         this.service.Delete_Org(munCityId,setYear).subscribe(_data =>{

//         })
//       } else if (result.dismiss === Swal.DismissReason.cancel){

//       }

//     })
//  }
delete(setYear:any={},munCityId:any={}){
  Swal.fire({

    text: 'Do you want to remove this file?',
    icon: 'warning',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: 'Yes, remove it!'
  }).then((result)=>{
    if(result.value){
      // .tag= -1;
      this.service.Delete_Org(munCityId,setYear).subscribe(_data =>{
        Swal.fire(
          'Deleted',
          'Removed successfully',
          'success'
        );
        this.Init();
        this.org = {};
      })
    } else if (result.dismiss === Swal.DismissReason.cancel){

    }
      this.Init();
      this.org = {};
  })
}
}
