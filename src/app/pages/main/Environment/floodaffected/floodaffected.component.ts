import { Component, OnInit, ViewChild } from '@angular/core';
import { EnvironmentService } from 'src/app/shared/Environment/environment.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { EnvironmentAffectedFloodService } from 'src/app/shared/Environment/environment-affected-flood';
import { PdfService } from 'src/app/services/pdf.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { ImportComponent } from 'src/app/components/import/import.component';

@Component({
  selector: 'app-floodaffected',
  templateUrl: './floodaffected.component.html',
  styleUrls: ['./floodaffected.component.css'],
})
export class FloodaffectedComponent implements OnInit {
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
    private service: EnvironmentAffectedFloodService,
    private auth: AuthService
  ) {}

  SetMarker(data: any = {}) {
    console.log('lnglat', data.longitude + ' , ' + data.latitude);

    if (data.longitude == undefined && data.latitude == undefined) {
      data.longitude = this.longitude;
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
  }
  isCheck: boolean = false;
  addData: any = {};
  munCityName: string = this.auth.munCityName;
  markerObj: any = {};
  latitude: any;
  longitude: any;
  affected: any;
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
  selectedBarangay: string = '';
  barangayList: string[] = []; // unique list of barangays
  filteredAffected: any[] = []; // filtered result

  ngOnInit(): void {
    this.affected = [];
    this.getaffected();
  }
  getaffected() {
    this.service.GetAffectedFlood().subscribe({
      next: (response) => {
        this.affected = response;

        // Extract unique barangays
        this.barangayList = Array.from(
          new Set(this.affected.map((item: any) => item.barangay as string))
        );

        // Set initial filtered list
        this.filteredAffected = [...this.affected];
      },
      error: (error) => {
        console.error('Error fetching governance data:', error);
      },
    });
  }
  filterBarangay() {
    if (this.selectedBarangay) {
      this.filteredAffected = this.affected.filter(
        (item: any) => item.barangay === this.selectedBarangay
      );
    } else {
      this.filteredAffected = [...this.affected]; // show all if no filter
    }
  }

  ExportExcel() {
    this.reportService.GetExcelExport(
      this.auth.setYear,
      this.auth.munCityId,
      'FloodAffected'
    );
  }
  Maps() {
    var seps = 'SepsId?ModuleId=2&MunCityId=112314';

    var decoded = btoa(seps);
    var url = 'http://172.16.19.108/gis/seps/' + decoded;
    console.log(url);
    window.open(url, '_blank');
  }
  GeneratePDF() {
    this.service.Getpdf(this.auth.setYear, this.auth.munCityId).subscribe({
      next: (response: Blob) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(response);

        // Create a temporary anchor element to download the file
        const a = document.createElement('a');
        a.href = url;

        // Set the file name for the downloaded file
        a.download = `Affected_Flood_${this.auth.munCityName}.pdf`;

        // Trigger the download
        a.click();

        // Revoke the object URL to free memory
        window.URL.revokeObjectURL(url);

        // Provide feedback to the user
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'PDF downloaded successfully!',
          showConfirmButton: false,
          timer: 3000,
        });
      },
      error: (err) => {
        console.error('Error generating PDF:', err);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Failed to generate PDF.',
          text: 'Please try again later.',
          showConfirmButton: true,
        });
      },
    });
  }

  message = 'Affected Flood';

  public showOverlay = false;

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
            'FloodAffected'
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
                    this.getaffected();
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
    this.getaffected();
  }

  onTableSizeChange(event: any) {
    this.tableSize = event.target.value;
    this.p = 1;
    this.getaffected();
  }
  editaffected(editaffected: any = {}) {
    this.editModal = editaffected;
    this.getaffected();
  }
  update() {
    // Call the service to update the affected flood data
    this.service.UpdateAffectedFlood(this.editModal).subscribe({
      next: (_data) => {
        this.getaffected(); // Refresh the affected flood data
        this.editModal = {}; // Clear the edit modal data
      },
    });

    // Show success message
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Your work has been updated',
      showConfirmButton: false,
      timer: 1000,
    });

    // Close the modal
    document.getElementById('exampleModalLong')?.click();
    this.editModal = {};
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
          .DeleteAffectedFlood(dataItem.transId)
          .subscribe((request) => {
            this.getaffected();
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
