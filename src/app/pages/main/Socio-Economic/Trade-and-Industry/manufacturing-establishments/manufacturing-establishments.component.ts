import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ManEstabService } from 'src/app/shared/Trade&_Industry/man-estab.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';


@Component({
  selector: 'app-manufacturing-establishments',
  templateUrl: './manufacturing-establishments.component.html',
  styleUrls: ['./manufacturing-establishments.component.css']
})
export class ManufacturingEstablishmentsComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  searchText: string= "";

  list_of_category = [
    { id: 1, name_category: "Food processing" },
    { id: 2, name_category: "Agricultural products" },
    { id: 3, name_category: "Garments and embroidery" },
    { id: 4, name_category: "Crafts/ Furnitures" },
    { id: 5, name_category: "Ceramics/ Paper/ Plastic" },
    { id: 6, name_category: "Chemical and pharmaceutical" },
    { id: 7, name_category: "Jewelry" },
    { id: 8, name_category: "Other non-metallic products" },
  ];

  list_of_Business = [
    { id: 1, name_business: "" },
    { id: 2, name_business: "" },
    { id: 3, name_business: "" },
    { id: 4, name_business: "" },
  ];


  constructor( private service:ManEstabService, private auth:AuthService) { }
  munCityName:string = this.auth.munCityName;

  toValidate:any={};
  ManEstab:any=[];
  barangays:any=[];
  estab:any={};
  editmodal:any={};
  Updatelocation:any={};

  // Pagination
  pageSize2 = 10;
  p2: string|number|undefined;
  count2: number =1;
  tableSize2:number = 20;
  tableSizes2:any =[20,40,60,80,100];

  isCheck: boolean = false;
  visible: boolean = true;
  not_visible: boolean = true;

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void; }; };

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log("isCheck:", this.isCheck);
  }

  clearData() {
    this.estab = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }

  date = new DatePipe('en-PH')
  ngOnInit(): void {

    this.GetListManEstab();
    this.list_of_barangay();
 }
 markerObj: any = {};

 SetMarker(data: any = {}) {
   console.log("lnglat: ", data.longtitude + " , " + data.latitude)

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

 GetListManEstab(){
  this.service.GetManEstab().subscribe(data=>{
  this.ManEstab=(<any>data);
  this.ManEstab=this.ManEstab.filter((s:any) => s.tag == 1);
  console.log(this.ManEstab)


 })
}


list_of_barangay(){
  this.service.ListBarangay().subscribe(data=>{
    this.barangays = <any>data;
    console.log("fgxtxgcvcgcf",this.barangays)
  });
}




AddEstablishment(){
  this.toValidate.name = this.estab.name =="" || this.estab.name ==undefined?true:false;
  this.toValidate.category = this.estab.category == "" || this.estab.category == null?true:false
  this.toValidate.brgyId = this.estab.brgyId == "" || this.estab.brgyId == null?true:false
  this.toValidate.type = this.estab.type == "" || this.estab.type == null?true:false
  this.toValidate.workersNo =this.estab.workersNo == "" || this.estab.workersNo == undefined?true:false

  if( this.toValidate.name == true||this.toValidate.category ==true || this.toValidate.type == true|| this.toValidate.workersNo == true){
    Swal.fire(
      '',
        'Please fill out the required fields',
        'warning'
    );
  }else{
    this.estab.munCityId=this.auth.munCityId;
    this.estab.setYear=this.auth.setYear;
    this.estab.transId = this.date.transform(Date.now(),'YYMM');
    this.estab.tag = 1;
    this.service.AddManEstab(this.estab).subscribe(request=>{
      if (!this.isCheck) {
        this.closebutton.nativeElement.click();
      }
      console.log(request);
      this.clearData();
      this.GetListManEstab();

      console.log(request);
      Swal.fire(
        'Good job!',
        'Data Added Successfully!',
        'success'
      );
     // document.getElementById('close')?.click();
      this.estab = {};
      this.ManEstab.push(request);
    });

  }


}


edit_estab(edit_estab:any={}) {
    this.editmodal=edit_estab;
    this.GetListManEstab();
    }

  //for modal
  UpdateManEstab(){
    this.editmodal.longtitude = this.gmapComponent.markers.lng;
    this.editmodal.latitude = this.gmapComponent.markers.lat;
    //this.editmodal.setYear = this.auth.activeSetYear;
    this.service.UpdateManEstab(this.editmodal).subscribe({next:(_data)=>{
      this.GetListManEstab();

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
          for(let i = 0; i < this.ManEstab.length;i++){
            if(this.ManEstab[i].transId == transId){
              this.ManEstab.splice(i,1);
              Swal.fire(
                'Deleted',
                'Removed successfully',
                'success'
              );
            }
          }

          this.service.DeleteManEstab(transId).subscribe(_data =>{
            this.GetListManEstab();



          })
        } else if (result.dismiss === Swal.DismissReason.cancel){

        }

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
