import { CityOfficialService } from '../../../../shared/Governance/city-official.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { BarangayOfficialService } from 'src/app/shared/Governance/barangay-official.service';

@Component({
  selector: 'app-barangays',
  templateUrl: './barangays.component.html',
  styleUrls: ['./barangays.component.css']
})
export class BarangaysComponent implements OnInit {
@ViewChild ('long',{static:false}) longRef : ElementRef | undefined;
@ViewChild ('lat',{static:false}) latRef : ElementRef | undefined;

  constructor(private service:BarangayOfficialService, private auth:AuthService) { }
  ViewBarangayOfficial:any =[];
  barangay: any = {};
  editmodal:any ={};
  UpdateBarangay:any ={};
  listBarangay:any ={};

  pageSize = 25;
  p: string|number|undefined;
  count: number =0;
  tableSize:number = 5;
  tableSizes:any =[5,10,15,25,50,100];

  date = new DatePipe('en-PH')
  ngOnInit(): void {
  this.Init();
  this.GetListBarangay();
}

Init(){
 this.service.GetBarangay().subscribe(data=>{
  this.ViewBarangayOfficial=(<any>data);
  console.log(this.ViewBarangayOfficial)

 })
}

GetListBarangay(){
  this.service.ListBarangay().subscribe(data=>{
    this.listBarangay=(<any>data);
    console.log(this.listBarangay) 
   })
}

AddBarangay() {
  this.barangay.transId = this.date.transform(Date.now(),'YYMM');
  this. barangay.munCityId=this.auth.munCityId;
  this.barangay.activeSetYear=this.auth.activeSetYear;
  // this.barangay.tag = 1;
  this.service.AddBarangay(this.barangay).subscribe(_data=>{

    Swal.fire(
      'Good job!',
      'Data Added Successfully!',
      'success'
    );
    this.Init();
    this.barangay = {};

  },err=>{
    Swal.fire(
      'ERROR!',
      'Error',
      'error'
    );

    this.Init();
    this.barangay = {};
  });
}



// editBarangay(editBarangay:any={}) {
//   this.editmodal=editBarangay;
// //passing the data from table (modal)
// this.Init();

// }
//for modal
// update(){
//   console.log(this.longRef?.nativeElement.value);
//   this.editmodal.longitude=this.longRef?.nativeElement.value;
//   this.editmodal.latitude = this.latRef?.nativeElement.value;

//   this.service.UpdateOfficial(this.editmodal).subscribe(data =>{
//     Swal.fire({
//       position: 'center',
//       icon: 'success',
//       title: 'Your work has been updated',
//       showConfirmButton: false,
//       timer: 1000
//       });
//   },

//   err=>{
//     console.log(err)
//   })
// this.service.UpdateBarangay(this.editmodal)
// .subscribe({
// next:(_data)=>{
// // this.editModal();
// Swal.fire({
//   position: 'center',
//   icon: 'success',
//   title: 'Your work has been updated',
//   showConfirmButton: false,
//   timer: 1000
//   });
//   this.editmodal ={};
// },
// });

// }

onTableDataChange(page:any){ //paginate
  console.log(page)
  this.p = page;
  this.Init();

}
onTableSizeChange(event:any ){ //paginate
  this.tableSize = event. target.value;
  this.p = 1;
  this.Init();

}

editBarangay(editBarangay:any={}) {
  this.editmodal=editBarangay;
//passing the data from table (modal)
this.Init();

}

// for modal
updateM(){
console.log(this.longRef?.nativeElement.value);
 this.editmodal.longitude=this.longRef?.nativeElement.value;
 this.editmodal.latitude = this.latRef?.nativeElement.value;

this.editmodal.setYear =this.auth.activeSetYear;
this.service.UpdateBarangay(this.editmodal).subscribe({next:(_data)=>{
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
this.Init();
this.editmodal ={};

}




}
