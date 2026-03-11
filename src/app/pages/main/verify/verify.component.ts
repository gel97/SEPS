import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SubmitService } from 'src/app/shared/Submissions/Submit.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { PdfService } from 'src/app/services/pdf.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { ImportComponent } from 'src/app/components/import/import.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
})
export class VerifyComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFile: File | null = null;

  data = {
    name: '',
    setYear: new Date().getFullYear(),
    munCityId: '',
  };
  munCityName: string = '';

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

  selectedFileToView: any = null;
  validationRemarks: string = '';
  isModalOpen: boolean = false;

  excelData: any[] = [];
  excelHeaders: string[] = [];
  isLoadingFile: boolean = false;
  excelHtml: string = '';

  searchText: string = '';
  fromDate: string = '';
  toDate: string = '';

filteredFiles: any[] = [];
isFullScreen: boolean = false;

  constructor(
    private Auth: AuthService,
    private SubmitService: SubmitService,
  ) {}

  ngOnInit(): void {
    const rawId = this.Auth.munCityId; 
    const userType = this.Auth.userType; 

    const year = this.data.setYear; 
  this.fromDate = `${year}-01-01`; 
  this.toDate = `${year}-12-31`;   

    if (rawId === 'Validator' && userType.includes('-')) {
      // Kuhaon ang number human sa gitling (-)
      this.data.munCityId = userType.split('-')[1];
    } else {
      this.data.munCityId = rawId;
    }

    this.munCityName = this.Auth.munCityName;

    if (this.data.munCityId === 'DDN') {
      this.loadMunicipalities();
    }

    this.loadSubmit();
  }
  loadMunicipalities() {
    this.SubmitService.ListMunCity().subscribe({
      next: (res: any) => {
        console.log('Municipalities response:', res);

        if (Array.isArray(res)) {
          this.municipalities = res;
        } else if (res?.data && Array.isArray(res.data)) {
          this.municipalities = res.data;
        } else {
          console.warn('Unexpected municipalities response format', res);
          this.municipalities = [];
        }

        
        this.municipalities = this.municipalities.map((m: any) => ({
          munCityId: m.munCityId,
          munCityName: (m.munCityName || '').trim(),
        }));
      },
      error: (err) => console.error('Failed to load municipalities', err),
    });
  }

  loadSubmit() {
    const filterId =
      this.data.munCityId === 'DDN'
        ? this.selectedMunicipality
        : this.data.munCityId;

    this.SubmitService.getAllValidate(filterId).subscribe({
      next: (files) => (this.SubmitFiles = files),
      error: (err) => console.error('Failed to load data', err),
    });
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.add('drag-over');
  }
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.remove('drag-over');
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.remove('drag-over');

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
  onViewAndValidate(file: any) {
    this.selectedFileToView = file;
    this.validationRemarks = file.remarks || '';
    this.isModalOpen = true;
    this.isLoadingFile = true;
    this.excelHtml = '';

    this.SubmitService.downloadFile(file.recNo).subscribe({
      next: (blob: Blob) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
          let maxRow = 0;
          let maxCol = 0;

          Object.keys(worksheet).forEach((key) => {
            if (key[0] === '!') return; // Laktawan ang metadata
            const cell = XLSX.utils.decode_cell(key);
            if (cell.r > maxRow) maxRow = cell.r;
            if (cell.c > maxCol) maxCol = cell.c;
          });

          worksheet['!ref'] = XLSX.utils.encode_range({
            s: { r: 0, c: 0 },
            e: { r: maxRow, c: maxCol },
          });

          let htmlString = XLSX.utils.sheet_to_html(worksheet, {
            header: '',
            footer: '',
            editable: false,
          });

          this.excelHtml = htmlString.replace(
            /<table/g,
            '<table class="table table-bordered table-sm m-0"',
          );

          this.isLoadingFile = false;
        };
        reader.readAsArrayBuffer(blob);
      },
      error: (err) => {
        console.error('Download Error:', err);
        this.isLoadingFile = false;
        this.isModalOpen = false;
        Swal.fire('Error', 'Could not load file for preview.', 'error');
      },
    });
  }

  processValidation(isApproved: boolean) {
    if (!this.selectedFileToView) return;

    const statusText = isApproved ? 'Approve' : 'Reject';

    Swal.fire({
      title: `Confirm ${statusText}`,
      text: `Are you sure you want to ${statusText.toLowerCase()} this report?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed',
      confirmButtonColor: isApproved ? '#28a745' : '#dc3545',
    }).then((result) => {
      if (result.isConfirmed) {
        this.SubmitService.validateReport(
          this.selectedFileToView.recNo,
          this.validationRemarks,
          isApproved,
        ).subscribe({
          next: (res) => {
            Swal.fire('Success', `Report has been ${statusText}d.`, 'success');
            this.isModalOpen = false;
            this.loadSubmit();
          },
          error: (err) => {
            Swal.fire('Error', 'Failed to update report.', 'error');
          },
        });
      }
    });
  }
  processReupload() {
    if (!this.selectedFile || !this.reuploadRecord) return;

    Swal.fire({
      title: 'Confirm Re-upload',
      text: `Are you sure you want to replace the file for ${this.reuploadRecord.fileName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, replace it!',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.SubmitService.uploadSubmit(
          this.selectedFile!,
          this.reuploadRecord.setYear,
          this.reuploadRecord.munCityId,
        ).subscribe({
          next: (res) => {
            Swal.fire('Success', 'File replaced successfully!', 'success');
            this.loadSubmit(); 
            this.reuploadRecord = null; 
            this.selectedFile = null;
          },
          error: (err) => {
            console.error('Re-upload error:', err);
            Swal.fire('Error', 'Replacement failed.', 'error');
          },
        });
      } else {
        this.reuploadRecord = null;
        this.selectedFile = null;
      }
    });
  }
  onUpload() {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Please select a file first.', 'error');
      return;
    }

    this.SubmitService.uploadSubmit(
      this.selectedFile,
      this.data.setYear,
      this.data.munCityId,
    ).subscribe({
      next: (res) => {
        Swal.fire('Success', res.message || 'File uploaded!', 'success');

        this.loadSubmit();

        this.selectedFile = null;
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }

        this.data.setYear = new Date().getFullYear();
      },
      error: (err) => {
        console.error('Upload error:', err);
        Swal.fire(
          'Error',
          'Upload failed: ' +
            (err?.error?.title || err?.message || 'Unknown error'),
          'error',
        );
      },
    });
  }
  onReupload(file: any) {
    console.log('Re-uploading for:', file.recNo);
    this.reuploadRecord = file;
    this.fileInput.nativeElement.click();
  }
  onCancel(recNo: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel this Submissions? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Cancel it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.SubmitService.cancelSubmit(recNo).subscribe({
          next: (res) => {
            Swal.fire(
              'Cancelled',
              'Your submission has been successfully cancelled.',
              'success',
            );
            this.loadSubmit();
          },
          error: (err) => {
            Swal.fire(
              'Error',
              'Unable to cancel. The report may have already been processed.',
              'error',
            );
          },
        });
      }
    });
  }
applyFilters() {
  this.filteredFiles = this.SubmitFiles.filter(file => {
    const realDate = new Date(file.createdAt);
    const virtualFileDate = new Date(
      Number(file.setYear), 
      realDate.getMonth(), 
      realDate.getDate()
    );

    const from = this.fromDate ? new Date(this.fromDate) : null;
    const to = this.toDate ? new Date(this.toDate) : null;

    const matchesSearch =
      file.fileName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      file.status?.toLowerCase().includes(this.searchText.toLowerCase());
    const matchesFromDate = from ? virtualFileDate >= from : true;
    const matchesToDate = to ? virtualFileDate <= to : true;

    return matchesSearch && matchesFromDate && matchesToDate;
  });
}
resetFilters() {
  this.searchText = '';
  this.fromDate = '';
  this.toDate = '';
  this.filteredFiles = [...this.SubmitFiles];
}
getTimeAgo(date: string): string {

  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minute(s) ago`;
  if (hours < 24) return `${hours} hour(s) ago`;
  return `${days} day(s) ago`;
}
}
