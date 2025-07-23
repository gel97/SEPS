import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { ImportComponent } from 'src/app/components/import/import.component';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { EnvironmentActService } from 'src/app/shared/Environment/environment-act.service';
import { SourceService } from 'src/app/shared/Source/Source.Service';

@Component({
  selector: 'app-environmental-activities',
  templateUrl: './environmental-activities.component.html',
  styleUrls: ['./environmental-activities.component.css'],
})
export class EnvironmentalActivitiesComponent implements OnInit {
  constructor(
    private Auth: AuthService,
    private Service: EnvironmentActService,
    private SourceService: SourceService
  ) {}

  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  isCheck: boolean = false;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }
  @ViewChild(ImportComponent)
  private importComponent!: ImportComponent;
  munCityName: string = this.Auth.munCityName;
  menuId = '3';
  dataList: any = [];
  setYear = this.Auth.activeSetYear;
  munCityId = this.Auth.munCityId;
  userId = this.Auth.userId;
  barangayList: any = [];
  addData: any = {};
  dummy_addData: any = {};
  dummyData: any = {};
  sources: any = [];
  newSource: any = {};
  selectedSourceId: number | null = null;
  showAddForm: boolean = true;

  listofActivities: any = [
    { id: `1`, type: `Preservation/ Protection` },
    { id: `2`, type: `Reforestation` },
    { id: `3`, type: `Clearing of Waterways/ Dredging` },
    { id: `4`, type: `Commercial Fishing` },
    { id: `5`, type: `Aquatic Resources Reaping` },
    { id: `6`, type: `Quarrying` },
    { id: `7`, type: `Mining` },
    { id: `8`, type: `Logging` },
    { id: `9`, type: `Groundwater Extraction` },
    { id: `10`, type: `Hunting of Wildlife Species` },
    { id: `11`, type: `Others` },
  ];
  visible: boolean = true;
  not_visible: boolean = true;
  //required == not_visible
  required: boolean = true;
  latitude: any;
  longtitude: any;
  checker_brgylist: any = {};
  toValidate: any = {};

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  markerObj: any = {};

  message = 'Environmental Activities';

  SetMarker(data: any = {}) {
    console.log('lnglat: ', data.longtitude + ' , ' + data.latitude);

    if (data.longtitude == undefined && data.latitude == undefined) {
      data.longtitude = this.longtitude;
      data.latitude = this.latitude;
    }

    this.markerObj = {
      lat: data.latitude,
      lng: data.longtitude,
      label: data.brgyName.charAt(0),
      brgyName: data.brgyName,
      munCityName: this.munCityName,
      draggable: true,
    };
    this.gmapComponent.setMarker(this.markerObj);
    console.log('marker', this.markerObj);
  }

  ngOnInit(): void {
    this.GetEnvironmentalActivities();
    this.GetBarangayList();
    this.getSources();
  }
  getSources(): void {
    const setYear = this.Auth.activeSetYear;
    const munCityId = this.Auth.munCityId;
    const sourceFor = 'onvActivity';

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

    const sourceFor = 'onvActivity'; // 👈 assign your module name

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

  GetEnvironmentalActivities() {
    this.Service.GetEnvironmentalActivities(
      this.setYear,
      this.munCityId
    ).subscribe((response) => {
      this.dataList = <any>response;
      console.log('check', response);
    });
  }

  GetBarangayList() {
    this.Service.GetBarangayList(this.munCityId).subscribe((response) => {
      this.barangayList = <any>response;
      console.log('barangay', response);
    });
  }

  findBrgyId(brgyId: any) {
    return this.barangayList.find(
      (item: { brgyId: any }) => item.brgyId === brgyId
    );
  }
  import() {
    let importData = 'EnvironmentAct';
    // this.view = this.importComponent.viewData;
    this.importComponent.import(importData);
  }
  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.Service.Import().subscribe({
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

  AddEnvironmentalActivities() {
    console.log('trap', this.addData);
    console.log('brgyid', this.addData.brgyId);
    this.dummy_addData = this.addData;
    console.log('trap_2', this.dummy_addData);

    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;
    this.toValidate.name =
      this.addData.name == '' || this.addData.name == undefined ? true : false;
    if (this.toValidate.brgyId == true || this.toValidate.name == true) {
      Swal.fire('', 'Please fill out the required fields', 'warning');
    } else {
      if (
        JSON.stringify(this.dummy_addData) != JSON.stringify(this.dummyData) &&
        this.addData.brgyId != undefined
      ) {
        this.addData.setYear = this.setYear;
        this.addData.munCityId = this.munCityId;
        this.addData.menuId = this.menuId;
        this.addData.userId = this.userId;
        console.log('brgylist', this.barangayList);

        const result = this.findBrgyId(this.addData.brgyId);
        this.longtitude = result.longitude;
        this.addData.longtitude = this.longtitude;
        console.log('long', this.longtitude);
        this.latitude = result.latitude;
        this.addData.latitude = this.latitude;
        console.log('lat', this.latitude);

        this.Service.AddEnvironmentalActivities(this.addData).subscribe(
          (request) => {
            if (!this.isCheck) {
              this.closebutton.nativeElement.click();
            }
            console.log('add', request);
            this.clearData();
            this.GetEnvironmentalActivities();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Your work has been saved',
              showConfirmButton: false,
              timer: 1000,
            });
          }
        );
      } else {
        this.required = true;
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'Missing data!',
        });
      }
    }
  }

  EditEnvironmentalActivities() {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.addData.longtitude = this.gmapComponent.markers.lng;
        this.addData.latitude = this.gmapComponent.markers.lat;

        this.addData.setYear = this.setYear;
        this.addData.munCityId = this.munCityId;
        this.addData.menuId = this.menuId;
        this.addData.tag = 1;
        console.log('edit', this.addData);
        this.Service.EditEnvironmentalActivities(this.addData).subscribe(
          (request) => {
            console.log('edit', request);
            this.closebutton.nativeElement.click();
            this.GetEnvironmentalActivities();
          }
        );
        Swal.fire('Saved!', '', 'success');
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }

  DeleteEnvironmentalActivities(dataItem: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.Service.DeleteEnvironmentalActivities(dataItem.transId).subscribe(
          (request) => {
            this.GetEnvironmentalActivities();
          }
        );
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }

  clearData() {
    this.addData = {};
    this.not_visible = false;
    this.visible = true;
    this.required = false;
  }

  parentMethod() {
    // alert('parent Method');
    this.addData = {};
    this.not_visible = false;
    this.visible = true;
    this.required = false;
  }

  editToggle() {
    this.not_visible = true;
    this.visible = false;
  }
}
