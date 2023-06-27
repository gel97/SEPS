import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ManEstabService } from 'src/app/shared/Trade&_Industry/man-estab.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';

@Component({
  selector: 'app-manufacturing-establishments',
  templateUrl: './manufacturing-establishments.component.html',
  styleUrls: ['./manufacturing-establishments.component.css'],
})
export class ManufacturingEstablishmentsComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  searchText: string = '';

  get filteredItems() {
    return this.list_of_Business.filter(
      (item) => item.categoryId == this.estab.category
    );
  }
  get EDITfilteredItems() {
    return this.list_of_Business.filter(
      (item) => item.categoryId == this.editmodal.category
    );
  }

  message = 'Manufacturing Establishments';

  constructor(
    private service: ManEstabService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  munCityName: string = this.auth.munCityName;

  toValidate: any = {};
  ManEstab: any = [];
  barangays: any = [];
  estab: any = {};
  editmodal: any = {};
  Updatelocation: any = {};

  // Pagination
  pageSize2 = 10;
  p2: string | number | undefined;
  count2: number = 1;
  tableSize2: number = 20;
  tableSizes2: any = [20, 40, 60, 80, 100];

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
    this.estab = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }

  date = new DatePipe('en-PH');
  ngOnInit(): void {
    this.GetListManEstab();
    this.list_of_barangay();
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

  //searchBar
  onChangeSearch(e: any) {
    this.searchText = e.target.value;
  }

  GetListManEstab() {
    this.service.GetManEstab().subscribe((data) => {
      this.ManEstab = <any>data;
      this.ManEstab = this.ManEstab.filter((s: any) => s.tag == 1);
      console.log(this.ManEstab);
    });
  }

  list_of_barangay() {
    this.service.ListBarangay().subscribe((data) => {
      this.barangays = <any>data;
      console.log('fgxtxgcvcgcf', this.barangays);
    });
  }

  AddEstablishment() {
    this.toValidate.name =
      this.estab.name == '' || this.estab.name == undefined ? true : false;
    this.toValidate.category =
      this.estab.category == '' || this.estab.category == null ? true : false;
    this.toValidate.brgyId =
      this.estab.brgyId == '' || this.estab.brgyId == null ? true : false;
    this.toValidate.type =
      this.estab.type == '' || this.estab.type == null ? true : false;
    this.toValidate.workersNo =
      this.estab.workersNo == '' || this.estab.workersNo == undefined
        ? true
        : false;

    if (
      this.toValidate.name == true ||
      this.toValidate.category == true ||
      this.toValidate.type == true ||
      this.toValidate.workersNo == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.estab.munCityId = this.auth.munCityId;
      this.estab.setYear = this.auth.setYear;
      this.estab.transId = this.date.transform(Date.now(), 'YYMM');
      this.estab.tag = 1;
      this.service.AddManEstab(this.estab).subscribe((request) => {
        if (!this.isCheck) {
          this.closebutton.nativeElement.click();
        }
        console.log(request);
        this.clearData();
        this.GetListManEstab();

        console.log(request);
        Swal.fire('Good job!', 'Data Added Successfully!', 'success');
        // document.getElementById('close')?.click();
        this.estab = {};
        this.ManEstab.push(request);
      });
    }
  }

  edit_estab(edit_estab: any = {}) {
    this.editmodal = edit_estab;
    this.GetListManEstab();
  }

  //for modal
  UpdateManEstab() {
    this.editmodal.longtitude = this.gmapComponent.markers.lng;
    this.editmodal.latitude = this.gmapComponent.markers.lat;
    //this.editmodal.setYear = this.auth.activeSetYear;

    this.toValidate.name =
      this.editmodal.name == '' || this.editmodal.name == undefined
        ? true
        : false;
    this.toValidate.category =
      this.editmodal.category == '' || this.editmodal.category == null
        ? true
        : false;
    this.toValidate.brgyId =
      this.editmodal.brgyId == '' || this.editmodal.brgyId == null
        ? true
        : false;
    this.toValidate.type =
      this.editmodal.type == '' || this.editmodal.type == null ? true : false;
    this.toValidate.workersNo =
      this.editmodal.workersNo == '' || this.editmodal.workersNo == undefined
        ? true
        : false;

    if (
      this.toValidate.name == true ||
      this.toValidate.category == true ||
      this.toValidate.type == true ||
      this.toValidate.workersNo == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.UpdateManEstab(this.editmodal).subscribe({
        next: (_data) => {
          this.GetListManEstab();
        },
      });

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been updated',
        showConfirmButton: false,
        timer: 1000,
      });
      document.getElementById('ModalEdit')?.click();
      this.editmodal = {};
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
        for (let i = 0; i < this.ManEstab.length; i++) {
          if (this.ManEstab[i].transId == transId) {
            this.ManEstab.splice(i, 1);
            Swal.fire('Deleted', 'Removed successfully', 'success');
          }
        }

        this.service.DeleteManEstab(transId).subscribe((_data) => {
          this.GetListManEstab();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  onTableDataChange2(page: any) {
    //paginate
    console.log(page);
    this.p2 = page;
  }
  onTableSizeChange2(event: any) {
    //paginate
    this.tableSize2 = event.target.value;
    this.p2 = 1;
  }
  list_of_category = [
    { id: 1, name_category: 'Food processing' },
    { id: 2, name_category: 'Agricultural products' },
    { id: 3, name_category: 'Garments and embroidery' },
    { id: 4, name_category: 'Crafts/ Furnitures' },
    { id: 5, name_category: 'Ceramics/ Paper/ Plastic' },
    { id: 6, name_category: 'Chemical and pharmaceutical' },
    { id: 7, name_category: 'Jewelry' },
    { id: 8, name_category: 'Other non-metallic products' },
  ];

  list_of_Business = [
    { id: 1, name_business: 'Bakeries/ Bakeshop', categoryId: 1 },
    { id: 2, name_business: 'Meat products/ processed meat', categoryId: 1 },
    {
      id: 3,
      name_business: 'Fish products/ fish drying and smoking',
      categoryId: 1,
    },
    { id: 4, name_business: 'Ice Plant', categoryId: 1 },
    {
      id: 5,
      name_business: 'Ice cream/ Ice drops/ frozen products',
      categoryId: 1,
    },
    { id: 6, name_business: 'Native Delicacies', categoryId: 1 },
    { id: 7, name_business: 'Sweet Preserves', categoryId: 1 },
    { id: 8, name_business: 'Nuts/ Kornik/ Chicharon', categoryId: 1 },
    { id: 9, name_business: 'Noodles / Bihon products', categoryId: 1 },
    { id: 10, name_business: 'Vinegar/ patis/ bagoong making', categoryId: 1 },
    { id: 11, name_business: 'Juices and Beverages', categoryId: 1 },
    {
      id: 12,
      name_business: 'Poultry and farm products processing',
      categoryId: 1,
    },
    { id: 13, name_business: 'Other processed food', categoryId: 1 },

    {
      id: 14,
      name_business: 'Agricultural equipments and supplies',
      categoryId: 2,
    },
    { id: 15, name_business: 'Feeds manufacturing', categoryId: 2 },
    { id: 16, name_business: 'Fertilizer manufacturing', categoryId: 2 },

    { id: 17, name_business: 'Gowns and Barong', categoryId: 3 },
    { id: 18, name_business: 'Ladies Wear', categoryId: 3 },
    { id: 19, name_business: 'Shirts/ Pants Manufacturing', categoryId: 3 },
    { id: 20, name_business: 'Needlecraft/ Embroidery', categoryId: 3 },
    { id: 21, name_business: 'Knitting', categoryId: 3 },
    {
      id: 22,
      name_business: 'Bed Sheets/ Pillow cases/ Curtains',
      categoryId: 3,
    },
    { id: 23, name_business: 'Dress making/ undergarments', categoryId: 3 },

    { id: 24, name_business: 'Woodcrafts/ Wooden Furniture', categoryId: 4 },
    { id: 25, name_business: 'Casket/coffin making', categoryId: 4 },
    { id: 26, name_business: 'Sash manufacturing', categoryId: 4 },
    { id: 27, name_business: 'Rattan products manufacturing', categoryId: 4 },
    { id: 28, name_business: 'Bamboo products', categoryId: 4 },
    { id: 29, name_business: 'Steel products/ Iron works', categoryId: 4 },
    { id: 30, name_business: 'Handicrafts/ Shellcraft', categoryId: 4 },
    { id: 31, name_business: 'Upholstery', categoryId: 4 },

    { id: 32, name_business: 'Ceramics / pottery', categoryId: 5 },
    { id: 33, name_business: 'Plastic wares', categoryId: 5 },
    { id: 34, name_business: 'Paper Products ', categoryId: 5 },
    { id: 35, name_business: 'Glasswares', categoryId: 5 },

    { id: 36, name_business: 'Laboratories', categoryId: 6 },
    { id: 37, name_business: 'Chemical industries', categoryId: 6 },
    { id: 38, name_business: 'Soap making', categoryId: 6 },
    { id: 39, name_business: 'Candle making', categoryId: 6 },
    { id: 40, name_business: 'Tobacco/ Cigarettes', categoryId: 6 },

    { id: 41, name_business: 'Fancy Jewelry maker', categoryId: 7 },
    { id: 42, name_business: 'Jewelry tools and equipments', categoryId: 7 },
    { id: 43, name_business: 'Fine Jewelries', categoryId: 7 },
    { id: 44, name_business: 'Fashion Accessories', categoryId: 7 },

    { id: 45, name_business: 'Cement Factories', categoryId: 8 },
    { id: 46, name_business: 'Marble Craft', categoryId: 8 },
    { id: 47, name_business: 'Pyro-tecnics/ Firecrackers', categoryId: 8 },
    { id: 48, name_business: 'Rubber/ Leather products', categoryId: 8 },
    {
      id: 49,
      name_business: 'Concrete products/ Tiles/ Hollowblocks',
      categoryId: 8,
    },
    { id: 50, name_business: 'Foam Products', categoryId: 8 },
  ];
}
