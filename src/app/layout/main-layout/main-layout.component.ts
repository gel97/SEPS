import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ImagesService } from 'src/app/services/image.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { Dimensions, ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import Swal from 'sweetalert2';
import { Observable, of } from "rxjs";
import { concatMap, delay } from "rxjs/operators";
import * as $ from 'jquery';
import { Router,NavigationEnd  } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  @ViewChild('closeModal')
  closeModal!: ElementRef;
  fakeObservable = of('dummy').pipe(delay(100000));

  imageChangedEventt: any = '';
  croppedImagee: any = '';
  file!: File;
  fileName: any = '';
  progressvalue = 0;
  munCityName: any = '';
  isLoading: boolean = true;
  set_year:any;
  active_set_year:any;
  currentUrl:any;


  constructor(private service: AuthService, private router: Router, private baseUrl: BaseUrl, private imagesService: ImagesService,
    private socialAuthService: SocialAuthService, private modifyService: ModifyCityMunService, private location: Location) { 
    console.log(router.url);

    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // ).subscribe(event => {

    //   console.log(event);
    // });
    this.currentUrl = this.location.path();

  }

  _userData: any = {};
  userInfo: any = {};
  guest:any;

  ngOnInit(): void {
    console.log("currentUrl: ",this.currentUrl)
    this.guest = localStorage.getItem("guest");

    this.set_year = this.service.setYear;
    this.active_set_year = this.service.activeSetYear;
    this._userData = this.service.getUserData();
    this.munCityName = this.guest && this.service.munCityId === "null"?'Province of Davao del Norte' : this.service.munCityName;
    this.userInfo = JSON.parse(this._userData);


      this.imagesService.GetLogo(this.guest && this.service.munCityId === "null" ?"ddn":this.service.munCityId).pipe(concatMap(item => of(item).pipe(delay(2000))), catchError((error: any, caught: Observable<any>): Observable<any> => {
        console.error('There was an error!', error);  
        if(error){
          this.isLoading = false;
        }  
        return of();
    })).subscribe(response => {
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

  isMatchURL:boolean = false;
  isMatchUrl(text:string){
    if (this.currentUrl.includes(text)) {
      console.log(`The main string contains the specific text "${text}".`);
      return true;
    } else {
      console.log(`The main string does not contain the specific text "${text}".`);
      return false;
    }
  }

  modifyCityMun(cityMunName:string){
    return this.modifyService.ModifyText(cityMunName);
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
  imageLoadedd(image: LoadedImage) {
  }
  cropperReadyy(crop: Dimensions) {
    console.log("crop: ", crop)

  }
  loadImageFailedd() {

  }
  updateImage() {
    const imageBlob = this.dataURItoBlob(this.croppedImagee);
    const imageFile = new File([imageBlob], this.fileName);
    this.file = imageFile;
    this.ProceedUpload();
    console.log("imageFile: ", this.file)
  }
  ProceedUpload() {
    let formdata = new FormData();
    formdata.append("file", this.file, this.service.munCityId)

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
    //localStorage.removeItem('token'); 
    this.service.clearSession();
    this.socialAuthService.signOut();
    this.router.navigate(['login']);
  }

  toggleSidebar() {
      $("body").toggleClass("sidebar-toggled");
      $(".sidebar").toggleClass("toggled");
      if ($(".sidebar").hasClass("toggled")) {
      };  
  }
  


}
