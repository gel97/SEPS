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
    setYear: new Date().getFullYear()
  };
  shapefiles: any[] = [];

  constructor(private shapeFileService: ShapeFileService) { }

  ngOnInit(): void {
    this.loadShapefiles();
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
    this.data.name
  ).subscribe({
    next: (res) => {
      Swal.fire("Success", res.message || "Shapefile uploaded!", "success");

      // Refresh the table immediately
      this.loadShapefiles();

      // Clear inputs
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

      // ✅ also update the <input type="file">
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(this.selectedFile);
      this.fileInput.nativeElement.files = dataTransfer.files;
    }
  }


  loadShapefiles() {
    this.shapeFileService.getAllShapefiles().subscribe({
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
}
