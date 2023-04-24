import { CommercialEstablishmentService } from './../../../../../shared/Trade&_Industry/commercial-establishment.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';

@Component({
  selector: 'app-commercial-establishments',
  templateUrl: './commercial-establishments.component.html',
  styleUrls: ['./commercial-establishments.component.css']
})
export class CommercialEstablishmentsComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;


searchText: string= "";

list_of_category = [
  { id: 1, name_category: "Merchandisers/ Retailers" },
  { id: 2, name_category: "Computer/ Electronics/ Cellphones/ Gadgets" },
  { id: 3, name_category: "Utility Services / Facilities" },
  { id: 4, name_category: "Construction related trading and services" },
  { id: 5, name_category: "Food and Beverages Business" },
  { id: 6, name_category: "Transport-related Trading and Services" },
  { id: 7, name_category: "Personal Stores and Services" },
  { id: 8, name_category: "	Agriculture related business" },
];

list_of_Business = [
  { id: 1, name_business: "General Merchandising" },
  { id: 2, name_business: "	Sari-sari stores" },
  { id: 3, name_business: "Drugstores/ Pharmacy" },
  { id: 4, name_business: "Internet shops/ On-line gaming" },
];

list_of_status = [
  { id: 1, status: "New" },
  { id: 2, status: "Renew" },
];


constructor( private service:CommercialEstablishmentService, private auth:AuthService) { }
munCityName:string = this.auth.munCityName;


toValidate:any={};
ComEstab:any=[];
barangays:any=[];
comm:any={};
// dummy_comm:any={};
// dummy_comm2:any={};

editmodal:any={};

//Updatelocation:any={};

// Pagination
pageSize = 10;
p: string|number|undefined;
count: number =0;
tableSize:number = 5;
tableSizes:any =[5,15,25,50,100];

date = new DatePipe('en-PH')
ngOnInit(): void {

  this.GetListCommercialEstab();
 this.list_of_barangay();
}

markerObj: any = {};

SetMarker(data: any = {}) {
  console.log("lnglat: ", data.longtitude+ " , " + data.latitude)

  this.markerObj = {
    lat: data.latitude,
    lng: data.longtitude,
    label: data.brgyName.charAt(0),
    brgyName: data.brgyName,
    munCityName: this.munCityName,
    draggable: true
  };
  this.gmapComponent.setMarker(this.markerObj);
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
      'Please fill out the required fields',
      'warning'
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
  this.editmodal.longtitude = this.gmapComponent.markers.lng;
  this.editmodal.latitude = this.gmapComponent.markers.lat;

  this.service.Update_Com_Estab(this.editmodal).subscribe({next:(_data)=>{
    this.GetListCommercialEstab();

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
              'Deleted!',
              'Your file has been removed.',
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

  onTableDataChange(page:any){ //paginate
    console.log(page)
    this.p = page;

  }
  onTableSizeChange(event:any ){ //paginate
    this.tableSize = event. target.value;
    this.p= 1;

  }


}
