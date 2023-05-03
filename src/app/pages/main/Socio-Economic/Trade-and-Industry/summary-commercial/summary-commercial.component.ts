import { SummCommercialService } from './../../../../../shared/Trade&_Industry/summ-commercial.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-summary-commercial',
  templateUrl: './summary-commercial.component.html',
  styleUrls: ['./summary-commercial.component.css']
})
export class SummaryCommercialComponent implements OnInit {


searchText: string= "";

list_of_category = [
  { id: 1, name_category: "Agriculture Related Business" },
  { id: 2, name_category: "Food and Beverages Business" },
  { id: 3, name_category: "Merchandisers/Retailers" },
  { id: 4, name_category: "Transport Related Trading and Services" },
  { id: 5, name_category: "Personal Stores and Services" },
  { id: 6, name_category: "Dress Shop" },
  { id: 7, name_category: "Health and Personal Care Services" },
  { id: 8, name_category: "Charity Foundation" },
  { id: 9, name_category: "Computer/Electronics/Cellphones/Gadgets" },
  { id: 10, name_category: "Recreational Facilities" },
  { id: 11, name_category: "Professional Services" },
  { id: 12, name_category: "Construction Related Trading and Services" },
  { id: 13, name_category: "Print Related Business" },
  { id: 14, name_category: "Utility Services/ Facilities" },
  { id: 15, name_category: "Professional Services - Bookkeeping Services" },
  { id: 16, name_category: "Power Sub Station" },
  { id: 17, name_category: "Services Installation of CCTV Camera" },
  { id: 18, name_category: "Software and Other Electronic Devices" },
  { id: 19, name_category: "Aerial Spraying Services" },

];

list_of_Business = [
  { id: 1, name_business: "Agricultural Equipment and Supplies" , value: 1},
  { id: 1, name_business: "Fishing Services", value: 2},
  { id: 1, name_business: "Poultry/Livestock Farm" , value: 3},
  { id: 1, name_business: "Poultry Supply" , value: 4},
  { id: 2, name_business: "Ricemills" , value: 5},
  { id: 2, name_business: "Seed Dealers" , value: 6},
  { id: 2, name_business: "Slaughter Houses" , value: 7 },
  { id: 2, name_business: "Warehouses" , value: 8},
  { id: 3, name_business: "Garden Plants Retailers" , value: 9},
  { id: 3, name_business: "Banana Growers" , value: 10},
  { id: 3, name_business: "Fish Cages" , value: 11},
  { id: 3, name_business: "Banana Tissue Culture Propagator" , value: 12},
  { id: 4, name_business: "Copra Trader" , value: 13},
  { id: 4, name_business: "Banana Exporter" , value: 14},
  { id: 4, name_business: "Feeds Dealer/Retailer" , value: 15},
  { id: 4, name_business: "Fertilizer Dealer/Retailer" , value: 16},

];

constructor( private service:SummCommercialService, private auth:AuthService) { }
munCityName:string = this.auth.munCityName;

toValidate:any={};
Summary:any=[];
summ:any={};
editmodal:any={};


// Pagination
pageSize = 10;
p: string|number|undefined;
count: number =1;
tableSize:number = 20;
tableSizes:any =[20,40,60,80,100];

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
  this.summ = {};
  this.not_visible = false;
  this.visible = true;
  // this.required = false;
}

date = new DatePipe('en-PH')
ngOnInit(): void {

  this.GetList_Summary_CommercialEstab();
 // this.list_of_barangay();
}


//searchBar
onChangeSearch(e:any) {
this.searchText = e.target.value;

}

GetList_Summary_CommercialEstab(){
this.service.Get_Summ_Estab().subscribe(data=>{
this.Summary=(<any>data);
this.Summary=this.Summary.filter((s:any) => s.tag == 1);
console.log(this.Summary)


})
}


Add_Com_Estab(){
  this.toValidate.category = this.summ.category=="" || this.summ.category ==null?true:false;
  this.toValidate.type = this.summ.type =="" || this.summ.type == undefined?true:false;
  this.toValidate.count = this.summ.count =="" || this.summ.count == undefined?true:false;
  // this.toValidate.remarks = this.summ.remarks =="" || this.summ.remarks == null?true:false;

  if (this.toValidate.category == true||this.toValidate.type ==true || this.toValidate.count == true || this.toValidate.count == true
){
    Swal.fire(
      '',
      'Please fill out the required fields',
      'warning'
    );
  }else{

this.summ.munCityId=this.auth.munCityId;
this.summ.setYear=this.auth.setYear;
this.summ.transId = this.date.transform(Date.now(),'YYMM');
this.summ.tag = 1;
this.service.Add_Summ_Estab(this.summ).subscribe(request=>{
  if (!this.isCheck) {
    this.closebutton.nativeElement.click();
  }
  console.log(request);
  this.clearData();
  this.GetList_Summary_CommercialEstab();

  console.log(request);
  Swal.fire(
    'Good job!',
    'Data Added Successfully!',
    'success'
  );

  this.summ = {};
  this.Summary.push(request);
},err=>{
  Swal.fire(
    'ERROR!',
    'Error',
    'error'
  );
});
}
}

edit_estab(edit_estab:any={}) {
  this.editmodal=edit_estab;
  this.GetList_Summary_CommercialEstab();
  }

//for modal
UpdateSummary_Estab(){
  this.service.Update_Summ_Estab(this.editmodal).subscribe({next:(_data)=>{
    this.GetList_Summary_CommercialEstab();
    this.summ={};

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
        for(let i = 0; i < this.Summary.length;i++){
          if(this.Summary[i].transId == transId){
            this.Summary.splice(i,1);
            Swal.fire(
              'Deleted',
              'Removed successfully',
              'success'
            );
          }
        }


        this.service.Delete_Summ_Estab(transId).subscribe(_data =>{
          this.GetList_Summary_CommercialEstab();
          this.summ={};


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
