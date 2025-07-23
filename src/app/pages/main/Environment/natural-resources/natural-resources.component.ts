import { Component, OnInit, ViewChild } from '@angular/core';
import { EnvironmentService } from 'src/app/shared/Environment/environment.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { SourceService } from 'src/app/shared/Source/Source.Service';

@Component({
  selector: 'app-natural-resources',
  templateUrl: './natural-resources.component.html',
  styleUrls: ['./natural-resources.component.css'],
})
export class NaturalResourcesComponent implements OnInit {
  constructor(
    private EnvironmentService: EnvironmentService,
    private AuthService: AuthService,
    private SourceService: SourceService
  ) {}
  menuId = 2;
  setYear = Number(this.AuthService.activeSetYear);
  munCityId = this.AuthService.munCityId;
  userId = this.AuthService.userId;

  listResources: any = [];
  addData: any = {};

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  idCounter: number = 1;
  updateForm: boolean = false;
  visible: boolean = true;
  not_visible: boolean = true;
  required: boolean = true;
  sources: any = [];
  newSource: any = {};
  selectedSourceId: number | null = null;
  showAddForm: boolean = true;

  message = 'Natural/ Biological Resources';

  ngOnInit(): void {
    this.resetForm();
    this.GetResources();
    this.getSources();
  }
  getSources(): void {
    const setYear = this.AuthService.activeSetYear;
    const munCityId = this.AuthService.munCityId;
    const sourceFor = 'Natural/ Biological';

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

    const sourceFor = 'Natural/ Biological'; // 👈 assign your module name

    // ✅ Add metadata
    this.newSource.munCityId = this.AuthService.munCityId;
    this.newSource.setYear = this.AuthService.activeSetYear;
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
  resetForm(): void {
    this.addData = {}; // Reset the form fields here
  }
  parentMethod() {
    // alert('parent Method');
    this.addData = {};
    this.not_visible = false;
    this.visible = true;
    this.required = false;
  }

  click: boolean = true;
  buttonClick() {
    this.click = !this.click;
  }
  onKey(event: KeyboardEvent) {
    this.click = (event.target as HTMLInputElement).value == '' ? true : false;
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

  GetResources(): void {
    this.EnvironmentService.GetEnvironment(
      this.menuId,
      this.setYear,
      this.munCityId
    ).subscribe({
      next: (response) => {
        this.listResources = response;
        // console.log(this.listenvironment);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('GetEnvironmentResources() completed.');
      },
    });
  }

  AddResources(addData: any): void {
    addData.setYear = Number(this.setYear);
    addData.menuId = String(this.menuId);
    addData.id = this.idCounter++;
    addData.userId = this.userId;
    addData.munCityId = this.munCityId;
    this.EnvironmentService.AddEnvironment(addData).subscribe({
      next: (response) => {
        this.listResources.push(response);
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
        console.log('AddEnvironmentResources() completed.');
      },
    });
  }

  EditResources(addData: any): void {
    this.EnvironmentService.EditEnvironment(addData).subscribe({
      next: (response) => {
        this.GetResources();
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
        console.log('UpdateEnvironmentResources() completed.');
      },
    });
  }

  deleteResources(id: number) {
    this.listResources = this.listResources.filter(
      (data: { id: number }) => data.id !== id
    );
  }

  DeleteResources(id: any): void {
    Swal.fire({
      title: 'Are you sure you want to delete this Environment Resources Data?',
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
            const index = this.listResources.findIndex(
              (d: any) => d.transId === id
            );
            //console.log(index);
            this.deleteResources(id);
            this.listResources.splice(index, 1);
            console.log(response);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'The Environment Resources Data has been deleted',
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
            console.log('DeleteEnvironmentResources() completed.');
          },
        });
      }
    });
  }
}
