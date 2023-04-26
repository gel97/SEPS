import { Component, OnInit, ViewChild } from '@angular/core';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { ServicesFacilitiesService } from 'src/app/shared/Infrastructure/Utilities/services-facilities.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-waste-management',
  templateUrl: './waste-management.component.html',
  styleUrls: ['./waste-management.component.css']
})
export class WasteManagementComponent implements OnInit {

  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  constructor(private service:ServicesFacilitiesService, private auth:AuthService) { }
  add_service:boolean = true;

  menuId:string = "6";
  munCityName:string = this.auth.munCityName;
  setYear = this.auth.activeSetYear;
  munCityId = this.auth.munCityId;
  toValidate:any={};
  isCheck: boolean = false;
  visible: boolean = true;
  waste:any={};
  barangays:any={};
  Facilities:any=[];

    ngOnInit(): void {
      this.  List_waste();
      this.  list_of_barangay();
    }

    onChange(isCheck: boolean) {
      this.isCheck = isCheck;
      console.log("isCheck:", this.isCheck);
    }
    list_of_barangay(){
      this.service.ListBarangay().subscribe(data=>{
        this.barangays = <any>data;
        console.log("fgxtxgcvcgcf",this.barangays)
      });
      }

      markerObj: any = {};
      SetMarker(data: any = {}) {
        console.log(data);
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


    List_waste(){
      this.service.List_Facilities(this.menuId, this.setYear, this.munCityId).subscribe(data=>{
        console.log("Checked_Data", data)
        this.Facilities=(<any>data);
      })
    }

    Add_waste(){
      this.toValidate.name = this.waste.name == "" || this.waste.name== undefined ? true : false;
      this.toValidate.serviceArea= this.waste.serviceArea== "" || this.waste.serviceArea == undefined ? true : false;
      this.toValidate.brgyId = this.waste.brgyId == "" || this.waste.brgyId == null? true : false;

      if (this.toValidate.name  == true || this.toValidate.serviceArea == true || this.toValidate.brgyId == true) {
        Swal.fire(
          '',
          'Please fill out the required fields',
          'warning'
        );
      } else {
      this.waste.menuId = this. menuId;
      this.waste.setYear = this.setYear;
      this.waste.munCityId = this.munCityId;
      this.service.Add_Facilities(this.waste).subscribe(data=>{
        console.log("checke_data", data);
        Swal.fire(
          'Good job!',
          'Data Added Successfully!',
          'success'
        );
        this.List_waste();
        this.waste = {};
        });
    }
  }

  Update_waste(){
    this.waste.longtitude = this.gmapComponent.markers.lng;
    this.waste.latitude = this.gmapComponent.markers.lat;
      this.service. Update_Facilities(this.waste).subscribe({next:(_data)=>{
        this.List_waste();

      },
      });

      Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Your work has been updated',
      showConfirmButton: false,
      timer: 1000
      });
      this.waste = {};
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
          for(let i = 0; i < this.Facilities.length;i++){
            if(this.Facilities[i].transId == transId){
              this.Facilities.splice(i,1);
              Swal.fire(
                'Deleted',
                'Removed successfully',
                'success'
              );
            }
          }

          this.service.Delete_Facilities(transId).subscribe(_data =>{


          })
        } else if (result.dismiss === Swal.DismissReason.cancel){

        }

      })
    }


  }



