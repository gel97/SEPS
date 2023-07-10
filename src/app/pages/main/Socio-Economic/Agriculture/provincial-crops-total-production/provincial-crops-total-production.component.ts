import { AgricultureProdService } from 'src/app/shared/Socio-Economic/Agriculture/agricultureProd.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';

@Component({
  selector: 'app-provincial-crops-total-production',
  templateUrl: './provincial-crops-total-production.component.html',
  styleUrls: ['./provincial-crops-total-production.component.css'],
})
export class ProvincialCropsTotalProductionComponent implements OnInit {
  constructor(
    private service: AgricultureProdService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  Commodities: any = [];
  commo: any = {};
  toValidate: any = {};

  message = 'Provincial Crops Total Production';

  list_of_Commodities = [
    { id: 1, name: 'Rice' },
    { id: 2, name: 'Corn' },
    { id: 3, name: 'Corn' },
    { id: 4, name: 'Coconut (with husk)	' },
    { id: 5, name: 'Banana - Cavendish' },
    { id: 6, name: 'Banana - Local	' },
    { id: 7, name: 'Banana - Other cultivar	' },
    { id: 8, name: 'Banana - Saba/Cardava	' },
    { id: 9, name: 'Mango' },
    { id: 10, name: 'Durian' },
    { id: 11, name: 'Coffee (Dried Berries)' },
    { id: 12, name: 'Cacao' },
    { id: 13, name: 'Vegetables' },
    { id: 14, name: 'Oil Palm (Fresh Fruit Bunch)' },
    { id: 15, name: 'Rubber (Cuplump)' },
    { id: 16, name: 'Abaca' },
    { id: 17, name: 'Other Crops	' },
  ];

  add_Crops_Total: boolean = true;

  munCityName: string = this.auth.munCityName;
  setYear = this.auth.activeSetYear;
  munCityId = this.auth.munCityId;
  menuId = '10';

  isCheck: boolean = false;
  visible: boolean = true;
  not_visible: boolean = true;

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }

  clearData() {
    this.commo = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }

  ngOnInit(): void {
    this.List_Commodities();
  }

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import(this.menuId).subscribe({
      next: (data) => {
        this.ngOnInit();
        if(data.length === 0){
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
        }
        else
        {
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

  parentMethod() {
    // alert('parent Method');
    this.commo = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }

  List_Commodities() {
    this.service
      .GetListAgricultureProd(this.menuId, this.setYear, this.munCityId)
      .subscribe((data) => {
        console.log('Checked_Data', data);
        this.Commodities = <any>data;
      });
  }

  Add_Commodities() {
    this.toValidate.commodities =
      this.commo.commodities == '' || this.commo.commodities == null
        ? true
        : false;
    this.toValidate.totalProd =
      this.commo.totalProd == '' || this.commo.totalProd == undefined
        ? true
        : false;
    // this.toValidate.area = this.commo.area == "" || this.commo.area == undefined ? true : false;

    if (
      this.toValidate.commodities == true ||
      this.toValidate.totalProd == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.commo.menuId = this.menuId;
      this.commo.setYear = this.setYear;
      this.commo.munCityId = this.munCityId;
      this.service.AddAgricultureProd(this.commo).subscribe((data) => {
        if (!this.isCheck) {
          this.closebutton.nativeElement.click();
        }
        console.log(data);
        this.clearData();
        this.List_Commodities();
        Swal.fire('Good job!', 'Data Added Successfully!', 'success');
        this.List_Commodities();
        this.commo = {};
      });
    }
  }

  Edit_Commodities() {
    this.toValidate.commodities =
      this.commo.commodities == '' || this.commo.commodities == null
        ? true
        : false;
    this.toValidate.totalProd =
      this.commo.totalProd == '' || this.commo.totalProd == undefined
        ? true
        : false;
    // this.toValidate.area = this.commo.area == "" || this.commo.area == undefined ? true : false;

    if (
      this.toValidate.commodities == true ||
      this.toValidate.totalProd == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.EditAgricultureProd(this.commo).subscribe({
        next: (_data) => {
          this.List_Commodities();
          this.clearData();
          this.closebutton.nativeElement.click();
        },
      });

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been updated',
        showConfirmButton: false,
        timer: 1000,
      });
      document.getElementById('ModalAdd')?.click();
      this.commo = {};
    }
  }

  delete(transId: any, index: any) {
    Swal.fire({
      text: 'Do you want to remove this file?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.value) {
        for (let i = 0; i < this.Commodities.length; i++) {
          if (this.Commodities[i].transId == transId) {
            this.Commodities.splice(i, 1);
            Swal.fire('Deleted', 'Removed successfully', 'success');
          }
        }

        this.service.DeleteAgricultureProd(transId).subscribe((_data) => {
          this.List_Commodities();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
}
