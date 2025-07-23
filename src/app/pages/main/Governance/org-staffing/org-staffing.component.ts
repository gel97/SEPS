import { CityOfficialService } from '../../../../shared/Governance/city-official.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { OrgStaffingService } from 'src/app/shared/Governance/org-staffing.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { ImportComponent } from 'src/app/components/import/import.component';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { ImagesService } from 'src/app/services/image.service';
import { concatMap, delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageCropperComponent,
  LoadedImage,
} from 'ngx-image-cropper';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { SourceService } from 'src/app/shared/Source/Source.Service';

@Component({
  selector: 'app-org-staffing',
  templateUrl: './org-staffing.component.html',
  styleUrls: ['./org-staffing.component.css'],
})
export class OrgStaffingComponent implements OnInit {
  @ViewChild('closeModal')
  closeModal!: ElementRef;
  @ViewChild('fileInputtt') fileInputtt!: ElementRef;

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: OrgStaffingService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService,
    private imageService: ImagesService,
    private SourceService: SourceService
  ) {}
  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  @ViewChild(ImportComponent)
  private importComponent!: ImportComponent;
  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  munCityName: string = this.auth.munCityName;
  toValidate: any = {};
  org: any = {};
  vieworg: any = [];
  inputDisabled: boolean = false;
  editO: any = {};
  isLoading: boolean = true;

  imageChangedEventt: any = '';
  croppedImagee: any = '';
  file!: File;
  fileName: any = '';
  progressvalue = 0;
  sources: any = [];
  newSource: any = {};
  selectedSourceId: number | null = null;
  showAddForm: boolean = true;

  date = new DatePipe('en-PH');
  ngOnInit(): void {
    this.Init();
    this.GetOrgImage();
    this.getSources();
  }
  getSources(): void {
    const setYear = this.auth.activeSetYear;
    const munCityId = this.auth.munCityId;
    const sourceFor = 'Organization/Staffing Patterns';

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

    const sourceFor = 'Organization/Staffing Patterns'; // 👈 assign your module name

    // ✅ Add metadata
    this.newSource.munCityId = this.auth.munCityId;
    this.newSource.setYear = this.auth.activeSetYear;
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

  triggerFileInput() {
    this.fileInputtt.nativeElement.click();
  }
  GetOrgImage() {
    this.imageService
      .GetOrg(this.auth.munCityId)
      .pipe(
        concatMap((item) => of(item).pipe(delay(2000))),
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          console.error('There was an error!', error);
          if (error) {
            this.isLoading = false;
          }
          return of();
        })
      )
      .subscribe((response) => {
        const reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onload = () => {
          if (reader.result) {
            this.croppedImagee = reader.result.toString();
            this.isLoading = false;
          }
        };
      });
  }
  dataURItoBlob(dataURI: any) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  fileChangeEventt(event: any): void {
    this.imageChangedEventt = event;
    this.fileName = event.target.files[0].name;
  }
  imageCroppedd(event: ImageCroppedEvent) {
    this.croppedImagee = event.base64;
  }
  fullImageAspectRatio: number = 1; // Initialize with a default value
  imageLoadedd(image: LoadedImage) {
    console.log('imageLoadedd ', image);
    this.fullImageAspectRatio =
      image.original.size.width / image.original.size.height;
  }
  cropperReadyy(crop: Dimensions) {
    console.log('crop: ', crop);
  }
  loadImageFailedd() {}
  updateImage() {
    const imageBlob = this.dataURItoBlob(this.croppedImagee);
    const imageFile = new File([imageBlob], this.fileName);
    this.file = imageFile;
    this.ProceedUpload();
    console.log('imageFile: ', this.file);
  }
  ProceedUpload() {
    let formdata = new FormData();
    formdata.append('file', this.file, this.auth.munCityId);

    this.imageService
      .UploadOrg(formdata)
      .pipe(
        map((events) => {
          switch (events.type) {
            case HttpEventType.UploadProgress:
              this.progressvalue = Math.round(
                (events.loaded / events.total!) * 100
              );
              break;
            case HttpEventType.Response:
              Swal.fire({
                icon: 'success',
                title: 'Image uploaded successfully!',
                showConfirmButton: false,
                timer: 1500,
              });
              this.closeModal.nativeElement.click();
              console.log('HttpEventType.Response : Upload completed');
              setTimeout(() => {
                this.progressvalue = 0;
              }, 2500);
              break;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops, something went wrong!',
            showConfirmButton: false,
            timer: 1500,
          });
          return 'failed';
        })
      )
      .subscribe();
  }

  GeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService.GetOrgStaffReport(this.pdfComponent.data).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Organization/ Staffing Patterns by Municipality/City`,
              fontSize: 14,
              bold: true,
            },
            {
              text: `Year: ${response.year}`,
              fontSize: 14,
              bold: true,
              alignment: 'right',
            },
          ],
        });

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Municipality/ City',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Permanent Employees',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Temporary',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Co-Terminus',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Elected',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Casual',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Job Order',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Contractual',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Casual SEF',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'School Board',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Contract of Services',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Others',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
        ]);

        reports.forEach((a: any) => {
          let _district: string = '1st';
          if (a.district === 2) {
            _district = '2nd';
          }
          tableData.push([
            {
              text: `${_district} Congressional District `,
              colSpan: 13,
              alignment: 'left',
              fillColor: '#526D82',
              marginLeft: 5,
              fontSize: 9,
            },
          ]);
          a.data.forEach((b: any, index2: any) => {
            tableData.push([
              {
                text: index2 + 1,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munCityName,
                fillColor: '#FFFFFF',
                fontSize: 9,
              },
              {
                text: b.munData.permanentNo,
                fillColor: '#FFFFFF',
                fontSize: 9,
                alignment: 'center',
              },
              {
                text: b.munData.temporary,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.coTerminus,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.elected,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.casual,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.jobOrder,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.contractual,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.casualSef,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.schoolBoard,
                fillColor: '#FFFFFF',
                fontSize: 9,
                alignment: 'center',
              },
              {
                text: b.munData.contractService,
                fillColor: '#FFFFFF',
                fontSize: 9,
                alignment: 'center',
              },
              {
                text: b.munData.others,
                fillColor: '#FFFFFF',
                fontSize: 9,
              },
            ]);
          });

          tableData.push([
            {
              text: 'SUBTOTAL',
              fillColor: '#9DB2BF',
              colSpan: 2,
              marginLeft: 5,
              fontSize: 9,
            },
            {},
            {
              text: a.subTotal.permanentNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.temporary,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.coTerminus,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.elected,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.casual,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.jobOrder,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.contractual,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.casualSef,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.schoolBoard,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.contractService,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.others,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
          ]);
        });

        tableData.push([
          {
            text: 'GRANDTOTAL',
            fillColor: '#F1C93B',
            colSpan: 2,
            marginLeft: 5,
            fontSize: 9,
          },
          {},
          {
            text: grandTotal.permanentNo,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.temporary,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.coTerminus,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.elected,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.casual,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.jobOrder,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.contractual,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.casualSef,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.schoolBoard,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.contractService,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.others,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
        ]);

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: [
              25,
              '*',
              '*',
              '*',
              '*',
              '*',
              '*',
              '*',
              '*',
              '*',
              '*',
              '*',
              '*',
            ],
            body: tableData,
          },
          layout: 'lightHorizontalLines',
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        let isPortrait = false;
        this.pdfService.GeneratePdf(data, isPortrait, '');
        console.log(data);
      },
    });
  }

  viewData: boolean = false;
  parentMethod() {
    // alert('parent Method');
    this.viewData = true;
  }

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import().subscribe({
      next: (data) => {
        this.Init();
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

  message = 'Organization & Staffing Pattern';

  import() {
    let importData = 'Organization / Staffing Pattern';
    // this.view = this.importComponent.viewData;
    this.importComponent.import(importData);
  }

  Init() {
    this.org.munCityId = this.auth.munCityId;
    this.org.setYear = this.auth.activeSetYear;
    this.service.GetOrg().subscribe((data) => {
      this.vieworg = <any>data;
      // this.import();
      //textfield(enable/disabled)
      this.inputDisabled = this.vieworg != null ? true : false;
      if (this.vieworg != null) {
        this.org = this.vieworg;
        this.viewData = true;
      } else {
        this.viewData = false;
      }

      console.log(data);
    });
  }

  AddOrg() {
    this.toValidate.permanentNo = this.org.permanentNo == null ? true : false;
    this.toValidate.temporary = this.org.temporary == undefined ? true : false;
    this.toValidate.coTerminus =
      this.org.coTerminus == undefined ? true : false;
    this.toValidate.elected = this.org.elected == undefined ? true : false;
    this.toValidate.casual = this.org.casual == null ? true : false;
    this.toValidate.jobOrder = this.org.jobOrder == undefined ? true : false;
    this.toValidate.contractual =
      this.org.contractual == undefined ? true : false;
    this.toValidate.casualSef = this.org.casualSef == undefined ? true : false;
    this.toValidate.schoolBoard = this.org.schoolBoard == null ? true : false;
    this.toValidate.contractService =
      this.org.contractService == undefined ? true : false;
    this.toValidate.others =
      this.org.others == '' || this.org.others == undefined ? true : false;

    if (
      this.toValidate.permanentNo == true ||
      this.toValidate.temporary == true ||
      this.toValidate.coTerminus == true ||
      this.toValidate.elected == true ||
      this.toValidate.casual == true ||
      this.toValidate.jobOrder == true ||
      this.toValidate.contractual == true ||
      this.toValidate.casualSef == true ||
      this.toValidate.schoolBoard == true ||
      this.toValidate.contractService == true ||
      this.toValidate.contractual == true ||
      this.toValidate.others == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.org.munCityId = this.auth.munCityId;
      this.org.setYear = this.auth.setYear;
      // this.org.tag = 1;
      this.service.AddOrg(this.org).subscribe((request) => {
        console.log(request);
        Swal.fire('Good job!', 'Data Added Successfully!', 'success');
        this.Init();
        this.org = {};
        this.vieworg.push(request);
      });
    }
  }

  editorg(editorg: any = {}) {
    this.editO = editorg;
    //passing the data from table (modal)
    this.Init();
  }

  //for modal
  update() {
    this.toValidate.permanentNo = this.org.permanentNo == null ? true : false;
    this.toValidate.temporary = this.org.temporary == undefined ? true : false;
    this.toValidate.coTerminus =
      this.org.coTerminus == undefined ? true : false;
    this.toValidate.elected = this.org.elected == undefined ? true : false;
    this.toValidate.casual = this.org.casual == null ? true : false;
    this.toValidate.jobOrder = this.org.jobOrder == undefined ? true : false;
    this.toValidate.contractual =
      this.org.contractual == undefined ? true : false;
    this.toValidate.casualSef = this.org.casualSef == undefined ? true : false;
    this.toValidate.schoolBoard = this.org.schoolBoard == null ? true : false;
    this.toValidate.contractService =
      this.org.contractService == undefined ? true : false;
    this.toValidate.others =
      this.org.others == '' || this.org.others == undefined ? true : false;

    if (
      this.toValidate.permanentNo == true ||
      this.toValidate.temporary == true ||
      this.toValidate.coTerminus == true ||
      this.toValidate.elected == true ||
      this.toValidate.casual == true ||
      this.toValidate.jobOrder == true ||
      this.toValidate.contractual == true ||
      this.toValidate.casualSef == true ||
      this.toValidate.schoolBoard == true ||
      this.toValidate.contractService == true ||
      this.toValidate.contractual == true ||
      this.toValidate.others == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.org.tag = 1;
      this.service.UpdateOrg(this.editO).subscribe({
        next: (_data) => {
          // this.editModal();
        },
      });

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been updated',
        showConfirmButton: false,
        timer: 1000,
      });
      document.getElementById('exampleModalLong')?.click();
      this.editO = {};
    }
  }

  //   delete(munCityId:any, setYear:any, index:any){
  //     Swal.fire({
  //       text: 'Do you want to remove this file?',
  //       icon: 'warning',
  //       showConfirmButton: true,
  //       showCancelButton: true,
  //       confirmButtonText: 'Yes, remove it!'
  //     }).then((result)=>{

  //       if(result.value){
  //         for(let i = 0; i < this.org.length;i++){
  //           if(this.org[i].munCityId == munCityId){
  //             this.org.splice(i,1);
  //             Swal.fire(
  //               'Deleted',
  //               'Removed successfully',
  //               'success'
  //             );
  //           }
  //         }

  //         this.service.Delete_Org(munCityId,setYear).subscribe(_data =>{

  //         })
  //       } else if (result.dismiss === Swal.DismissReason.cancel){

  //       }

  //     })
  //  }
  delete(transId: any) {
    Swal.fire({
      text: 'Do you want to remove this file',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.Delete_Org(transId).subscribe({
          next: (_data) => {
            this.Init();
          },
          error: (err) => {
            this.Init();
            this.org = {};
          },
        });
        Swal.fire('Deleted!', 'Your file has been removed.', 'success');
      }
    });
  }
}
