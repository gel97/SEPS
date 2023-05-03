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
 munCityName:string = this.auth.munCityName;
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
  this.org.setYear=this.auth.activeSetYear;
  this.service.GetOrg().subscribe(data=>{
  this.vieworg =(<any>data);
    //textfield(enable/disabled)
  this.inputDisabled = this.vieworg !=null?true:false;
  if(this.vieworg !== null)
      {
        this.org = this.vieworg;
      }

  console.log(data)
 })
}

AddOrg(){
  this.toValidate.permanentNo = this.org.permanentNo=="" || this.org.permanentNo ==null?true:false;
  this.toValidate.temporary = this.org.temporary =="" || this.org.temporary == undefined?true:false;
  this.toValidate.coTerminus = this.org.coTerminus=="" || this.org.coTerminus == undefined?true:false;
  this.toValidate.elected = this.org.elected =="" || this.org.elected == undefined?true:false;
  this.toValidate.casual = this.org.casual=="" || this.org.casual ==null?true:false;
  this.toValidate.jobOrder = this.org.jobOrder =="" || this.org.jobOrder == undefined?true:false;
  this.toValidate.contractual = this.org.contractual=="" || this.org.contractual == undefined?true:false;
  this.toValidate.casualSef = this.org.casualSef =="" || this.org.casualSef == undefined?true:false;
  this.toValidate.schoolBoard = this.org.schoolBoard=="" || this.org.schoolBoard ==null?true:false;
  this.toValidate.contractService = this.org.contractService =="" || this.org.contractService == undefined?true:false;
  this.toValidate.others = this.org.others=="" || this.org.others == undefined?true:false;

  if (this.toValidate.permanentNo == true||this.toValidate.temporary ==true || this.toValidate.coTerminus == true || this.toValidate.elected  == true ||
     this.toValidate.casual == true||this.toValidate.jobOrder ==true || this.toValidate.contractual == true || this.toValidate.casualSef  == true ||
     this.toValidate.schoolBoard == true||this.toValidate.contractService ==true || this.toValidate.contractual == true || this.toValidate.others  == true

    ){
    Swal.fire(
      '',
      'Please fill out the required fields',
      'warning'
    );
  }else{

  this.org.munCityId=this.auth.munCityId;
  this.org.setYear=this.auth.setYear;
  // this.org.tag = 1;
  this.service.AddOrg(this.org).subscribe(request=>{
    console.log(request);
    Swal.fire(
      'Good job!',
      'Data Added Successfully!',
      'success'
    );
  this.Init();
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
delete(transId:any) {
  Swal.fire({
    text: "Do you want to remove this file",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, remove it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.service.Delete_Org(transId).subscribe({
        next: (_data) => {
          this.Init();
        },
        error: (err) => {
          this.Init();
          this.org={};
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


}
