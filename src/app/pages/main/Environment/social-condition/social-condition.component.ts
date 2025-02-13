import { Component, OnInit, ViewChild } from '@angular/core';
import { EnvironmentService } from 'src/app/shared/Environment/environment.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-social-condition',
  templateUrl: './social-condition.component.html',
  styleUrls: ['./social-condition.component.css'],
})
export class SocialConditionComponent implements OnInit {
  constructor(
    private EnvironmentService: EnvironmentService,
    private AuthService: AuthService
  ) {}

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  menuId = 6;
  setYear = Number(this.AuthService.activeSetYear);
  munCityId = this.AuthService.munCityId;
  userId = this.AuthService.userId;

  listSocialcondition: any = [];
  addDescription: any = {};
  visible: boolean = true;
  not_visible: boolean = true;
  required: boolean = true;

  updateForm: boolean = false;

  ngOnInit(): void {
    this.resetForm();
    this.GetSocial();
  }
  resetForm(): void {
    this.addDescription = {}; // Reset the form fields here
  }

  click: boolean = true;
  buttonClick() {
    this.click = !this.click;
  }
  onKey(event: KeyboardEvent) {
    this.click = (event.target as HTMLInputElement).value == '' ? true : false;
  }
  parentMethod() {
    // alert('parent Method');
    this.addDescription = {};
    this.not_visible = false;
    this.visible = true;
    this.required = false;
  }
  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.EnvironmentService.Import(this.menuId).subscribe({
      next: (data) => {
        this.ngOnInit();
        if (data.length === 0) {
          this.showOverlay = false;
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
            icon: 'info',
            title: 'No data from previous year',
          });
        } else {
          this.showOverlay = false;
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
            title: 'Imported Successfully',
          });
        }
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
          icon: 'warning',
          title: 'Something went wrong',
        });
      },
      complete: () => {},
    });
  }

  GetSocial(): void {
    this.EnvironmentService.GetEnvironment(
      this.menuId,
      this.setYear,
      this.munCityId
    ).subscribe({
      next: (response) => {
        this.listSocialcondition = response;
        // console.log(this.listenvironment);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('GetSocial() completed.');
      },
    });
  }

  message = 'Social Condition and Vulnerability';

  AddSocial(addDescription: any): void {
    addDescription.setYear = Number(this.setYear);
    addDescription.menuId = String(this.menuId);
    addDescription.userId = this.userId;
    addDescription.munCityId = this.munCityId;
    this.EnvironmentService.AddEnvironment(addDescription).subscribe({
      next: (response) => {
        this.listSocialcondition.push(response);
        console.log(response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1000,
        });
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Something went wrong!',
          showConfirmButton: false,
          timer: 3000,
        });
      },
      complete: () => {
        this.closebutton.nativeElement.click();
        console.log('AddSocial completed.');
      },
    });
  }

  EditSocial(addDescription: any): void {
    console.log(addDescription);
    this.EnvironmentService.EditEnvironment(addDescription).subscribe({
      next: (response) => {
        this.GetSocial();
        //this.listData.push(response);
        console.log(response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been updated',
          showConfirmButton: false,
          timer: 1000,
        });
        this.resetForm();
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Something went wrong!',
          text: err.message,
          showConfirmButton: false,
          timer: 3000,
        });
      },
      complete: () => {
        this.closebutton.nativeElement.click();
        console.log(
          'UpdateSocial Condition and Vulnerability() completed() completed.'
        );
      },
    });
  }

  deleteSocial(id: number) {
    this.listSocialcondition = this.listSocialcondition.filter(
      (data: { id: number }) => data.id !== id
    );
  }

  DeleteSocial(id: any): void {
    Swal.fire({
      title:
        'Are you sure you want to delete this Social Condition and Vulnerability() completed Data?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.EnvironmentService.DeleteEnvironment(id).subscribe({
          next: (response) => {
            const index = this.listSocialcondition.findIndex(
              (d: any) => d.transId === id
            );
            //console.log(index);
            this.deleteSocial(id);
            this.listSocialcondition.splice(index, 1);
            console.log(response);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title:
                'The Social Condition and Vulnerability Data has been deleted',
              showConfirmButton: false,
              timer: 1000,
            });
          },
          error: (err) => {
            console.log(err);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Something went wrong!',
              text: err.message,
              showConfirmButton: false,
              timer: 3000,
            });
          },
          complete: () => {
            console.log(
              'Delete Social Condition and Vulnerability() completed.'
            );
          },
        });
      }
    });
  }
}
