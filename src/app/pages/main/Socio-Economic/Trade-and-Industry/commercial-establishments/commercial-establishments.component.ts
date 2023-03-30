import { CommercialEstablishmentService } from './../../../../../shared/Trade&_Industry/commercial-establishment.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-commercial-establishments',
  templateUrl: './commercial-establishments.component.html',
  styleUrls: ['./commercial-establishments.component.css']
})
export class CommercialEstablishmentsComponent implements OnInit {
@ViewChild ('long',{static:false}) longRef : ElementRef | undefined;
@ViewChild ('lat',{static:false}) latRef : ElementRef | undefined;

searchText: string= "";

list_of_category = [
  { id: 1, name_category: "Agricultural products" },
  { id: 2, name_category: "Crafts/ Furnitures" },
];

list_of_Business = [
  { id: 1, name_business: "Agricultural equipments and supplies" },
  { id: 2, name_business: "Woodcrafts/ Wooden Furniture" },
  { id: 3, name_business: "Casket/coffin making" },
  { id: 4, name_business: "Handicrafts/ Shellcraft" },
];

constructor( private service:CommercialEstablishmentService, private auth:AuthService) { }
toValidate:any={};
ComEstab:any=[];
barangays:any=[];
comm:any={};
dummy_comm:any={};
dummy_comm2:any={};

editmodal:any={};

//Updatelocation:any={};

// Pagination
pageSize2 = 10;
p2: string|number|undefined;
count2: number =0;
tableSize2:number = 5;
tableSizes2:any =[5,15,25,50,100];

date = new DatePipe('en-PH')
ngOnInit(): void {

  this.GetListCommercialEstab();
 this.list_of_barangay();
}


//searchBar
onChangeSearch(e:any) {
this.searchText = e.target.value;

}

GetListCommercialEstab(){
this.service.Get_Com_Estab().subscribe(data=>{
this.ComEstab=(<any>data);
this.ComEstab=this.ComEstab.filter((s:any) => s.tag == 1);
console.log(this.ComEstab)
})
}

list_of_barangay(){
this.service.ListBarangay().subscribe(data=>{
  this.barangays = <any>data;
  console.log("fgxtxgcvcgcf",this.barangays)
});
}
Add_Com_Estab(){
  this.toValidate.brgyId = this.comm.brgyId=="" || this.comm.brgyId ==null?true:false;
  this.toValidate.permitNo = this.comm.permitNo =="" || this.comm.permitNo == undefined?true:false;
  this.toValidate.estabName = this.comm.estabName =="" || this.comm.estabName == undefined?true:false;
  this.toValidate.category = this.comm.category =="" || this.comm.category == undefined?true:false;
  // this.toValidate.status = this.comm.status =="" || this.comm.status == undefined?true:false;



  if (this.toValidate.brgyId == true||this.toValidate.permitNo ==true || this.toValidate.estab == true || this.toValidate.category == true
    ||this.toValidate.status== true){
    Swal.fire(
      '',
      'Required Fields',
      'error'
    );
  }else{

  this.comm.munCityId=this.auth.munCityId;
  this.comm.setYear=this.auth.setYear;
  this.comm.transId = this.date.transform(Date.now(),'YYMM');
  //this.comm.tag = 1;
  this.service. Add_Com_Estab(this.comm).subscribe(request=>{
    console.log(request);
    Swal.fire(
      'Good job!',
      'Data Added Successfully!',
      'success'
    );

   this.comm = {};
    this.ComEstab.push(request);
  },);
}
}






edit_estab(edit_estab:any={}) {
  this.editmodal=edit_estab;
  this.GetListCommercialEstab();
  }

//for modal
UpdateCommercial(){
  console.log(this.longRef?.nativeElement.value);
  console.log(this.latRef?.nativeElement.value);

   this.editmodal.longtitude=this.longRef?.nativeElement.value;
   this.editmodal.latitude= this.latRef?.nativeElement.value;

  this.service.Update_Com_Estab(this.editmodal).subscribe({next:(_data)=>{
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


delete(transId:any, index:any){
    Swal.fire({
      text: 'Do you want to remove this file?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!'
    }).then((result)=>{

      if(result.value){
        for(let i = 0; i < this.ComEstab.length;i++){
          if(this.ComEstab[i].transId == transId){
            this.ComEstab.splice(i,1);
            Swal.fire(
              'Deleted',
              'Removed successfully',
              'success'
            );
          }
        }

        this.service.Delete_Com_Estab(transId).subscribe(_data =>{

         // this.MajorAct.splice(index,1);

          // this.Init();
          // this.mjr = {};

        })
      } else if (result.dismiss === Swal.DismissReason.cancel){

      }
        // this.Init();
        // this.mjr = {};

    })
  }

  onTableDataChange2(page:any){ //paginate
    console.log(page)
    this.p2 = page;

  }
  onTableSizeChange2(event:any ){ //paginate
    this.tableSize2 = event. target.value;
    this.p2= 1;

  }


}
