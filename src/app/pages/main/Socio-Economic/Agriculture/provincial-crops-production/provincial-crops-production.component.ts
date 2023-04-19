import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
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

list_of_CropType =[{ id: 1, name: "Sample1" },
{ id: 2, name: "sample2" },];

add_Crops:boolean = true;


munCityName:string = this.auth.munCityName;
setYear = this.auth.activeSetYear;
munCityId = this.auth.munCityId;
menuId = "8";


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
    this.crop.menuId = this. menuId;
    this.crop.setYear = this.setYear;
    this.crop.munCityId = this.munCityId;
    this.service.AddAgricultureProd(this.crop).subscribe(data=>{
      console.log("checke_data", data);
      Swal.fire(
        'Good job!',
        'Data Added Successfully!',
        'success'
      );
      this.List_Crops();
      });
  }

Edit_Crops(){
    this.service.EditAgricultureProd(this.crop).subscribe({next:(_data)=>{
      this.List_Crops();

    },
    });

    Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Your work has been updated',
    showConfirmButton: false,
    timer: 1000
    });
    this.crop();
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


        })
      } else if (result.dismiss === Swal.DismissReason.cancel){

      }

    })
  }


}



