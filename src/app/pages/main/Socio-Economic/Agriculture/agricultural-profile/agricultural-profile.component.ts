import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AgricultureProfileService } from 'src/app/shared/Socio-Economic/Agriculture/agriculturalProfile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agricultural-profile',
  templateUrl: './agricultural-profile.component.html',
  styleUrls: ['./agricultural-profile.component.css']
})
export class AgriculturalProfileComponent implements OnInit {

  constructor(private Auth: AuthService, private Service: AgricultureProfileService) { }


  dummyData: any = {};
  listData: any = [];
  addData: any = {};
  dummy_addData: any = {};
  editData: any = {};
  updateData: any = {};
  deleteData: any = {};
  visible: boolean = true;
  not_visible: boolean = true;
  //button_edit: boolean = true;


  ngOnInit(): void {
    this.GetListAgricultureProfile();
  }

  close() {

  }

  AddAgricultureProfile() {
    try {
      console.log("dummyData", this.dummyData);
      console.log("dummy_add_object", this.dummy_addData);
      console.log("add_object", this.addData);
      if (JSON.stringify(this.dummy_addData) != JSON.stringify(this.dummyData)) {
        // this.addData.isEdit = true;
        this.addData.setYear = this.Auth.activeSetYear;
        this.addData.munCityId = this.Auth.munCityId;
        console.log("add_object", this.addData);
        this.Service.AddAgricultureProfile(this.addData).subscribe(request => {
          console.log(request);
          this.addData = request;
          this.visible = false;
          this.not_visible = true;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1000
          }
          );
        }
        )
      }
      else {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Data already exist!',
          showConfirmButton: false,
          timer: 1000
        }
        );
      }
    }
    catch (e) { }
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Data already exist!/Missing data!',
      showConfirmButton: false,
      timer: 1000
    }
    );
  }

  EditAgricultureProfile() {
    console.log("trap", this.addData);
    if (this.addData != this.dummyData) {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.addData.setYear = this.Auth.activeSetYear;
          this.addData.munCityId = this.Auth.munCityId;
          console.log("update_object", this.addData);
          this.Service.EditAgricultureProfile(this.addData).subscribe(request => {
            console.log(request);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Your work has been updated',
              showConfirmButton: false,
              timer: 1000
            }
            );
          }
          )
          Swal.fire('Saved!', '', 'success')
        } else if (result.isDenied) {
          this.GetListAgricultureProfile();
          Swal.fire('Changes are not saved', '', 'info')
        }
      })
    }

    // Swal.fire({
    //   position: 'center',
    //   icon: 'warning',
    //   title: 'No data available!',
    //   showConfirmButton: false,
    //   timer: 1000
    // }
    // );
  }

  GetListAgricultureProfile() {
    this.Service.GetListAgricultureProfile(this.Auth.activeSetYear, this.Auth.munCityId).subscribe(response => {
      // this.listData=(<any>response);
      if (response.length > 0) {
        this.addData = response[0];
        this.visible = false;
        this.not_visible = true;
        //this.button_edit= true;
        // this.addData.any((element: { [x: string]: boolean; }) => {
        //   element[`isEdit`] = false;
        // });
      }
      else {
        this.visible = true;
        this.not_visible = false;
        //this.button_edit= false;
      }
      console.log("array", response);

    })
  }


  DeleteAgricultureProfile() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.Service.DeleteAgricultureProfile(this.addData.transId).subscribe(response => {
          console.log("delete", response);
          this.addData = {};
          this.dummy_addData = {};
          this.visible = true;
          this.not_visible = false;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been deleted',
            showConfirmButton: false,
            timer: 1000
          }
          );
          console.log("deleted data", response);
          console.log("data_deleted", this.addData);

          this.addData = {};
        }
        )
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

}