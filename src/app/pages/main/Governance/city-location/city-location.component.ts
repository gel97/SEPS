import { MunCityLocService } from './../../../../shared/Governance/mun-city-loc.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-city-location',
  templateUrl: './city-location.component.html',
  styleUrls: ['./city-location.component.css']
})
export class CityLocationComponent implements OnInit {
@ViewChild ('long',{static:false}) longRef : ElementRef | undefined;
@ViewChild ('lat',{static:false}) latRef : ElementRef | undefined;

constructor(private service:MunCityLocService, private auth:AuthService) { }
MunLoc:any =[];

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

}

Init(){
 this.service.GetMunCity().subscribe(data=>{
  this.MunLoc=(<any>data);
  console.log(this.MunLoc)

 })
}


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

// editBarangay(editBarangay:any={}) {
// this.editmodal=editBarangay;
// //passing the data from table (modal)
// this.Init();

// }

// for modal
updateM(){
console.log(this.longRef?.nativeElement.value);
console.log(this.latRef?.nativeElement.value);

 this.editmodal.longtitude=this.longRef?.nativeElement.value;
 this.editmodal.latitude= this.latRef?.nativeElement.value;
 this.service.UpdateMunCity(this.editmodal).subscribe({next:(_data)=>{
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
