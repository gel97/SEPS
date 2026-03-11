import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { SubmitService } from 'src/app/shared/Submissions/Submit.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { PdfService } from 'src/app/services/pdf.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { ImportComponent } from 'src/app/components/import/import.component';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFile: File | null = null;

  data = {
  name: '',
  setYear: new Date().getFullYear(),
  munCityId: ''  // ✅ default, update this from session/login
};
  munCityName: string = ''

  SubmitFiles: any[] = [];
  attributes: any[] = [];
  attributeKeys: string[] = [];
  archiveFiles: string[] = [];
  datasets: Record<string, string[]> = {};
  objectKeys = Object.keys;

  reuploadRecord: any = null;
  showArchiveModal = false;
  showDatasetsModal = false;
  showAttributesModal = false;
  selectedDatasetName: string = '';
  currentRecNo: number | null = null;
  municipalities: any[] = [];
  selectedMunicipality: string = ''; 
  f: any;
  activeUpload: number | null = null;

  constructor(private SubmitService: SubmitService, private auth: AuthService) { }

  ngOnInit(): void {
    this.data.munCityId = this.auth.munCityId;  
    this.munCityName = this.auth.munCityName;  

    if (this.data.munCityId === 'DDN') { 
    this.loadMunicipalities();
  }

  this.loadSubmit();
  }
  loadMunicipalities() {
  this.SubmitService.ListMunCity().subscribe({
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
loadSubmit() {
  const filterId = this.data.munCityId === 'DDN' 
    ? this.selectedMunicipality 
    : this.data.munCityId;

  this.SubmitService.getAllSubmit(filterId).subscribe({
    next: (files) => this.SubmitFiles = files,
    error: (err) => console.error('Failed to load shapefiles', err)
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
   onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];


  if (this.reuploadRecord && this.selectedFile) {
    this.processReupload();
  }
}
processReupload() {
  if (!this.selectedFile || !this.reuploadRecord) return;

  Swal.fire({
    title: 'Confirm Re-upload',
    text: `Are you sure you want to replace the file for ${this.reuploadRecord.fileName}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, replace it!',
    cancelButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {
   
      this.SubmitService.uploadSubmit(
        this.selectedFile!,
        this.reuploadRecord.setYear,
        this.reuploadRecord.munCityId
      ).subscribe({
        next: (res) => {
          Swal.fire("Success", "File replaced successfully!", "success");
          this.loadSubmit(); // Refresh table
          this.reuploadRecord = null; // Reset
          this.selectedFile = null;
        },
        error: (err) => {
          console.error("Re-upload error:", err);
          Swal.fire("Error", "Replacement failed.", "error");
        }
      });
    } else {
      this.reuploadRecord = null;
      this.selectedFile = null;
    }
  });
}
   onUpload() {
  if (!this.selectedFile) {
    Swal.fire("Error", "Please select a file first.", "error");
    return;
  }
  this.SubmitService.uploadSubmit(
    this.selectedFile,
    this.data.setYear,
    this.data.munCityId
  ).subscribe({
    next: (res) => {
      Swal.fire("Success", `File uploaded successfully for year ${res.year || ''}!`, "success");
      
      this.loadSubmit();
      this.selectedFile = null; 
      if (this.fileInput) {
        this.fileInput.nativeElement.value = ''; 
      } 
    },
    error: (err) => {
      console.error("Upload error:", err);
      const errorMsg = err?.error || err?.message || "Unknown error";
      Swal.fire("Error", "Upload failed: " + errorMsg, "error");
    }
  });
}
  
   onReupload(file: any) {
  console.log("Re-uploading for:", file.recNo);
  this.reuploadRecord = file; 
  this.fileInput.nativeElement.click(); 
}
onCancel(recNo: number) {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to cancel this Submissions? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Yes, Cancel it!",
    cancelButtonText: "No, keep it"
  }).then((result) => {
    if (result.isConfirmed) {
      this.SubmitService.cancelSubmit(recNo).subscribe({
        next: (res) => {
          Swal.fire("Cancelled", "Your submission has been successfully cancelled.", "success");
          this.loadSubmit(); // Kani para mo-refresh ang table dayon
        },
        error: (err) => {
          Swal.fire("Error", "Unable to cancel. The report may have already been processed.", "error");
        }
      });
    }
  });
}
toggleUpload(recNo: number){
  if (this.activeUpload === recNo) {
    this.activeUpload = null;
  } else {
    this.activeUpload = recNo;
  }
}
uploadCategory(event: any, file: any) {
  const category = event.target.value;

  console.log("Uploading", file.fileName, "to", category);

  // call your API here
}



}
