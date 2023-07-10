import { FinancialInstitutionsService } from './../../../../../shared/Trade&_Industry/financial-institutions.service';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';

@Component({
  selector: 'app-financial-institutions',
  templateUrl: './financial-institutions.component.html',
  styleUrls: ['./financial-institutions.component.css'],
})
export class FinancialInstitutionsComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  list_of_category = [
    { id: 1, name_category: 'Commercial Bank' },
    { id: 2, name_category: 'Thrift Bank' },
    { id: 3, name_category: 'Government-owned Bank' },
    { id: 4, name_category: 'Rural Bank' },
    { id: 5, name_category: 'Insurance Company/ Pre-need plans' },
    { id: 6, name_category: 'Cooperative' },
    { id: 7, name_category: 'Lending Investor/ Credit Union' },
    { id: 8, name_category: 'Money Remittance Center/ Pawnshop' },
    { id: 9, name_category: 'Money Changers/ Foreign Exchange' },
    { id: 10, name_category: 'others' },
  ];

  errorinput: any;

  constructor(
    private service: FinancialInstitutionsService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }
  munCityName: string = this.auth.munCityName;
  searchText: string = '';

  toValidate: any = {};
  Financial: any = [];
  barangays: any = [];
  financial: any = {};
  editmodal: any = {};

  message = 'Financial Institutions';

  //Updatelocation:any={};

  // Pagination
  pageSize = 10;
  p: string | number | undefined;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 15, 25, 50, 100];

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
    this.financial = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import().subscribe({
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

  date = new DatePipe('en-PH');
  ngOnInit(): void {
    this.GetListFinancial();
    this.list_of_barangay();
  }

  //searchBar
  onChangeSearch(e: any) {
    this.searchText = e.target.value;
  }

  markerObj: any = {};
  SetMarker(data: any = {}) {
    console.log('lnglat: ', data.longtitude + ' , ' + data.latitude);
    this.markerObj = {
      lat: data.latitude,
      lng: data.longtitude,
      label: data.brgyName.charAt(0),
      brgyName: data.brgyName,
      munCityName: this.munCityName,
      draggable: true,
    };
    this.gmapComponent.setMarker(this.markerObj);
  }

  GetListFinancial() {
    this.service.GetFinancial().subscribe((data) => {
      this.Financial = <any>data;
      // this.Financial=this.Financial.filter((s:any) => s.tag == 1);
      console.log(this.Financial);
    });
  }

  list_of_barangay() {
    this.service.ListBarangay().subscribe((data) => {
      this.barangays = <any>data;
      console.log('fgxtxgcvcgcf', this.barangays);
    });
  }

  Add_Financial() {
    this.toValidate.name =
      this.financial.name == '' || this.financial.name == null ? true : false;
    this.toValidate.category =
      this.financial.category == '' || this.financial.category == null
        ? true
        : false;
    this.toValidate.members =
      this.financial.members == '' || this.financial.members == undefined
        ? true
        : false;
    this.toValidate.totAssets =
      this.financial.totAssets == '' || this.financial.totAssets == undefined
        ? true
        : false;
    this.toValidate.brgyId =
      this.financial.brgyId == '' || this.financial.brgyId == null
        ? true
        : false;

    if (
      this.toValidate.category == true ||
      this.toValidate.name == true ||
      this.toValidate.members == true ||
      this.toValidate.totAssets == true ||
      this.toValidate.brgyI == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.financial.munCityId = this.auth.munCityId;
      this.financial.setYear = this.auth.setYear;
      this.financial.transId = this.date.transform(Date.now(), 'YYMM');
      //this.comm.tag = 1;
      this.service.Add_Financial_Ins(this.financial).subscribe(
        (request) => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          console.log(request);
          this.clearData();
          this.GetListFinancial();

          console.log(request);
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');

          this.financial = {};
          this.Financial.push(request);
        },
        (err) => {
          console.log(err.error);
          this.errorinput = err.error;
        }
      );
    }
  }

  edit_fin(edit_fin: any = {}) {
    this.editmodal = edit_fin;
    this.GetListFinancial();
  }

  //for modal
  UpdateFinancial() {
    this.editmodal.longtitude = this.gmapComponent.markers.lng;
    this.editmodal.latitude = this.gmapComponent.markers.lat;
    this.toValidate.name =
      this.editmodal.name == '' || this.editmodal.name == null ? true : false;
    this.toValidate.category =
      this.editmodal.category == '' || this.editmodal.category == null
        ? true
        : false;
    this.toValidate.members =
      this.editmodal.members == '' || this.editmodal.members == undefined
        ? true
        : false;
    this.toValidate.totAssets =
      this.editmodal.totAssets == '' || this.editmodal.totAssets == undefined
        ? true
        : false;
    this.toValidate.brgyId =
      this.editmodal.brgyId == '' || this.editmodal.brgyId == null
        ? true
        : false;

    if (
      this.toValidate.category == true ||
      this.toValidate.name == true ||
      this.toValidate.members == true ||
      this.toValidate.totAssets == true ||
      this.toValidate.brgyI == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.Update_Financial_Ins(this.editmodal).subscribe({
        next: (_data) => {
          this.GetListFinancial();
        },
      });

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been updated',
        showConfirmButton: false,
        timer: 1000,
      });
      document.getElementById('exampleModal_EDIT')?.click();
      this.editmodal = {};
      this.GetListFinancial();
    }
  }

  deleteFinancial(transId: any, index: any) {
    Swal.fire({
      text: 'Do you want to remove this file?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.value) {
        for (let i = 0; i < this.Financial.length; i++) {
          if (this.Financial[i].transId == transId) {
            this.Financial.splice(i, 1);
            Swal.fire('Deleted!', 'Your file has been removed.', 'success');
          }
        }

        this.service.Delete_Financial_Ins(transId).subscribe((_data) => {
          this.GetListFinancial();
          // this.Financial.splice(index,1);

          // this.Init();
          // this.mjr = {};
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
      // this.Init();
      // this.mjr = {};
    });
  }

  onTableDataChange2(page: any) {
    //paginate
    console.log(page);
    this.p = page;
  }
  onTableSizeChange2(event: any) {
    //paginate
    this.tableSize = event.target.value;
    this.p = 1;
  }
}
