import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {ImagesService} from 'src/app/services/image.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { Dimensions, ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  @ViewChild('closeModal')
  closeModal!: ElementRef; 

  imageChangedEventt: any = '';
  croppedImagee: any = '';
  file!:File;
  fileName:any='';
  munCityId:any='112301';
  progressvalue = 0;

  constructor(private service:AuthService,private router: Router, private baseUrl: BaseUrl, private imagesService: ImagesService ) { }

  _userData:any = {};
  userInfo:any={};

  ngOnInit(): void {
    this._userData = this.service.getUserData();
    this.userInfo = JSON.parse( this._userData);
    this.imagesService.GetLogo(this.munCityId).pipe().subscribe(response => { 
      const reader = new FileReader();
      reader.readAsDataURL(response);
      reader.onload = () => {
        if (reader.result) {
          this.croppedImagee = reader.result.toString();
        }   
      };
        console.log("image", response)
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

  fileChangeEventt(event: any): void {
      this.imageChangedEventt = event;
      this.fileName = event.target.files[0].name;
      console.log(event.target.files)

  }
  imageCroppedd(event: ImageCroppedEvent) {
      this.croppedImagee = event.base64;
  }
  imageLoadedd(image: LoadedImage) {
    console.log("image: ", image)

      // show cropper
  }
  cropperReadyy(crop: Dimensions) {
    console.log("crop: ", crop)

      // cropper ready
  }
  loadImageFailedd() {
      // show message
  }
  updateImage(){
    //this.imagesService.uploadImagee(this.croppedImagee).subscribe();

    const imageBlob = this.dataURItoBlob(this.croppedImagee);
    const imageFile = new File([imageBlob], this.fileName);
    this.file = imageFile;
    this.ProceedUpload();
    console.log("imageFile: ", this.file)
  }
  ProceedUpload() {
    let formdata = new FormData();
    formdata.append("file", this.file, this.munCityId)

    this.imagesService.UploadLogo(formdata).pipe(
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
  signOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/seps/guest/home']);

  }


}
