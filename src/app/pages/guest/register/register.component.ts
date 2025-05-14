import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { GuestService } from 'src/app/shared/Guest/Guest.Service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { response } from 'express';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  userType: string = '';
  showMunicipality: boolean = false;
  showAgency: boolean = false;
  MunicipalityList: any = [];
  selectedMunicipality: string = '';
  agencyName: string = '';
  list_muncity: any = {};

  constructor(
    private auth: AuthService,
    private service: GuestService,
    private modifyService: ModifyCityMunService
  ) {}

  ngOnInit(): void {
    this.service.ListOfMunicipality().subscribe((data) => {
      this.list_muncity = <any>data;
    });
  }
  isLoading: boolean = false;
  isLoadingSubmit: boolean = false;

  errorUname: boolean = true;
  user: any = {};

  toValidate: any = {};

  password: string = '';
  passwordVisible: boolean = false;

  onUserTypeChange(value: string): void {
    this.userType = value;
    this.user.GuestUserType = ''; // Reset value

    this.showMunicipality = value === 'lgu';
    this.showAgency = value === 'agency';

    if (value === 'lgu') {
      this.user.GuestUserType = 'LGU';
      this.ListOfMunicipality();
    } else if (value === 'agency') {
      this.user.GuestUserType = this.agencyName; // initially blank
    }
  }

  ListOfMunicipality() {
    this.service.ListOfMunicipality().subscribe((response) => {
      this.MunicipalityList = <any>response;
      console.log('Municipality', response);
    });
  }

  Register() {
    if (!this.user.acceptPrivacy) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Privacy Agreement Required',
        text: 'You must accept the Data Privacy Agreement to continue.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
      return;
    }
    this.isLoadingSubmit = true;
    this.toValidate.username =
      this.user.username == '' ||
      this.user.username == null ||
      this.user.username < 8 ||
      this.errorUname
        ? true
        : false;
    this.toValidate.password =
      this.user.password == '' || this.user.password == null ? true : false;
    this.toValidate.confirmPassword =
      this.user.confirmPassword == '' || this.user.confirmPassword == null
        ? true
        : false;
    this.toValidate.guestUserType =
      this.user.guestUserType == '' || this.user.guestUserType == null
        ? true
        : false;
    this.toValidate.lastname =
      this.user.lastname == '' || this.user.lastname == null ? true : false;
    this.toValidate.occupation =
      this.user.occupation == '' || this.user.occupation == null ? true : false;
    this.toValidate.age =
      this.user.age == '' || this.user.age == null ? true : false;
    this.toValidate.fullName =
      this.user.fullName == '' || this.user.fullName == null ? true : false;
    // this.toValidate.munCityId =
    //   this.user.munCityId == '' || this.user.munCityId == null ? true : false;

    console.log(this.toValidate);
    if (
      !this.errorUname &&
      !this.toValidate.username &&
      !this.toValidate.password &&
      !this.toValidate.confirmPassword &&
      !this.toValidate.fullName
    ) {
      Swal.fire({
        title: 'Are you sure?',
        text: '',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, submit it!',
      }).then((result) => {
        console.log(result);
        if (result.isConfirmed) {
          this.user.designation = ''; //temp
          this.service.Register(this.user).subscribe({
            next: (response: any) => {
              console.log(response);
              this.user = {};
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer);
                  toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
              });

              Toast.fire({
                icon: 'success',
                title: 'Added successfully',
              });
              this.isLoadingSubmit = false;
            },
            error: (error) => {
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer);
                  toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
              });
              Toast.fire({
                icon: 'error',
                title: 'Something went wrong!',
              });
              this.isLoadingSubmit = false;
            },
            complete: () => {},
          });
        } else {
          this.isLoadingSubmit = false;
        }
      });
    } else {
      this.isLoadingSubmit = false;
    }
  }

  showToast(icon: 'success' | 'error', title: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({ icon, title });
  }

  usernameError: any = '';
  UsernameCheck(username: string) {
    console.log(username.length);

    if (username.length >= 8) {
      this.isLoading = true;
      this.service.UsernameCheck(username).subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (error) => {
          if (error.status == 200) {
            this.errorUname = false;
            this.toValidate.usernameCheck = false;
          } else {
            this.errorUname = true;
            this.toValidate.usernameCheck = true;
          }
          this.isLoading = false;
        },
        complete: () => {},
      });
    } else {
      this.errorUname = true;
    }
  }
  CheckIfnotempty(value: string) {
    if (value !== null || value !== '') {
      this.toValidate.munCityId = false;
    }
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
