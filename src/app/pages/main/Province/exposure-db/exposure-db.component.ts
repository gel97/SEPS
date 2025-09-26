import { Component, OnInit, ViewChild } from '@angular/core';
import { LifeLineFloodsService } from 'src/app/shared/Province/LifeLineFloods.Service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { PdfService } from 'src/app/services/pdf.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { ImportComponent } from 'src/app/components/import/import.component';

@Component({
  selector: 'app-exposure-db',
  templateUrl: './exposure-db.component.html',
  styleUrls: ['./exposure-db.component.css'],
})
export class ExposureDBComponent implements OnInit {
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
    private service: LifeLineFloodsService,
    private auth: AuthService
  ) {}
  SetMarker(data: any = {}) {
   if (!data.longitude || !data.latitude){
      data.longitude = this.longitude;
      data.latitude = this.latitude;
   }
   this.markerObj = {
    lat: data.latitude,
    lng: data.longitude,
    label: data.brgyName ? data.brgyName.charAt(0): '',
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
  lifeline: any;
  data: any = {};
  editmodal: any = {};
  pageSize = 25;
  p: string | number | undefined;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 25, 50, 100];
  visible: boolean = true;
  not_visible: boolean = true;
  searchText = '';
  selectedBarangay: string = '';
  barangayList: string[] = []; // unique list of barangays
  LifeLineExposed: any[] = []; // filtered result
  ngOnInit(): void {
    this.lifeline = [];
    this.GetLifeLineFloods();
  }
  GetLifeLineFloods() {
    this.service.GetLifeLineFloods().subscribe({
      next: (response) => {
        this.lifeline = response; // Assign API response to totalGovernanceData
        this.barangayList = Array.from(
          new Set(this.lifeline.map((item: any) => item.barangay as string))
        );
        console.log('LifeLine Data:', this.lifeline.TotalData); // Check if the value is correct
      },
      error: (error) => {
        console.error('Error fetching governance data:', error);
      },
    });
  }
  filterBarangay() {
    if (this.selectedBarangay) {
      this.LifeLineExposed = this.lifeline.filter(
        (item: any) => item.barangay === this.selectedBarangay
      );
    } else {
      this.LifeLineExposed = [...this.lifeline]; // show all if no filter
    }
  }
  ExportExcel() {
    this.reportService.GetExcelExport(
      this.auth.setYear,
      this.auth.munCityId,
      'LifeLineFloods'
    );
  }
  message = 'LifeLineFloods';
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
            'LifeLineFloods'
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
                    this.GetLifeLineFloods();
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
    this.GetLifeLineFloods();
  }

  onTableSizeChange(event: any) {
    this.tableSize = event.target.value;
    this.p = 1;
    this.GetLifeLineFloods();
  }
  editaffected(editlifeline: any = {}) {
    this.editmodal = { ...editlifeline };

    this.SetMarker({
      latitude: this.editmodal.latitude,
      longitude: this.editmodal.longitude,
      brgyName: this.editmodal.brgyName
    });

    if (!this.editmodal.brgyName && this.editmodal.latitude && this.editmodal.longitude) {
      this.gmapComponent.getAddress(this.editmodal.latitude, this.editmodal.longitude);
    }
    this.not_visible = true;
    this.visible = false;
    
  }
  update() {
    this.editmodal.longitude = this.gmapComponent.markers.lng;
    this.editmodal.latitude = this.gmapComponent.markers.lat;
  
    this.gmapComponent.geocoder.geocode(
      { location: { lat: this.editmodal.latitude, lng: this.editmodal.longitude } },
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
  
          this.editmodal.brgyName =
            [brgy, city, province].filter(Boolean).join(', ') ||
            results[0].formatted_address;
        } else {
          this.editmodal.brgyName = 'Unknown Location';
        }
  
        // save
        this.service.UpdateLifeLineFloods(this.editmodal).subscribe({
          next: () => {
            this.GetLifeLineFloods();
  
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
        this.service
          .DeleteLifeLineFloods(dataItem.transId)
          .subscribe((request) => {
            this.GetLifeLineFloods();
          });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
  clearData() {
    this.editmodal = {};
    this.not_visible = false;
    this.visible = true;
  }
  parentMethod() {
    // alert('parent Method');
    this.editmodal = {};
    this.not_visible = false;
    this.visible = true;
  }
  editToggle() {
    this.not_visible = true;
    this.visible = false;
  }
}
