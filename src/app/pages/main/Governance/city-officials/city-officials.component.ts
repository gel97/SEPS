import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { CityOfficialService } from 'src/app/shared/Governance/city-official.service'; // import service
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { ImportComponent } from 'src/app/components/import/import.component';

import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';

@Component({
  selector: 'app-city-officials',
  templateUrl: './city-officials.component.html',
  styleUrls: ['./city-officials.component.css'],
})
export class CityOfficialsComponent implements OnInit {
  isLoading: boolean = true;
  isCheck: boolean = false;
  visible: boolean = true;
  not_visible: boolean = true;
  // required: boolean = true;

  @ViewChild(ImportComponent)
  private importComponent!: ImportComponent;
  navigationInterceptor: any;

  constructor(
    private service: CityOfficialService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService,
    private renderer: Renderer2,
    private closebuttons: ElementRef,
    private router: Router
  ) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  } // private service: + name of service that you've created
  toValidate: any = {};
  Official: any = [];
  city: any = {};
  city2: any = {};
  Edit: any = {};
  updateOfficial: any = {};
  editModal: any = {};
  AddModal: any = {};
  positions: any = [];
  munCityName: string = this.auth.munCityName;

  pageSize = 25;
  p: string | number | undefined;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 25, 50, 100];

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import().subscribe({
      next: (data) => {
        this.Init();
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

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }

  date = new DatePipe('en-PH');
  ngOnInit(): void {
    this.Init();
  }

  Init() {
    this.getPositions();
    this.getOfficials();
  }
  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }
  getOfficials() {
    this.service.GetOfficial().subscribe((data) => {
      this.Official = <any>data;
      // this.import();
    });
  }

  message = 'City Officials';

  // importData: string = 'City Official';
  import() {
    let importData = 'City Official';
    this.importComponent.import(importData);
  }

  getPositions() {
    this.service.GetMunPosition().subscribe((data) => {
      this.positions = <any>data;
    });
  }

  addOfficial() {
    this.toValidate.name =
      this.city.name == '' || this.city.name == null ? true : false;
    this.toValidate.seqNo =
      this.city.seqNo == '' || this.city.seqNo == undefined ? true : false;
    this.toValidate.term =
      this.city.term == '' || this.city.term == null ? true : false;
    this.toValidate.contact =
      this.city.contact == '' || this.city.contact == undefined ? true : false;
    if (
      this.toValidate.name == true ||
      this.toValidate.seqNo == true ||
      this.toValidate.term == true ||
      this.toValidate.contact == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.city.munCityId = this.auth.munCityId;
      this.city.setYear = this.auth.activeSetYear;
      this.city.transId = this.date.transform(Date.now(), 'YYMM');
      this.city.tag = 1;
      this.city.setYear = this.auth.activeSetYear;
      this.city.position = '';
      this.service.AddOfficial(this.city).subscribe(
        (_data) => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          console.log(_data);
          this.clearData();
          this.getOfficials();
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
          this.getOfficials();
          this.city = {};
        },
        (err) => {
          Swal.fire('ERROR!', 'Data Already Exist', 'error');
        }
      );
    }
  }

  //for modal
  update() {
    this.toValidate.name =
      this.editModal.name == '' || this.editModal.name == null ? true : false;
    this.toValidate.seqNo =
      this.editModal.seqNo == '' || this.editModal.seqNo == undefined
        ? true
        : false;
    this.toValidate.term =
      this.editModal.term == '' || this.editModal.term == null ? true : false;
    this.toValidate.contact =
      this.editModal.contact == '' || this.editModal.contact == undefined
        ? true
        : false;
    if (
      this.toValidate.name == true ||
      this.toValidate.seqNo == true ||
      this.toValidate.term == true ||
      this.toValidate.contact == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.UpdateOfficial(this.editModal).subscribe({
        next: (_data) => {
          this.getOfficials();
          this.editModal = {};
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
      this.getOfficials();
    }
  }

  delete(official2: any = {}) {
    Swal.fire({
      text: 'Do you want to remove this file?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.value) {
        official2.tag = -1;
        this.service.UpdateOfficial(official2).subscribe((_data) => {
          Swal.fire('Deleted!', 'Your file has been removed.', 'success');
          this.Init();
          this.city = {};
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
      this.Init();
      this.city = {};
    });
  }

  onTableDataChange(page: any) {
    //paginate
    console.log(page);
    this.p = page;
    this.Init();
  }
  onTableSizeChange(event: any) {
    //paginate
    this.tableSize = event.target.value;
    this.p = 1;
    this.Init();
  }
  clearData() {
    this.city = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }
}
