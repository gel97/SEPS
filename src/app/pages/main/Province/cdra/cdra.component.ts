import { Component, OnInit, ViewChild } from '@angular/core';
import { CDRAService } from 'src/app/shared/Province/CDRA.Service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { PdfService } from 'src/app/services/pdf.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { ImportComponent } from 'src/app/components/import/import.component';
declare var bootstrap: any;

@Component({
  selector: 'app-cdra',
  templateUrl: './cdra.component.html',
  styleUrls: ['./cdra.component.css'],
})
export class CDRAComponent implements OnInit {
  cdra: any[] = [];
  filteredCdra: any[] = [];
  selectedFilter: string = 'all';
  selectedImageSrc: string = '';
  selectedImageName: string = '';

  subcategoryOptions: { [key: string]: string[] } = {
    'Exposure Maps': [
      'Critical Point Facilities',
      'Lifeline Utilities',
      'Natural Resource-Based Production Areas',
      'Population',
      'Urban Use Areas',
    ],
    'Risk Maps': ['Flooding', 'Landslide', 'Storm Surge'],
    'Hazard Maps': ['-'],
    'Major Decision Areas': ['-'],
  };

  mapData: any = {
    imageName: '',
    mapType: 'Hazard Maps', // match backend
    subType: '-',
    File: null,
  };

  munCityName: string = this.auth.munCityName;

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: CDRAService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.GetCDRA();
    ($('#ModalAdd') as any).on('hidden.bs.modal', () => {
      this.resetForm();
    });
  }
  previewImage(item: any): void {
    this.selectedImageSrc = encodeURI(item.image);
    // ✅ USE the full URL as returned from backend
    this.selectedImageName = item.imageName;

    const modalEl = document.getElementById('imagePreviewModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  setMapType(type: string): void {
    this.mapData.mapType = type;
    const options = this.subcategoryOptions[type];
    this.mapData.subType = options ? options[0] : '-';
  }

  GetCDRA(): void {
    this.service.GetCDRA(this.auth.setYear).subscribe({
      next: (response) => {
        this.cdra = response;
        this.filterCategory(this.selectedFilter);
      },
      error: (err) => {
        console.error('Failed to fetch CDRA:', err);
      },
    });
  }

  filterCategory(type: string): void {
    this.selectedFilter = type;
    this.filteredCdra =
      type === 'all'
        ? this.cdra
        : this.cdra.filter(
            (m) => m.mapType?.toLowerCase() === type.toLowerCase()
          );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.mapData.File = file;
    }
  }

  uploadMap(): void {
    const { File, imageName, mapType, subType } = this.mapData;

    if (!File || !imageName || !mapType || !subType) {
      Swal.fire('Missing Fields', 'Please fill in all fields.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('File', File);
    formData.append('ImageName', imageName);
    formData.append('MapType', mapType);
    formData.append('SubType', subType); // ✅ Corrected here
    formData.append('SetYear', this.auth.setYear);

    Swal.fire({
      title: 'Uploading...',
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
    });

    this.service.uploadCDRA(formData).subscribe({
      next: () => {
        Swal.close();
        Swal.fire('Success!', 'Map uploaded successfully.', 'success');
        this.GetCDRA();
        ($('#ModalAdd') as any).modal('hide');
        this.resetForm();
      },
      error: () => {
        Swal.close();
        Swal.fire('Error!', 'Upload failed.', 'error');
      },
    });
  }

  resetForm(): void {
    this.mapData = {
      imageName: '',
      mapType: 'hazard',
      subType: '-',
      File: null,
    };
    const fileInput = document.getElementById('mapImage') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}
