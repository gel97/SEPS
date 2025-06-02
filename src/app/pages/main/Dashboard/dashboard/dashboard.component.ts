import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageCropperComponent,
  LoadedImage,
} from 'ngx-image-cropper';
import { ImagesService } from 'src/app/services/image.service';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { NewsService } from 'src/app/shared/Tools/news.service';
import { Router } from '@angular/router';
import { ProvOfficialService } from 'src/app/shared/Governance/prov-official.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('closeModal')
  closeModal!: ElementRef;

  imageChangedEvent: any = '';
  img: any = '';
  croppedImage: any = '';
  file!: File;
  fileName: any = '';
  progressvalue = 0;
  totalGovernanceData: any; // Variable to store the governance data total
  totalSocioEcAct: any;
  cityData: any;
  constructor(
    private router: Router,
    private newsService: NewsService,
    private auth: AuthService,
    private baseUrl: BaseUrl,
    private imagesService: ImagesService,
    private service: ProvOfficialService
  ) {}

  isGuest: any;
  Prov: any = {};
  ProOfficial: any = [];

  ngOnInit(): void {
    this.GetGovernanceData();
    this.GetSocioEcAct();
    this.isGuest = localStorage.getItem('guest');

    // if(this.auth.munCityId === null){
    //   this.router.navigate(['dashboard/ddn']);
    // }
    this.cityData = [
      { name: 'Asuncion', percent: 100 },
      { name: 'Braulio E. Dujali', percent: 100 },
      { name: 'Carmen', percent: 100 },
      { name: 'City Of Panabo', percent: 100 },
      { name: 'City Of Tagum', percent: 99.51 },
      { name: 'Island Garden City Of Samal', percent: 100 },
      { name: 'Kapalong', percent: 100 },
      { name: 'New Corella', percent: 100 },
      { name: 'San Isidro', percent: 100 },
      { name: 'Santo Tomas', percent: 100 },
      { name: 'Talaingod', percent: 100 },
    ];

    this.imagesService
      .GetImage(
        this.auth.munCityId === 'null' && this.isGuest
          ? 'ddn'
          : this.auth.munCityId
      )
      .pipe(
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          console.error('There was an error!', error);
          return of();
        })
      )
      .subscribe((response) => {
        const reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onload = () => {
          if (reader.result) {
            this.croppedImage = reader.result.toString();
          }
        };
      });

    this.GetNews();
  }
  GetGovernanceData() {
    this.service.GetGovernance().subscribe({
      next: (response) => {
        this.totalGovernanceData = response; // Assign API response to totalGovernanceData
        console.log(
          'Total Governance Data:',
          this.totalGovernanceData.TotalData
        ); // Check if the value is correct
      },
      error: (error) => {
        console.error('Error fetching governance data:', error);
      },
    });
  }
  GetSocioEcAct() {
    this.service.GetSocioEcAct().subscribe({
      next: (response) => {
        this.totalSocioEcAct = response; // Assign API response to totalGovernanceData
        console.log('Total Socio-EcAct Data:', this.totalSocioEcAct.TotalData); // Check if the value is correct
      },
      error: (error) => {
        console.error('Error fetching governance data:', error);
      },
    });
  }

  listNews: any = [];
  listNewsData: any = [];

  GetNews() {
    this.newsService.GetNews().subscribe({
      next: (response) => {
        this.listNewsData = <any>response;
      },
      error: (error) => {},
      complete: () => {
        console.log(this.listNewsData);
        if (this.auth.munCityId === 'null' && this.isGuest) {
          this.listNewsData.forEach((a: any) => {
            if (a.munCityId === 'DDN') {
              this.listNews.push(a);
            }
          });
        } else {
          this.listNewsData.forEach((a: any) => {
            if (a.munCityId === this.auth.munCityId) {
              this.listNews.push(a);
            }
          });
        }
      },
    });
  }

  get filterNews() {
    if (this.auth.o_munCityId) {
      return this.listNews.filter((a: any) => a.hidden == 0);
    } else {
      return this.listNews.filter((a: any) => a.hidden == 0 && a.isAdmin == 0);
    }
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

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.fileName = event.target.files[0].name;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.img = event.base64;
  }
  imageLoaded(image: LoadedImage) {}
  cropperReady(crop: Dimensions) {}
  loadImageFailed() {}
  updateImage() {
    this.croppedImage;
    const imageBlob = this.dataURItoBlob(this.croppedImage);
    const imageFile = new File([imageBlob], this.fileName);
    this.file = imageFile;
    this.ProceedUpload();
  }
  ProceedUpload() {
    let formdata = new FormData();
    formdata.append('file', this.file, this.auth.munCityId);

    this.imagesService
      .UploadImage(formdata)
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
  handleImageError(event: any) {
    event.target.src = 'assets/img/image.png';
    event.target.height = '100';
    event.target.width = '100';
  }
}
