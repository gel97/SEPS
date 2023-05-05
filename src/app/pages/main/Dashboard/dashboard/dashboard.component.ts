import { Component, ElementRef, OnInit, ViewChild, HostListener  } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { Dimensions, ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import {ImagesService} from 'src/app/services/image.service';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { NewsService } from 'src/app/shared/Tools/news.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('closeModal')
  closeModal!: ElementRef; 
  isElementVisible: boolean = true;
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Logic to determine visibility based on scroll position
    if (window.pageYOffset > 10000) {
      this.isElementVisible = false;
    } else {
      this.isElementVisible = true;
    }
  }

  imageChangedEvent: any = '';
  img:any ='';
  croppedImage: any = '';
  file!:File;
  fileName:any='';
  progressvalue = 0;

  listNews:any = [];

  constructor(private auth:AuthService, private baseUrl: BaseUrl, private imagesService: ImagesService, private newsService: NewsService) { 
    
  }
  
  ngOnInit(): void {
    this.GetImage();
    this.GetNews();
  }

  GetNews()
  {
    this.newsService.GetNews().subscribe({
      next: (response) =>
      {
        this.listNews = (<any> response);
      },
      error: (error)=>{

      },
      complete: ()=>{

      }
    });
  }

  get filterNews()
  {
    return this.listNews.filter((a: any) => a.hidden == 0);

  }

  GetImage()
  {
    this.imagesService.GetImage(this.auth.munCityId).pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
      console.error('There was an error!', error);    
      return of();
  })).subscribe(response => { 

    const reader = new FileReader();
    reader.readAsDataURL(response);
    reader.onload = () => {
      if (reader.result) {
        this.croppedImage = reader.result.toString();
      }   
    };
    });
  }
 
  dataURItoBlob(dataURI:any) {
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
  imageLoaded(image: LoadedImage) {

  }
  cropperReady(crop: Dimensions) {
  }
  loadImageFailed() {
  }
  updateImage(){
    this.croppedImage;
    const imageBlob = this.dataURItoBlob(this.croppedImage);
    const imageFile = new File([imageBlob], this.fileName);
    this.file = imageFile;
    this.ProceedUpload();
  }
  ProceedUpload() {
    let formdata = new FormData();
    formdata.append("file", this.file, this.auth.munCityId)

    this.imagesService.UploadImage(formdata).pipe(
      map(events => {
        switch (events.type) {
          case HttpEventType.UploadProgress:
            this.progressvalue = Math.round(events.loaded / events.total! * 100);
            break;
          case HttpEventType.Response:
            Swal.fire({
              icon: 'success',
              title: 'Image uploaded successfully!',
              showConfirmButton: false,
              timer: 1500
            })
            this.closeModal.nativeElement.click()
           console.log("HttpEventType.Response : Upload completed")
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
          timer: 1500
        })
        return ("failed");
      })

    ).subscribe();
  }
  handleImageError(event: any) {
      event.target.src = 'assets/img/image.png';
      event.target.height = '100';
      event.target.width = '100';
  }
 
 
}
