import { Component, OnInit } from '@angular/core';
import { CityOfficialService } from 'src/app/shared/city-official.service'; // import service
import  {DatePipe} from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import Swal from 'sweetalert2';
import { take,of } from 'rxjs';

@Component({
  selector: 'app-city-officials',
  templateUrl: './city-officials.component.html',
  styleUrls: ['./city-officials.component.css']
})
export class CityOfficialsComponent implements OnInit {
p: string|number|undefined;

  constructor(private service:CityOfficialService) { } // private service: + name of service that you've created
  Official:any = [];
  city: any = {};
  city2:any = {};
  Edit:any ={};
  updateOfficial: any={};
  editModal: any={};
  AddModal:any ={};



  date = new DatePipe('en-PH')
  ngOnInit(): void {
  this.Init(
      );

 }

  Init(){
      this.service. GetOfficial().subscribe(data=>{
      //  alert("ASDASD")
      this.Official=(<any>data);
      this.Official=this.Official.filter((s:any) => s.tag == 1); // filter by tag
      this.Official.sort((n1:any,n2:any)=>{ //order by Ascending
        if(n1.seqNo>n2.seqNo)return 1;
        if(n1.seqNo<n2.seqNo)return -1;
        else return 0;
      })
      console.log(this.Official)

     })
    //alert(localStorage.getItem('token'));
  }

  addOfficial() {
    this.city.transId = this.date.transform(Date.now(),'YYMM');
    this.city.tag = 1;
    this.service.AddOfficial(this.city).subscribe(_data=>{
      // alert("success");
      Swal.fire(
        'Good job!',
        'Data Added Successfully!',
        'success'
      );
      this.Init();
      this.city = {};

    },_err=>{
      Swal.fire(
        'ERROR!',
        'Error',
        'error'
      );

      this.Init();
      this.city = {};
    });
  }

  // editOfficial(editOfficial:any={}) {
  //   this.city2.seqNo = this.Official[editOfficial].seqNo;
  //   this.city2.Term = this.Official[editOfficial].Term;
  //   this.city2.name = this.Official[editOfficial].name;
  //   this.city2.position = this.Official[editOfficial].position;
  //   this.city2.contact = this.Official[editOfficial].contact;
  //   this.Edit = editOfficial;
  // }


// update(){
//   // this.city.tag=1;
//   // console.log(this.city)
//   let data={contact:"",term:"",seqNo:"",name:"",position:"",tag:"",transId:"" };

//  data.transId = this.city.transId;
//  data.name =this.city.name;
//  data.position =this.city.position;
//  data.contact =this.city.contact;
//  data.seqNo =this.city.seqNo;
//  data.term =this.city.term;
//  data.tag =this.city.tag;
//   // console.log(data)

//   // this.updateOfficial.tag =this.city.tag;

//   this.service.UpdateOfficial(data).subscribe(data =>{
//     this.Init();
//     this.city = {};
//   },err =>{
//     alert("erroreed")
//   }
// )
// }


editOfficial(editOfficial:any={}) {
  this.editModal=editOfficial;
//passing the data from table (modal)
this.Init();

}
//for modal
update(){
this.service.UpdateOfficial(this.editModal)
.subscribe({
next:(_data)=>{
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
this.editModal ={};

}


// deleteOfficial(data:any={}) {
//   // this.city.munCityId = this.date.transform(Date.now(),'YYMM');
//   data.tag = -1;
//   this.service.UpdateOfficial(data)
//   .subscribe(data =>{
//     alert("inside")
//   },err =>{
//     console.log(err.error.text)
//     this.Init();
//     this.city = {};
//   }
// )
// }

delete(official2:any={}){
  Swal.fire({

    text: 'Do you want to remove this file?',
    icon: 'warning',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: 'Yes, remove it!'
  }).then((result)=>{
    if(result.value){
      official2.tag= -1;
      this.service.UpdateOfficial(official2).subscribe(_data =>{
        Swal.fire(
          'Deleted',
          'Removed successfully',
          'success'
        );
        this.Init();
        //this.city = {};
      })
    } else if (result.dismiss === Swal.DismissReason.cancel){

    }
      this.Init();
     // this.city = {};
  })
}



}
