import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { EnvironmentProfileService } from 'src/app/shared/Environment/environment-profile.service';
import { ImportComponent } from 'src/app/components/import/import.component';
import { SourceService } from 'src/app/shared/Source/Source.Service';

@Component({
  selector: 'app-historical-disaster',
  templateUrl: './historical-disaster.component.html',
  styleUrls: ['./historical-disaster.component.css'],
})
export class HistoricalDisasterComponent implements OnInit {
  constructor(
    private service: EnvironmentProfileService,
    private Auth: AuthService,
    private SourceService: SourceService
  ) {}

  menuId = 7;
  setYear = Number(this.Auth.activeSetYear);
  munCityId = this.Auth.munCityId;
  userId = this.Auth.userId;
  @ViewChild(ImportComponent)
  private importComponent!: ImportComponent;
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  message = 'Historical Disaster Profile';
  visible: boolean = true;
  not_visible: boolean = true;
  required: boolean = true;
  listHis: any = [];
  addData: any = {};
  editData: any = {};
  idCounter: number = 1;
  updateForm: boolean = false;
  sources: any = [];
  newSource: any = {};
  selectedSourceId: number | null = null;
  showAddForm: boolean = true;

  list_of_disaster = [
    { id: 1, type_disas: 'Flooding' },
    { id: 2, type_disas: 'Typhoon with Sheet Flood' },
    { id: 3, type_disas: 'Flashflood ' },
    { id: 4, type_disas: 'Rainfall-induced Landslides' },
    { id: 5, type_disas: 'Coastal/ Storm Surges' },
    { id: 6, type_disas: 'Earthquake ' },
    { id: 7, type_disas: 'Earthquake-induced Landslides Ground Rupture ' },
    { id: 8, type_disas: 'Soil Liquefaction ' },
    { id: 9, type_disas: 'Tsunami' },
    { id: 10, type_disas: 'Volcanic Eruptions ' },
    { id: 11, type_disas: 'Severe Drought/Heatwave ' },
    { id: 12, type_disas: 'Strong Wind ' },
    { id: 13, type_disas: 'Southeast Monsoon/Habagat ' },
  ];

  ngOnInit() {
    this.GetData();
    this.getSources();
  }
  getSources(): void {
    const setYear = this.Auth.activeSetYear;
    const munCityId = this.Auth.munCityId;
    const sourceFor = 'historicalDisaster'; // 👈 assign your module name

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

    const sourceFor = 'historicalDisaster'; // 👈 assign your module name

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

  resetForm(): void {
    this.addData = {};
  }

  parentMethod() {
    // alert('parent Method');
    this.addData = {};
    this.not_visible = false;
    this.visible = true;
    this.required = false;
    this.updateForm = false;
    this.resetForm();
    // this.required = false;
  }

  GetData(): void {
    this.service.GetEnvironmentProfile(this.setYear, this.munCityId).subscribe({
      next: (response) => {
        this.listHis = response;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('GetHistoricalDisaster() completed.');
      },
    });
  }
  import() {
    let importData = 'EnvironmentProfile';
    // this.view = this.importComponent.viewData;
    this.importComponent.import(importData);
  }
  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import().subscribe({
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
  AddDescription(): void {
    this.addData.setYear = Number(this.setYear);
    this.addData.menuId = String(this.menuId);
    // addData.id = this.idCounter++;
    this.addData.userId = this.userId;
    this.addData.munCityId = this.munCityId;
    this.service.AddEnvironmentProile(this.addData).subscribe({
      next: (response) => {
        this.listHis.push(response);
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
          text: err.message,
          showConfirmButton: false,
          timer: 3000,
        });
      },
      complete: () => {
        this.closebutton.nativeElement.click();
        console.log('AddHistoricalDiaster() completed.');
      },
    });
  }

  EditDescription(): void {
    this.service.EditEnvironmentProfile(this.addData).subscribe({
      next: (response) => {
        this.GetData();
        //this.listData.push(response);
        console.log(response);
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
        console.log('UpdateHistoricalDisaster() completed.');
      },
    });
  }

  deleteDescription(id: number) {
    this.listHis = this.listHis.filter(
      (data: { id: number }) => data.id !== id
    );
  }

  DeleteDescription(id: any): void {
    Swal.fire({
      title: 'Are you sure you want to delete this Historical Disaster Data?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteEnvironmentProfile(id).subscribe({
          next: (response) => {
            const index = this.listHis.findIndex((d: any) => d.transId === id);
            //console.log(index);
            this.DeleteDescription(id);
            this.listHis.splice(index, 1);
            console.log(response);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'The Historical Disaster Data has been deleted',
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
            console.log('DeleteHistoricalDisaster() completed.');
          },
        });
      }
    });
  }
}
