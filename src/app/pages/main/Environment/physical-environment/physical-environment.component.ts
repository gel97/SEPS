import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EnvironmentService } from 'src/app/shared/Environment/environment.service';
import Swal from 'sweetalert2';
import { SourceService } from 'src/app/shared/Source/Source.Service';
@Component({
  selector: 'app-physical-environment',
  templateUrl: './physical-environment.component.html',
  styleUrls: ['./physical-environment.component.css'],
})
export class PhysicalEnvironmentComponent implements OnInit {
  constructor(
    private Auth: AuthService,
    private EnvironmentService: EnvironmentService,
    private SourceService: SourceService
  ) {}

  menuId = 1;
  setYear = Number(this.Auth.activeSetYear);
  munCityId: any = this.Auth.munCityId;
  userId: any = this.Auth.userId;
  visible: boolean = true;
  not_visible: boolean = true;
  required: boolean = true;
  listEnvironment: any = [];
  AddData: any = {};
  sources: any = [];
  newSource: any = {};
  selectedSourceId: number | null = null;
  showAddForm: boolean = true;

  isAdd: boolean = true;

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  clearAddData() {
    this.AddData.desc1 = '';
    this.AddData.desc2 = '';
    this.AddData.desc3 = '';
    this.AddData.desc4 = '';
    this.AddData.desc5 = '';
    this.AddData.desc6 = '';
    this.AddData.desc7 = '';
  }
  parentMethod() {
    // alert('parent Method');
    this.AddData = {};
    this.not_visible = false;
    this.visible = true;
    this.required = false;
    //this.updateForm = false;
    //this.resetForm();
    // this.required = false;
  }

  ngOnInit(): void {
    this.GetEnvironment();
    this.clearForm();
    this.getSources();
  }
  getSources(): void {
    const setYear = this.Auth.activeSetYear;
    const munCityId = this.Auth.munCityId;
    const sourceFor = 'physical-environment'; // 👈 assign your module name

    this.SourceService.getSources(setYear, munCityId, sourceFor).subscribe({
      next: (data) => {
        this.sources = data;
        this.showAddForm = data.length === 0;
      },
      error: (error) => {
        console.error('Failed to fetch sources:', error);
      },
    });
  }

  addSource(): void {
    if (!this.newSource?.name) {
      Swal.fire('Warning', 'Please enter a source name.', 'warning');
      return;
    }

    const sourceFor = 'physical-environment'; // 👈 assign your module name

    // ✅ Add metadata
    this.newSource.munCityId = this.Auth.munCityId;
    this.newSource.setYear = this.Auth.activeSetYear;
    this.newSource.sourceFor = sourceFor;

    this.SourceService.createSource(this.newSource).subscribe({
      next: () => {
        this.newSource = {};
        Swal.fire('Success', 'Source added successfully.', 'success');
        this.getSources(); // ✅ Re-fetch source list
      },
      error: (error) => {
        Swal.fire('Error', `Failed to create source.\n${error}`, 'error');
      },
    });
  }

  updateSource(): void {
    if (this.selectedSourceId === null || !this.newSource?.name) {
      Swal.fire('Warning', 'No source selected or missing name.', 'warning');
      return;
    }

    this.SourceService.updateSource(
      this.selectedSourceId,
      this.newSource
    ).subscribe({
      next: () => {
        this.getSources();
        this.selectedSourceId = null;
        this.newSource = {};
        Swal.fire('Success', 'Source updated successfully!', 'success');
      },
      error: (error) => {
        Swal.fire('Error', `Failed to update source.\n${error}`, 'error');
      },
    });
  }
  deleteSource(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will delete the source.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading dialog
        Swal.fire({
          title: 'Deleting...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Perform delete operation
        this.SourceService.deleteSource(id).subscribe({
          next: () => {
            this.getSources(); // Refresh list
            Swal.fire('Deleted!', 'Source has been deleted.', 'success');
          },
          error: (error) => {
            Swal.fire(
              'Error',
              `Failed to delete source.\n${error.message || error}`,
              'error'
            );
          },
        });
      }
    });
  }

  editSource(source: any): void {
    this.selectedSourceId = source.id;
    this.newSource = { ...source };
  }

  clearForm(): void {
    this.AddData = {};
  }
  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.EnvironmentService.Import(this.menuId).subscribe({
      next: (data) => {
        this.ngOnInit();
        if (data === null) {
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

  message = 'Physical Environment Profile';

  GetEnvironment(): void {
    this.EnvironmentService.GetEnvironment(
      this.menuId,
      this.setYear,
      this.munCityId
    ).subscribe({
      next: (response) => {
        this.listEnvironment = response;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('GetPhysicalEnvironment() completed.');
      },
    });
  }
  AddEnvironment(AddData: any): void {
    AddData.setYear = Number(this.setYear);
    AddData.menuId = String(this.menuId);
    AddData.userId = String(this.userId);
    AddData.munCityId = String(this.munCityId);

    this.EnvironmentService.AddEnvironment(AddData).subscribe({
      next: (response) => {
        this.listEnvironment.push(response);

        console.log(response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your progress has been saved',
          showConfirmButton: false,
          timer: 1000,
        });
        this.clearAddData();
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
        console.log('AddPhysicalEnvironment() completed.');
      },
    });
  }

  EditEnvironment(AddData: any): void {
    this.EnvironmentService.EditEnvironment(AddData).subscribe({
      next: (response) => {
        this.GetEnvironment();
        console.log(response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: ' Your progress has been updated',
          showConfirmButton: false,
          timer: 1000,
        });
        this.clearForm();
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
        console.log('UpdatePhysicalEnvironment() completed.');
      },
    });
  }

  DeleteEnvironment(transId: any): void {
    Swal.fire({
      title: 'Are you sure you want to delete this data?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.EnvironmentService.DeleteEnvironment(transId).subscribe({
          next: (response) => {
            this.deleteData(transId);
            console.log(response);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Your progress has been deleted',
              showConfirmButton: false,
              timer: 1000,
            });
            this.listEnvironment();
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            console.log('DeletePhysicalEnvironment() completed.');
          },
        });
      }
    });
  }

  deleteData(transId: number) {
    this.listEnvironment = this.listEnvironment.filter(
      (data: { transId: number }) => data.transId !== transId
    );
  }
}
