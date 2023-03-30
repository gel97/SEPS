import { FinancialInstitutionsService } from './../../../../../shared/Trade&_Industry/financial-institutions.service';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-financial-institutions',
  templateUrl: './financial-institutions.component.html',
  styleUrls: ['./financial-institutions.component.css']
})
export class FinancialInstitutionsComponent implements OnInit {

  // @ViewChild ('long',{static:false}) longRef : ElementRef | undefined;
  // @ViewChild ('lat',{static:false}) latRef : ElementRef | undefined;

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

  constructor( private service:FinancialInstitutionsService, private auth:AuthService) { }
  toValidate:any={};
  Financial:any=[];
  barangays:any=[];
  financial:any={};
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

  this.GetListFinancial()
  this.list_of_barangay();
  }


  //searchBar
  onChangeSearch(e:any) {
  this.searchText = e.target.value;

  }

  GetListFinancial(){
  this.service.GetFinancial().subscribe(data=>{
  this.Financial=(<any>data);
  this.Financial=this.Financial.filter((s:any) => s.tag == 1);
  console.log(this.Financial)
  })
  }

  list_of_barangay(){
  this.service.ListBarangay().subscribe(data=>{
    this.barangays = <any>data;
    console.log("fgxtxgcvcgcf",this.barangays)
  });
  }


  Add_Financial(){
    // this.toValidate.category = this.summ.category=="" || this.summ.category ==null?true:false;
    // this.toValidate.type = this.summ.type =="" || this.summ.type == undefined?true:false;
    // this.toValidate.count = this.summ.count =="" || this.summ.count == undefined?true:false;
    // this.toValidate.remarks = this.summ.remarks =="" || this.summ.remarks == null?true:false;

    if (this.toValidate.category == true||this.toValidate.type ==true || this.toValidate.count == true || this.toValidate.count == true
  ){
      Swal.fire(
        '',
        'Required Fields',
        'error'
      );
    }else{


    this.financial.munCityId=this.auth.munCityId;
    this.financial.setYear=this.auth.setYear;
    this.financial.transId = this.date.transform(Date.now(),'YYMM');
    //this.comm.tag = 1;
    this.service.Add_Financial_Ins(this.financial).subscribe(request=>{
      console.log(request);
      Swal.fire(
        'Good job!',
        'Data Added Successfully!',
        'success'
      );

     this.financial = {};
      this.Financial.push(request);
    },err=>{

      Swal.fire(
        'ERROR!',
        'Error',
        'error'
      );
    });
  }
  }





  edit_fin(edit_fin:any={}) {
    this.editmodal=edit_fin;
    this.GetListFinancial();
    }

  //for modal
  UpdateFinancial(){
    // console.log(this.longRef?.nativeElement.value);
    // console.log(this.latRef?.nativeElement.value);

    //  this.editmodal.longtitude=this.longRef?.nativeElement.value;
    //  this.editmodal.latitude= this.latRef?.nativeElement.value;

    this.service.Update_Financial_Ins(this.editmodal).subscribe({next:(_data)=>{
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


  deleteFinancial(transId:any, index:any){
      Swal.fire({
        text: 'Do you want to remove this file?',
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it!'
      }).then((result)=>{

        if(result.value){
          for(let i = 0; i < this.Financial.length;i++){
            if(this.Financial[i].transId == transId){
              this.Financial.splice(i,1);
              Swal.fire(
                'Deleted',
                'Removed successfully',
                'success'
              );
            }
          }

          this.service.Delete_Financial_Ins(transId).subscribe(_data =>{

           // this.Financial.splice(index,1);

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
