import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { ShapeFileService } from 'src/app/shared/Province/ShapeFile.Service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { PdfService } from 'src/app/services/pdf.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { ImportComponent } from 'src/app/components/import/import.component';

@Component({
  selector: 'app-critical-facilities',
  templateUrl: './critical-facilities.component.html',
  styleUrls: ['./critical-facilities.component.css']
})
export class CriticalFacilitiesComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFile: File | null = null;

  data = {
  name: '',
  setYear: new Date().getFullYear(),
  munCityId: ''  // ✅ default, update this from session/login
};
munCityName: string = ''


  shapefiles: any[] = [];
  attributes: any[] = [];
  attributeKeys: string[] = [];
  archiveFiles: string[] = [];
  datasets: Record<string, string[]> = {};
  objectKeys = Object.keys;

  showArchiveModal = false;
  showDatasetsModal = false;
  showAttributesModal = false;
  selectedDatasetName: string = '';
  currentRecNo: number | null = null;
  municipalities: any[] = [];
  selectedMunicipality: string = '';  // empty means "All"


  constructor(private shapeFileService: ShapeFileService, private auth: AuthService) {}

  ngOnInit(): void {
  this.data.munCityId = this.auth.munCityId;  
  this.munCityName = this.auth.munCityName;  

  if (this.data.munCityId === 'DDN') { 
    this.loadMunicipalities();
  }

  this.loadShapefiles();
}

loadMunicipalities() {
  this.shapeFileService.ListMunCity().subscribe({
    next: (res: any) => {
      console.log("Municipalities response:", res);

      if (Array.isArray(res)) {
        this.municipalities = res;
      } else if (res?.data && Array.isArray(res.data)) {
        this.municipalities = res.data;
      } else {
        console.warn("Unexpected municipalities response format", res);
        this.municipalities = [];
      }

      // ✅ Trim names just in case
      this.municipalities = this.municipalities.map((m: any) => ({
        munCityId: m.munCityId,
        munCityName: (m.munCityName || '').trim()
      }));
    },
    error: (err) => console.error("Failed to load municipalities", err)
  });
}




  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (!this.selectedFile) {
      Swal.fire("Error", "Please select a file first.", "error");
      return;
    }

    if (!this.data.name || this.data.name.trim() === '') {
      Swal.fire("Error", "Please enter a name for the shapefile.", "error");
      return;
    }

    this.shapeFileService.uploadShapefile(
  this.selectedFile,
  this.data.setYear,
  this.data.name,
  this.data.munCityId // ✅ include municipality
)
.subscribe({
      next: (res) => {
        Swal.fire("Success", res.message || "Shapefile uploaded!", "success");
        this.loadShapefiles();
        this.selectedFile = null;
        this.data.name = '';
        this.data.setYear = new Date().getFullYear();
      },
      error: (err) => {
        console.error("Upload error:", err);
        Swal.fire("Error", "Upload failed: " + (err?.error?.title || err?.message || "Unknown error"), "error");
      }
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.add("drag-over");
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.remove("drag-over");
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.remove("drag-over");

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(this.selectedFile);
      this.fileInput.nativeElement.files = dataTransfer.files;
    }
  }

  loadShapefiles() {
  const filterId = this.data.munCityId === 'DDN' 
    ? this.selectedMunicipality 
    : this.data.munCityId;

  this.shapeFileService.getAllShapefiles(filterId).subscribe({
    next: (files) => this.shapefiles = files,
    error: (err) => console.error('Failed to load shapefiles', err)
  });
}



  onDownload(recNo: number, originalFileName: string) {
    this.shapeFileService.downloadShapefile(recNo).subscribe((blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = originalFileName || `shapefile_${recNo}.zip`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  onViewDatasetAttributes(recNo: number, datasetName: string) {
    this.shapeFileService.getAttributes(recNo, datasetName).subscribe({
      next: (data) => {
        this.attributes = data;
        this.attributeKeys = data.length > 0 ? Object.keys(data[0]) : [];
        this.selectedDatasetName = datasetName;
        this.showAttributesModal = true;
      },
      error: () => Swal.fire("Error", "Failed to load dataset attributes", "error")
    });
  }

  onViewArchive(recNo: number) {
    this.shapeFileService.getArchiveFiles(recNo).subscribe({
      next: (res) => {
        this.archiveFiles = res.files || [];
        this.showArchiveModal = true;
      },
      error: () => console.error("Failed to load archive files"),
    });
  }

  onViewDatasets(recNo: number) {
    this.currentRecNo = recNo;
    this.shapeFileService.getDatasets(recNo).subscribe({
      next: (data) => {
        this.datasets = data;
        this.showDatasetsModal = true;
      },
      error: () => Swal.fire("Error", "Failed to load datasets", "error")
    });
  }

  closeModal() {
    this.showArchiveModal = false;
    this.showDatasetsModal = false;
    this.showAttributesModal = false;
  }
}

