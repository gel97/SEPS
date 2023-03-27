import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProvOfficialService } from 'src/app/shared/Governance/prov-official.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-provincial-officials',
  templateUrl: './provincial-officials.component.html',
  styleUrls: ['./provincial-officials.component.css']
})
export class ProvincialOfficialsComponent implements OnInit {

  constructor(private service:ProvOfficialService, private auth:AuthService) { }

isLoading:boolean = true;

  ProOfficial:any = [];
  Prov: any = {};
  Edit:any ={};
  updateOfficial: any={};
  editModal: any={};
  AddModal:any ={};

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
  this.service.GetProvOfficial().subscribe(data=>{
  this.ProOfficial=(<any>data);
  this.ProOfficial=this.ProOfficial.filter((s:any) => s.tag == 1); // filter by tag
  this.ProOfficial.sort((n1:any,n2:any)=>{ //order by Ascending
    if(n1.seqNo>n2.seqNo)return 1;
    if(n1.seqNo<n2.seqNo)return -1;
    else return 0;
  })
  console.log(this.ProOfficial)
  this.isLoading = false;

 })
}



  addOfficial() {
    this.Prov.munCityId=this.auth.munCityId;
    this.Prov.setYear=this.auth.activeSetYear;
    this.Prov.transId = this.date.transform(Date.now(),'YYMM');
    this.Prov.tag = 1;
    this.service.AddProvOfficial(this.Prov).subscribe(_data=>{
      // alert("success");
      Swal.fire(
        'Good job!',
        'Data Added Successfully!',
        'success'
      );
      this.Init();
      this.Prov = {};

    },_err=>{
      Swal.fire(
        'ERROR!',
        'Error',
        'error'
      );

      this.Init();
      this.Prov = {};
    });
  }


editOfficial(editOfficial:any={}) {
  this.editModal=editOfficial;
//passing the data from table (modal)
this.Init();
}

//for modal
update(){
this.service.UpdateProvOfficial(this.editModal).subscribe({next:(_data)=>{
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
      this.service.UpdateProvOfficial(official2).subscribe(_data =>{
        Swal.fire(
          'Deleted',
          'Removed successfully',
          'success'
        );
        this.Init();
        this.Prov = {};
      })
    } else if (result.dismiss === Swal.DismissReason.cancel){

    }
      this.Init();
      this.Prov = {};
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


}
