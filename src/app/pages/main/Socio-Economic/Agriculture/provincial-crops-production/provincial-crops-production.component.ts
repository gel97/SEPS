import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AgricultureProdService } from 'src/app/shared/Socio-Economic/Agriculture/agricultureProd.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-provincial-crops-production',
  templateUrl: './provincial-crops-production.component.html',
  styleUrls: ['./provincial-crops-production.component.css']
})
export class ProvincialCropsProductionComponent implements OnInit {

  constructor(private service:AgricultureProdService, private auth:AuthService) { }
Crops:any=[];
crop:any={};
listofCrop:any = [{id: 1, name: "Rice - Irrigated"},    {id: 2, name: "Rice - Rainfed"},          {id: 3, name: "Corn - White"},
{id: 4, name: "Corn - Yellow"},       {id: 5, name: "Banana - Bungulan"},       {id: 6, name: "Banana - Cavendish"},
{id: 7, name: "Banana - Lakatan"},    {id: 8, name: "Banana - Latundan"},       {id: 9, name: "Banana - Saba/Cardaba"},
{id: 10, name: "Coconut"},            {id: 11, name: "Mango"},                  {id: 12, name: "Durian"},
{id: 13, name: "Papaya"},             {id: 14, name: "Coffee"},                 {id: 15, name: "Cacao"},
{id: 16, name: "Mongo"},              {id: 17, name: "Eggplant"},               {id: 18, name: "Tomato"},
{id: 19, name: "Pechay"},             {id: 20, name: "String beans"},           {id: 21, name: "Gabi"},
{id: 22, name: "Ampalaya"},           {id: 23, name: "Onion leeks"},            {id: 24, name: "Ube"},
{id: 25, name: "Chayote"},            {id: 26, name: "Patola"},                 {id: 27, name: "Pomelo"},
{id: 28, name: "Gourd"},              {id: 29, name: "Raddish"},                {id: 30, name: "Rubber"},
{id: 31, name: "Okra"},               {id: 32, name: "Cucumber"},               {id: 33, name: "Abaca"},
{id: 34, name: "Squash fruit"},       {id: 35, name: "Camote"},                 {id: 36, name: "Falcata"},
{id: 37, name: "Ginger"},             {id: 38, name: "Cassava"},                {id: 39, name: "Lanzones"},
{id: 40, name: "Pepper"},             {id: 41, name: "Other Vgetables"},];

// list_of_CropType =[{ id: 1, name: "Sample1" },
// { id: 2, name: "sample2" },];

add_Crops:boolean = true;


munCityName:string = this.auth.munCityName;
setYear = this.auth.activeSetYear;
munCityId = this.auth.munCityId;
menuId = "8";
toValidate:any={};

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
  this.crop = {};
  this.not_visible = false;
  this.visible = true;
  // this.required = false;
}



  ngOnInit(): void {
    this.List_Crops();
  }

  List_Crops(){
    this.service.GetListAgricultureProd(this.menuId, this.setYear, this.munCityId).subscribe(data=>{
      console.log("Checked_Data", data)
      this.Crops=(<any>data);
    })
  }

  Add_Crops(){
    this.toValidate.type = this.crop.type == "" || this.crop.type == null ? true : false;
    this.toValidate.totalProd = this.crop.totalProd== "" || this.crop.totalProd == undefined ? true : false;
    this.toValidate.area = this.crop.area == "" || this.crop.area == undefined ? true : false;

    if (this.toValidate.type  == true || this.toValidate.totalProd == true || this.toValidate.area == true) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
    this.crop.menuId = this. menuId;
    this.crop.setYear = this.setYear;
    this.crop.munCityId = this.munCityId;
    this.service.AddAgricultureProd(this.crop).subscribe(data=>{
      if (!this.isCheck) {
        this.closebutton.nativeElement.click();
      }
      console.log(data);
      this.clearData();
      this.List_Crops();


      Swal.fire(
        'Good job!',
        'Data Added Successfully!',
        'success'
      );
      this.List_Crops();
      this.crop = {};
      });
  }
}

Edit_Crops(){
  this.toValidate.type = this.crop.type == "" || this.crop.type == null ? true : false;
  this.toValidate.totalProd = this.crop.totalProd== "" || this.crop.totalProd == undefined ? true : false;
  this.toValidate.area = this.crop.area == "" || this.crop.area == undefined ? true : false;

  if (this.toValidate.type  == true || this.toValidate.totalProd == true || this.toValidate.area == true) {
    Swal.fire(
      'Missing Data!',
      'Please fill out the required fields',
      'warning'
    );
  } else {
    this.service.EditAgricultureProd(this.crop).subscribe({next:(_data)=>{
      this.List_Crops();
      this.clearData();

    },
    });

    Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Your work has been updated',
    showConfirmButton: false,
    timer: 1000
    });
    this.crop = {};
  }
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
        for(let i = 0; i < this.Crops.length;i++){
          if(this.Crops[i].transId == transId){
            this.Crops.splice(i,1);
            Swal.fire(
              'Deleted',
              'Removed successfully',
              'success'
            );
          }
        }

        this.service.DeleteAgricultureProd(transId).subscribe(_data =>{
         this.List_Crops();
         this.crop = {};


        })
      } else if (result.dismiss === Swal.DismissReason.cancel){

      }

    })
  }


}



