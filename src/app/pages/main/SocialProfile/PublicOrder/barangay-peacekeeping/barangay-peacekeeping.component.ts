import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SafetyTanodService } from 'src/app/shared/SocialProfile/PublicOrder/safety-tanod.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';

@Component({
  selector: 'app-barangay-peacekeeping',
  templateUrl: './barangay-peacekeeping.component.html',
  styleUrls: ['./barangay-peacekeeping.component.css'],
})
export class BarangayPeacekeepingComponent implements OnInit {
  munCityName = this.Auth.munCityName;
  constructor(
    private Auth: AuthService,
    private service: SafetyTanodService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  setYear = Number(this.Auth.activeSetYear);
  munCityId = this.Auth.munCityId;
  listData: any = [];
  addData: any = {};
  editData: any = {};
  listBarangayData: any = [];
  idCounter: number = 1;
  updateForm: boolean = false;
  toValidate: any = {};

  ngOnInit(): void {
    this.resetForm();
    this.GetSafetyTanod();
    this.getListOfBarangay();
  }

  resetForm(): void {
    this.addData = {};
  }

  GetSafetyTanod(): void {
    this.service.GetSafetyTanod(this.setYear, this.munCityId).subscribe({
      next: (response) => {
        this.listData = response;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('GetSafetyTanod() completed.');
      },
    });
  }

  AddSafetyTanod(addData: any): void {
    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;

    if (this.toValidate.brgyId == true) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.addData.setYear = Number(this.setYear);
      this.addData.id = this.idCounter++;
      this.service.AddSafetyTanod(addData).subscribe({
        next: (response) => {
          this.listData.push(response);
          console.log(response);
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
          document.getElementById('mAdd')?.click();
          // this.resetForm();
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: '',
            text: 'This record is already existing!',
            showConfirmButton: false,
            timer: 3000,
          });
          this.resetForm();
        },
        complete: () => {
          // console.log('AddSafetyTanod() completed.');
        },
      });
    }
  }

  // AddSafetyTanod(addData: any): void {
  //   addData.setYear = Number(this.setYear);
  //   addData.id = this.idCounter++;
  //   // console.log(addData);
  //   this.service.AddSafetyTanod(addData).subscribe({
  //     next: (response) => {
  //       this.listData.push(response);
  //       console.log(response);
  //       Swal.fire({
  //         position: 'center',
  //         icon: 'success',
  //         title: 'Your work has been saved',
  //         showConfirmButton: false,
  //         timer: 1000,
  //       });
  //       this.resetForm();
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       Swal.fire({
  //         position: 'center',
  //         icon: 'error',
  //         title: 'Something went wrong!',
  //         text: err.message,
  //         showConfirmButton: false,
  //         timer: 3000,
  //       });
  //       this.resetForm();
  //     },
  //     complete: () => {
  //       console.log('AddSafetyTanod() completed.');
  //     },
  //   });
  // }

  EditSafetyTanod(addData: any): void {
    this.service.EditSafetyTanod(addData).subscribe({
      next: (response) => {
        this.GetSafetyTanod();
        //this.listData.push(response);
        // console.log(response);
        console.log(response);

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been updated',
          showConfirmButton: false,
          timer: 1000,
        });
        document.getElementById('mAdd')?.click();
        // this.resetForm();
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: '',
          text: 'Update unsuccessful!',
          showConfirmButton: false,
          timer: 3000,
        });
      },
      complete: () => {
        // console.log('UpdateSafetyTanod() completed.');
      },
    });
  }

  DeleteSafetyTanod(id: any): void {
    Swal.fire({
      title: '',
      text: 'Do you want to remove this data?.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteSafetyTanod(id).subscribe({
          next: (response) => {
            const index = this.listData.findIndex((d: any) => d.transId === id);
            //console.log(index);
            this.deleteData(id);
            this.listData.splice(index, 1);
            console.log(response);
            Swal.fire('Deleted!', 'Your file has been removed.', 'success');
            // Swal.fire({
            //   position: 'center',
            //   icon: 'success',
            //   title: '',
            //   text: 'The Peacekeeping Patrol (Tanod) Record has been deleted',
            //   showConfirmButton: false,
            //   timer: 1000,
            // });
          },
          error: (err) => {
            console.log(err);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: '',
              text: 'Something went wrong!',
              showConfirmButton: false,
              timer: 3000,
            });
          },
          complete: () => {
            console.log('DeleteSafetyTanod() completed.');
          },
        });
      }
    });
  }

  deleteData(id: number) {
    this.listData = this.listData.filter(
      (data: { id: number }) => data.id !== id
    );
  }

  getListOfBarangay(): void {
    this.service.ListOfBarangay(this.munCityId).subscribe((response) => {
      console.log('Barangay: ', response);
      this.listBarangayData = response;
    });
  }
}
