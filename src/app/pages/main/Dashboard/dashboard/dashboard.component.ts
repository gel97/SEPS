import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { Dimensions, ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import {ImagesService} from 'src/app/services/image.service';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('closeModal')
  closeModal!: ElementRef; 

  imageChangedEvent: any = '';
  img:any ='';
  croppedImage: any = '';
  file!:File;
  fileName:any='';
  munCityId:any='112301';
  progressvalue = 0;

  constructor(private baseUrl: BaseUrl, private imagesService: ImagesService) { 
    
  }


  ngOnInit(): void {
    console.log(this.baseUrl.apiurl)
    this.imagesService.GetImage(this.munCityId).pipe().subscribe(response => { 
    const reader = new FileReader();
    reader.readAsDataURL(response);
    reader.onload = () => {
      if (reader.result) {
        this.croppedImage = reader.result.toString();
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

  fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
      this.fileName = event.target.files[0].name;
      console.log(event.target.files)

  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      this.img = event.base64;
      //console.log("imageCropped: ", this.croppedImage)
     // console.log("file", event.base64)

  }
  imageLoaded(image: LoadedImage) {
    console.log("image: ", image)

      // show cropper
  }
  cropperReady(crop: Dimensions) {
    console.log("crop: ", crop)

      // cropper ready
  }
  loadImageFailed() {
      // show message
  }
  updateImage(){
    const imageBlob = this.dataURItoBlob(this.croppedImage);
    const imageFile = new File([imageBlob], this.fileName);
    this.file = imageFile;
    this.ProceedUpload();
    console.log("imageFile: ", this.file)
  }
  ProceedUpload() {
    let formdata = new FormData();
    formdata.append("file", this.file, this.munCityId)

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
}
