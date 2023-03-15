import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ManEstabService } from 'src/app/shared/Trade&_Industry/man-estab.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manufacturing-establishments',
  templateUrl: './manufacturing-establishments.component.html',
  styleUrls: ['./manufacturing-establishments.component.css']
})
export class ManufacturingEstablishmentsComponent implements OnInit {
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

  constructor( private service:ManEstabService, private auth:AuthService) { }
  ManEstab:any=[];
  barangays:any=[];
  estab:any={};
  editmodal:any={};
  Updatelocation:any={};

  // Pagination
  // pageSize = 25;
  // p: string|number|undefined;
  // count: number =0;
  // tableSize:number = 5;
  // tableSizes:any =[5,10,15,25,50,100];

  date = new DatePipe('en-PH')
  ngOnInit(): void {

    this.GetListManEstab();
    this.list_of_barangay();
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
    console.log(this.barangays);
  });
  this.estab = {};

}




AddEstablishment(){
  this.estab.munCityId=this.auth.munCityId;
  this.estab.setYear=this.auth.setYear;
  this.estab.transId = this.date.transform(Date.now(),'YYMM');
  this.estab.tag = 1;
  this.service.AddManEstab(this.estab).subscribe(request=>{
    console.log(request);
    Swal.fire(
      'Good job!',
      'Data Added Successfully!',
      'success'
    );

    this.estab = {};
    this.ManEstab.push(request);
  },err=>{
    Swal.fire(
      'ERROR!',
      'Error',
      'error'
    );
  });
}

  edit_estab(edit_estab:any={}) {
    this.editmodal=edit_estab;
    this.GetListManEstab();
    }

  //for modal
  UpdateManEstab(){
    console.log(this.longRef?.nativeElement.value);
    console.log(this.latRef?.nativeElement.value);

     this.editmodal.longtitude=this.longRef?.nativeElement.value;
     this.editmodal.latitude= this.latRef?.nativeElement.value;

    this.service.UpdateManEstab(this.editmodal).subscribe({next:(_data)=>{
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
            }
          }


          this.service.DeleteManEstab(transId).subscribe(_data =>{
            Swal.fire(
              'Deleted',
              'Removed successfully',
              'success'
            );
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

    // onTableDataChange(page:any){ //paginate
    //   console.log(page)
    //   this.p = page;
    //   this.GetListManEstab();

    // }
    // onTableSizeChange(event:any ){ //paginate
    //   this.tableSize = event. target.value;
    //   this.p = 1;
    //   this.GetListManEstab();

    // }

}
