import { Component, OnInit, ViewChild } from '@angular/core';
import { UseUrbanService } from 'src/app/shared/Province/UrbanUse.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { PdfService } from 'src/app/services/pdf.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { ImportComponent } from 'src/app/components/import/import.component';

@Component({
  selector: 'app-use-urban',
  templateUrl: './use-urban.component.html',
  styleUrls: ['./use-urban.component.css'],
})
export class UseUrbanComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  @ViewChild(ImportComponent)
  private importComponent!: ImportComponent;

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: UseUrbanService,
    private auth: AuthService
  ) {}
  SetMarker(data: any = {}) {
  if (!data.longitude || !data.latitude) {
    data.longitude = this.longitude;
    data.latitude = this.latitude;
  }

  this.markerObj = {
    lat: data.latitude,
    lng: data.longitude,
    label: data.brgyName ? data.brgyName.charAt(0) : '',
    brgyName: data.brgyName,
    munCityName: this.munCityName,
    draggable: true,
  };

  if (this.gmapComponent) {
    this.gmapComponent.setMarker(this.markerObj);
  }

  if (!data.brgyName && this.gmapComponent) {
    this.gmapComponent.getAddress(data.latitude, data.longitude);
  }
}


  latitude: any;
  longitude: any;
  markerObj: any = {};
  munCityName: string = this.auth.munCityName;
  urban: any;
  data: any = {};
  editModal: any = {};
  pageSize = 25;
  p: string | number | undefined;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 25, 50, 100];
  visible: boolean = true;
  not_visible: boolean = true;
  searchText = '';
  barangayList: string[] = []; 
  munCityList: string[] = []; 
  selectedMunCity: string = ''; 
  UrbanExposed: any[] = []; 

  ngOnInit(): void {
    this.urban = [];
    this.GetUseUrban();
  }
  GetUseUrban() {
    this.service.GetUseUrban().subscribe({
    next: (response) => {
      this.urban = response; 
      this.munCityList = Array.from(
        new Set(this.urban.map((item: any) => item.muncity as string))
      );
      this.UrbanExposed = [...this.urban]; // default to show all
    },
    error: (err) => console.error(err)
  });
  }
  ExportExcel() {
    this.reportService.GetExcelExport(
      this.auth.setYear,
      this.auth.munCityId,
      'UrbanUse'
    );
  }
  filterMunCity() {
  if (this.selectedMunCity) {
    this.UrbanExposed = this.urban.filter(
      (item: any) => item.muncity === this.selectedMunCity
    );
  } else {
    this.UrbanExposed = [...this.urban]; // show all if no filter
  }
}
  message = 'UrbanUse';
  ImportExcel(e: any) {
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
        this.reportService
          .Get_ExImport(
            e.target.files[0],
            this.auth.setYear,
            this.auth.munCityId,
            'UrbanUse'
          )
          .subscribe((success) => {
            Swal.fire({
              title: 'Importing Data',
              html: 'Please wait for a moment.',
              timerProgressBar: true,
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
                setTimeout(() => {
                  if (success) {
                    this.GetUseUrban();
                    Swal.close();
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: 'File imported successfully',
                      showConfirmButton: true,
                    });
                  } else {
                    Swal.close();
                    Swal.fire({
                      position: 'center',
                      icon: 'error',
                      title: 'Something went wrong. possible invalid file',
                      showConfirmButton: true,
                    });
                  }
                }, 5000);
              },
            });
          });
      } else {
      }
    });
  }
  onTableDataChange(page: any) {
    this.p = page;
    this.GetUseUrban();
  }

  onTableSizeChange(event: any) {
    this.tableSize = event.target.value;
    this.p = 1;
    this.GetUseUrban();
  }
  editurban(editurban: any = {}) {
  this.editModal = { ...editurban }; // clone to avoid binding overwrite

  // push saved marker back to map
  this.SetMarker({
    latitude: this.editModal.latitude,
    longitude: this.editModal.longitude,
    brgyName: this.editModal.brgyName
  });

  // if brgyName not available, resolve via geocoder
  if (!this.editModal.brgyName && this.editModal.latitude && this.editModal.longitude) {
    this.gmapComponent.getAddress(this.editModal.latitude, this.editModal.longitude);
  }

  this.not_visible = true;
  this.visible = false;
}

  update() {
  this.editModal.longitude = this.gmapComponent.markers.lng;
  this.editModal.latitude = this.gmapComponent.markers.lat;

  this.gmapComponent.geocoder.geocode(
    { location: { lat: this.editModal.latitude, lng: this.editModal.longitude } },
    (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        let brgy = '';
        let city = '';
        let province = '';

        results[0].address_components.forEach((component: any) => {
          if (component.types.includes('sublocality') || component.types.includes('sublocality_level_1')) {
            brgy = component.long_name;
          }
          if (component.types.includes('locality')) {
            city = component.long_name;
          }
          if (component.types.includes('administrative_area_level_2')) {
            province = component.long_name;
          }
        });

        this.editModal.brgyName =
          [brgy, city, province].filter(Boolean).join(', ') ||
          results[0].formatted_address;
      } else {
        this.editModal.brgyName = 'Unknown Location';
      }

      // save
      this.service.UpdateUseUrban(this.editModal).subscribe({
        next: () => {
          this.GetUseUrban();

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been updated',
            showConfirmButton: false,
            timer: 1000,
          });

          // 🔹 keep modal data, don’t reset editModal here
          // this.editModal = {};
        },
        error: (err) => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Update failed',
            text: err.message,
            showConfirmButton: true,
          });
        },
      });
    }
  );
}




  DeleteAffectedFlood(dataItem: any) {
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
        this.service.DeleteUseUrban(dataItem.transId).subscribe((request) => {
          this.GetUseUrban();
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
  clearData() {
    this.editModal = {};
    this.not_visible = false;
    this.visible = true;
  }
  parentMethod() {
    // alert('parent Method');
    this.editModal = {};
    this.not_visible = false;
    this.visible = true;
  }
  editToggle() {
    this.not_visible = true;
    this.visible = false;
  }
}
