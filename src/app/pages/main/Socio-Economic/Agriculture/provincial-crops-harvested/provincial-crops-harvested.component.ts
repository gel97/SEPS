import { AuthService } from 'src/app/services/auth.service';
import { AgricultureProdService } from './../../../../../shared/Socio-Economic/Agriculture/agricultureProd.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-provincial-crops-harvested',
  templateUrl: './provincial-crops-harvested.component.html',
  styleUrls: ['./provincial-crops-harvested.component.css']
})
export class ProvincialCropsHarvestedComponent implements OnInit {

  constructor( private service:AgricultureProdService, private auth:AuthService) { }

  Commodities:any=[];
  commo:any={};
  toValidate:any={};
  isCheck: boolean = false;
  visible: boolean = true;
  add_Crops_Total:boolean = true;
  munCityName:string = this.auth.munCityName;
  setYear = this.auth.activeSetYear;
  munCityId = this.auth.munCityId;
  menuId = "9";

onChange(isCheck: boolean) {
  this.isCheck = isCheck;
  console.log("isCheck:", this.isCheck);
}


    list_of_Commodities =[{ id: 1, name: "Rice - Irrigated" },
                       { id: 2, name: "Rice - Rain Fed" },
                       { id: 3, name: "Corn" },
                       { id: 4, name: "Coconut" },
                       { id: 5, name: "Banana - Cavendish" },
                       { id: 6, name: "Banana - Local	" },
                       { id: 7, name: "Mango" },
                       { id: 8, name: "Durian" },
                       { id: 9, name: "Coffee" },
                       { id: 10, name: "Cacao" },
                       { id: 11, name: "Vegetables & Spices	" },
                       { id: 12, name: "Root Crops" },
                       { id: 13, name: "Others: Rubber, Oil Palm" },];



      ngOnInit(): void {
        this.List_Commodities();
      }

      List_Commodities(){
        this.service.GetListAgricultureProd(this.menuId, this.setYear, this.munCityId).subscribe(data=>{
          console.log("Checked_Data", data)
          this.Commodities=(<any>data);
        })
      }

      Add_Commodities(){
        this.toValidate.commodities = this.commo.commodities == "" || this.commo.commodities == null ? true : false;
        this.toValidate.totalProd = this.commo.totalProd== "" || this.commo.totalProd == undefined ? true : false;
        this.toValidate.area = this.commo.area == "" || this.commo.area == undefined ? true : false;

        if (this.toValidate.commodities  == true || this.toValidate.totalProd == true || this.toValidate.area == true) {
          Swal.fire(
            '',
            'Please fill out the required fields',
            'warning'
          );
        } else {
        this.commo.menuId = this. menuId;
        this.commo.setYear = this.setYear;
        this.commo.munCityId = this.munCityId;
        this.service.AddAgricultureProd(this.commo).subscribe(data=>{
          console.log("checke_data", data);
          Swal.fire(
            'Good job!',
            'Data Added Successfully!',
            'success'
          );
          this.List_Commodities();
          this.commo ={};
          });
      }
    }

    Edit_Commodities(){
        this.service.EditAgricultureProd(this.commo).subscribe({next:(_data)=>{
          this.List_Commodities();

        },
        });

        Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been updated',
        showConfirmButton: false,
        timer: 1000
        });
        this.commo={};
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
            for(let i = 0; i < this.Commodities.length;i++){
              if(this.Commodities[i].transId == transId){
                this.Commodities.splice(i,1);
                Swal.fire(
                  'Deleted',
                  'Removed successfully',
                  'success'
                );
              }
            }

            this.service.DeleteAgricultureProd(transId).subscribe(_data =>{


            })
          } else if (result.dismiss === Swal.DismissReason.cancel){

          }

        })
      }


    }



