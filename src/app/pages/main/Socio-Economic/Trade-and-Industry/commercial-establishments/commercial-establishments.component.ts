import { CommercialEstablishmentService } from './../../../../../shared/Trade&_Industry/commercial-establishment.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';

@Component({
  selector: 'app-commercial-establishments',
  templateUrl: './commercial-establishments.component.html',
  styleUrls: ['./commercial-establishments.component.css'],
})
export class CommercialEstablishmentsComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  searchText: string = '';

  constructor(
    private service: CommercialEstablishmentService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  message = 'Commercial Establishments';

  munCityName: string = this.auth.munCityName;

  toValidate: any = {};
  ComEstab: any = [];
  barangays: any = [];
  comm: any = {};
  editmodal: any = {};

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
    this.comm = {};
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
      complete: () => {
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
      },
    });
  }

  get filteredItems() {
    return this.list_of_Business.filter(
      (item) => item.categoryId == this.comm.category
    );
  }
  get EDTfilteredItems() {
    return this.list_of_Business.filter(
      (item) => item.categoryId == this.editmodal.category
    );
  }

  date = new DatePipe('en-PH');
  ngOnInit(): void {
    this.GetListCommercialEstab();
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

  GetListCommercialEstab() {
    this.service.Get_Com_Estab().subscribe((data) => {
      this.ComEstab = <any>data;
      this.ComEstab = this.ComEstab.filter((s: any) => s.tag == 1);
      console.log(this.ComEstab);
    });
  }

  list_of_barangay() {
    this.service.ListBarangay().subscribe((data) => {
      this.barangays = <any>data;
      console.log('fgxtxgcvcgcf', this.barangays);
    });
  }
  Add_Com_Estab() {
    this.toValidate.brgyId =
      this.comm.brgyId == '' || this.comm.brgyId == null ? true : false;
    this.toValidate.permitNo =
      this.comm.permitNo == '' || this.comm.permitNo == undefined
        ? true
        : false;
    this.toValidate.estabName =
      this.comm.estabName == '' || this.comm.estabName == undefined
        ? true
        : false;
    this.toValidate.category =
      this.comm.category == '' || this.comm.category == undefined
        ? true
        : false;
    this.toValidate.status =
      this.comm.status == '' || this.comm.status == undefined ? true : false;
    this.toValidate.lineBusiness =
      this.comm.lineBusiness == '' || this.comm.lineBusiness == undefined
        ? true
        : false;
    this.toValidate.owner =
      this.comm.owner == '' || this.comm.owner == undefined ? true : false;

    if (
      this.toValidate.brgyId == true ||
      this.toValidate.permitNo == true ||
      this.toValidate.estab == true ||
      this.toValidate.category == true ||
      this.toValidate.status == true ||
      this.toValidate.lineBusiness == true ||
      this.toValidate.owner
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.comm.munCityId = this.auth.munCityId;
      this.comm.setYear = this.auth.setYear;
      this.comm.transId = this.date.transform(Date.now(), 'YYMM');
      //this.comm.tag = 1;
      this.service.Add_Com_Estab(this.comm).subscribe((request) => {
        if (!this.isCheck) {
          this.closebutton.nativeElement.click();
        }
        console.log(request);
        this.clearData();
        this.GetListCommercialEstab();

        console.log(request);
        Swal.fire('Good job!', 'Data Added Successfully!', 'success');

        this.comm = {};
        this.ComEstab.push(request);
      });
    }
  }

  edit_estab(edit_estab: any = {}) {
    this.editmodal = edit_estab;
    this.GetListCommercialEstab();
  }

  //for modal
  UpdateCommercial() {
    this.editmodal.longtitude = this.gmapComponent.markers.lng;
    this.editmodal.latitude = this.gmapComponent.markers.lat;

    this.toValidate.brgyId =
      this.editmodal.brgyId == '' || this.editmodal.brgyId == null
        ? true
        : false;
    this.toValidate.permitNo =
      this.editmodal.permitNo == '' || this.editmodal.permitNo == undefined
        ? true
        : false;
    this.toValidate.estabName =
      this.editmodal.estabName == '' || this.editmodal.estabName == undefined
        ? true
        : false;
    this.toValidate.category =
      this.editmodal.category == '' || this.editmodal.category == undefined
        ? true
        : false;
    this.toValidate.status =
      this.editmodal.status == '' || this.editmodal.status == undefined
        ? true
        : false;
    this.toValidate.lineBusiness =
      this.editmodal.lineBusiness == '' ||
      this.editmodal.lineBusiness == undefined
        ? true
        : false;
    this.toValidate.owner =
      this.editmodal.owner == '' || this.editmodal.owner == undefined
        ? true
        : false;

    if (
      this.toValidate.brgyId == true ||
      this.toValidate.permitNo == true ||
      this.toValidate.estab == true ||
      this.toValidate.category == true ||
      this.toValidate.status == true ||
      this.toValidate.lineBusiness == true ||
      this.toValidate.owner == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.Update_Com_Estab(this.editmodal).subscribe({
        next: (_data) => {
          // if (!this.isCheck) {
          //   this.closebutton.nativeElement.click();
          // }
          this.clearData();
          this.GetListCommercialEstab();
          this.editmodal = {};
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
        for (let i = 0; i < this.ComEstab.length; i++) {
          if (this.ComEstab[i].transId == transId) {
            this.ComEstab.splice(i, 1);
            Swal.fire('Deleted!', 'Your file has been removed.', 'success');
          }
        }

        this.service.Delete_Com_Estab(transId).subscribe((_data) => {
          // this.MajorAct.splice(index,1);

          this.GetListCommercialEstab();
          // this.mjr = {};
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
      // this.Init();
      // this.mjr = {};
    });
  }

  onTableDataChange(page: any) {
    //paginate
    console.log(page);
    this.p = page;
  }
  onTableSizeChange(event: any) {
    //paginate
    this.tableSize = event.target.value;
    this.p = 1;
  }
  list_of_status = [
    { id: 1, status: 'NEW' },
    { id: 2, status: 'RENEW' },
    { id: 3, status: 'DELINQUENT' },
    { id: 4, status: 'RETIRED' },
  ];

  list_of_category = [
    { id: 1, name_category: 'Agriculture related business' },
    { id: 2, name_category: 'Food and Beverages Business' },
    { id: 3, name_category: 'Merchandisers/ Retailers' },
    { id: 4, name_category: 'Transport-related Trading and Services' },
    { id: 5, name_category: 'Personal Stores and Services' },
    { id: 6, name_category: 'Dress Shop' },
    { id: 7, name_category: 'Health and Personal care services' },
    { id: 8, name_category: 'Charity Foundation	' },
    { id: 9, name_category: 'Computer/ Electronics/ Cellphones/ Gadgets' },
    { id: 10, name_category: 'Recreational Facilities' },
    { id: 11, name_category: 'Professional Services' },
    { id: 12, name_category: 'Construction related trading and services' },
    { id: 13, name_category: 'Print-related business' },
    { id: 14, name_category: 'Utility Services / Facilities' },
    { id: 15, name_category: 'Professional Services-Bookkeeping Services' },
    { id: 16, name_category: 'Power Sub-Station	' },
    { id: 17, name_category: '	Services Installation of CCTV Camera' },
    { id: 18, name_category: 'Software and Other Electronic Devices	' },
    { id: 19, name_category: 'Aerial Spraying Services' },
  ];

  list_of_Business = [
    { id: 1, name_business: 'Feeds dealer/ retailer', categoryId: 1 },
    {
      id: 2,
      name_business: 'Agricultural Equipment And Supplies',
      categoryId: 1,
    },
    { id: 3, name_business: 'Fertilizer dealers/ retailers', categoryId: 1 },
    { id: 4, name_business: 'Fishing supplies', categoryId: 1 },
    { id: 5, name_business: 'Poultry/ Livestock Farm', categoryId: 1 },
    { id: 6, name_business: 'Poultry supply', categoryId: 1 },
    { id: 7, name_business: 'Ricemills', categoryId: 1 },
    { id: 8, name_business: 'Seed dealers', categoryId: 1 },
    { id: 9, name_business: 'Slaughterhouses', categoryId: 1 },
    { id: 10, name_business: 'Warehouse', categoryId: 1 },
    { id: 11, name_business: 'Garden plants retailers', categoryId: 1 },
    { id: 12, name_business: 'Banana Growers', categoryId: 1 },
    { id: 13, name_business: 'Fish Cages', categoryId: 1 },
    {
      id: 14,
      name_business: 'Banana Tissue Culture Propagator',
      categoryId: 1,
    },
    { id: 15, name_business: 'Copra Trader', categoryId: 1 },
    { id: 16, name_business: 'Banana Exporter', categoryId: 1 },

    {
      id: 17,
      name_business: 'Bakeshop, bread products retailers',
      categoryId: 2,
    },
    {
      id: 18,
      name_business: 'Cakes, candies  chocolates and pastries retailers',
      categoryId: 2,
    },
    {
      id: 19,
      name_business: 'Carinderias/Eateries/ Barbeque house',
      categoryId: 2,
    },
    { id: 20, name_business: 'Catering Services', categoryId: 2 },
    { id: 21, name_business: 'Egg dealer/ retailers', categoryId: 2 },
    { id: 22, name_business: 'Fast food/ Burger stands', categoryId: 2 },
    { id: 23, name_business: 'Fish retailer/ vendor', categoryId: 2 },
    { id: 24, name_business: 'Food and drinks retailers', categoryId: 2 },
    { id: 25, name_business: 'Fruits and vegetable retailers', categoryId: 2 },
    {
      id: 26,
      name_business: 'Ice cream/Frozen products retailers',
      categoryId: 2,
    },
    { id: 27, name_business: 'KTV/ Restobar/Disco Bar', categoryId: 2 },
    {
      id: 28,
      name_business: 'Lechon (manok, baka, baboy) retailers',
      categoryId: 2,
    },
    {
      id: 29,
      name_business: 'Liquors and Beverages delivery services',
      categoryId: 2,
    },
    {
      id: 30,
      name_business: 'Meatshop/ dressed chicken retailers',
      categoryId: 2,
    },
    {
      id: 31,
      name_business: 'Peddlers/ Packed meals and beverages',
      categoryId: 2,
    },
    { id: 32, name_business: 'Pizza Parlors', categoryId: 2 },
    {
      id: 33,
      name_business: 'Processed food/ processed meat retailers',
      categoryId: 2,
    },
    { id: 34, name_business: 'Restaurants', categoryId: 2 },
    { id: 35, name_business: 'Rice dealers/ retailers', categoryId: 2 },
    { id: 36, name_business: 'Seafoods dealer/ ratailers', categoryId: 2 },
    {
      id: 37,
      name_business: 'Softdrinks and beer wholesalers/ retailers',
      categoryId: 2,
    },
    { id: 38, name_business: 'Vegetable vendors', categoryId: 2 },
    { id: 39, name_business: 'Water Filling Stations', categoryId: 2 },
    {
      id: 40,
      name_business: 'Food Processors (Cassava, banana, etc.)',
      categoryId: 2,
    },

    {
      id: 41,
      name_business: 'Acetylene/ Oxygen/ Industrial gas dealers',
      categoryId: 3,
    },
    { id: 42, name_business: 'Appliance Dealer/ Retailer', categoryId: 3 },
    { id: 43, name_business: 'Buy and sell/ Trading', categoryId: 3 },
    { id: 44, name_business: 'Convinience store', categoryId: 3 },
    { id: 45, name_business: 'Department Store', categoryId: 3 },
    { id: 46, name_business: 'Drugstores/ Pharmacy', categoryId: 3 },
    { id: 47, name_business: 'Dry Goods', categoryId: 3 },
    {
      id: 48,
      name_business: 'Firearms/  ammo dealers/ retailers',
      categoryId: 3,
    },
    { id: 50, name_business: 'Fire extinguishers dealers', categoryId: 3 },
    { id: 51, name_business: 'Furniture shops', categoryId: 3 },
    { id: 52, name_business: 'General Merchandising', categoryId: 3 },
    { id: 53, name_business: 'Glassware retailers', categoryId: 3 },
    { id: 54, name_business: 'Grocery stores', categoryId: 3 },
    { id: 55, name_business: 'Home decor shops/ Antique shops', categoryId: 3 },
    { id: 56, name_business: 'Industrial products retailers', categoryId: 3 },
    {
      id: 57,
      name_business: 'Junkshops /Scrap materials buy and sell',
      categoryId: 3,
    },
    { id: 58, name_business: 'LPG dealers/ retailers', categoryId: 3 },
    { id: 59, name_business: 'Money changers', categoryId: 3 },
    { id: 60, name_business: 'Plasticware retailers', categoryId: 3 },
    { id: 61, name_business: 'Retail Stores/ Shops', categoryId: 3 },
    { id: 62, name_business: 'Sari-sari stores', categoryId: 3 },
    { id: 63, name_business: 'School And Office Supplies', categoryId: 3 },
    { id: 64, name_business: 'Soap and detergent retailers', categoryId: 3 },
    { id: 65, name_business: 'Sporting goods retailers', categoryId: 3 },
    { id: 66, name_business: 'Rice Retailer', categoryId: 3 },
    { id: 67, name_business: 'Herbal Food Products', categoryId: 3 },

    {
      id: 68,
      name_business: 'Auto Supply/ Car and Jeep Parts and accesories',
      categoryId: 4,
    },
    {
      id: 69,
      name_business: 'Auto detailing services/ upholstery',
      categoryId: 4,
    },
    { id: 70, name_business: 'Auto-repair shops', categoryId: 4 },
    { id: 71, name_business: 'Car wash services', categoryId: 4 },
    {
      id: 72,
      name_business: 'Fabrication/ Machine shops/Calibration Services',
      categoryId: 4,
    },
    { id: 73, name_business: 'Gasoline Stations', categoryId: 4 },
    { id: 74, name_business: 'Hauling services', categoryId: 4 },
    { id: 75, name_business: 'Motor works', categoryId: 4 },
    { id: 76, name_business: 'Motorcycle / Car dealer/ Sales', categoryId: 4 },
    {
      id: 77,
      name_business: 'Motorcycle/Bicycle Parts And Supplies',
      categoryId: 4,
    },
    { id: 78, name_business: 'Surplus spare parts retailers', categoryId: 4 },
    { id: 79, name_business: 'Tire/ Battery supply', categoryId: 4 },
    { id: 80, name_business: 'Towing services', categoryId: 4 },
    { id: 81, name_business: 'Transport equipment rentals', categoryId: 4 },
    { id: 82, name_business: 'Transport services', categoryId: 4 },
    { id: 83, name_business: 'Trucking services', categoryId: 4 },
    { id: 84, name_business: 'Vulcanizing shops', categoryId: 4 },
    { id: 85, name_business: 'Emission Test Center', categoryId: 4 },

    {
      id: 86,
      name_business: 'Beauty Parlor/Barber Shop/ Facial and body care salons',
      categoryId: 5,
    },
    { id: 87, name_business: 'Bags And Footwear Store', categoryId: 5 },
    { id: 88, name_business: 'Balloons And Party Needs', categoryId: 5 },
    {
      id: 89,
      name_business: 'Beauty products and accessories retailers',
      categoryId: 5,
    },
    { id: 90, name_business: 'Flower Shop', categoryId: 5 },
    { id: 91, name_business: 'Garments/ Upholstery services', categoryId: 5 },
    {
      id: 92,
      name_business: 'Gift Shops/ Toy retailers/ Bazaars',
      categoryId: 5,
    },
    {
      id: 93,
      name_business: 'Jewelry Shops/store/ repair shops',
      categoryId: 5,
    },
    { id: 94, name_business: 'Laundry Shop  ', categoryId: 5 },
    {
      id: 95,
      name_business: 'Music/ entertainment stores and services',
      categoryId: 5,
    },
    {
      id: 96,
      name_business: 'Party/ Wedding planning services',
      categoryId: 5,
    },
    { id: 97, name_business: 'Perfume retailers', categoryId: 5 },
    {
      id: 98,
      name_business: 'Prepaid cards retailer/ reloading stations',
      categoryId: 5,
    },
    { id: 99, name_business: 'RTW retailers', categoryId: 5 },
    { id: 100, name_business: 'Shoe/ bag repairs', categoryId: 5 },
    { id: 101, name_business: 'Spa and Massage Parlor', categoryId: 5 },
    { id: 102, name_business: 'Tailoring', categoryId: 5 },
    { id: 103, name_business: 'Travel/ tour agencies', categoryId: 5 },
    { id: 104, name_business: 'Video rental/ videoke rental', categoryId: 5 },
    { id: 105, name_business: 'Tattoo Shop', categoryId: 5 },

    { id: 106, name_business: 'Diagnostic Clinic', categoryId: 7 },
    { id: 107, name_business: 'Dental Clinic', categoryId: 7 },
    { id: 108, name_business: 'Medical Clinic', categoryId: 7 },
    { id: 109, name_business: 'Medical Laboratory', categoryId: 7 },
    { id: 110, name_business: 'Nursing homes', categoryId: 7 },
    { id: 111, name_business: 'Optical clinic', categoryId: 7 },
    {
      id: 112,
      name_business: 'Veterinary Clinic/ products and services',
      categoryId: 7,
    },
    { id: 113, name_business: 'Private Hospital', categoryId: 7 },
    { id: 114, name_business: 'Veterinary Supplies retailers', categoryId: 7 },

    { id: 115, name_business: 'Cell Phone store', categoryId: 9 },
    {
      id: 116,
      name_business: 'Cellphone shops, repairs and accessories',
      categoryId: 9,
    },
    { id: 117, name_business: 'Computer services and repairs', categoryId: 9 },
    {
      id: 118,
      name_business: 'Computer shops/ ICT parts sales ',
      categoryId: 9,
    },
    { id: 119, name_business: 'Electronics centers/ supplies', categoryId: 9 },
    { id: 120, name_business: 'Electronics repair shop', categoryId: 9 },
    { id: 121, name_business: 'Internet service providers', categoryId: 9 },
    {
      id: 122,
      name_business: 'Internet shops/ On-line gaming ',
      categoryId: 9,
    },
    {
      id: 123,
      name_business: 'Prepaid cards retailer/ reloading stations ',
      categoryId: 9,
    },

    { id: 124, name_business: 'Amusement/gaming facilities', categoryId: 10 },
    { id: 125, name_business: 'Badminton courts', categoryId: 10 },
    { id: 126, name_business: 'Basketball courts', categoryId: 10 },
    { id: 127, name_business: 'Billiard centers', categoryId: 10 },
    { id: 128, name_business: 'Bowling Alleys', categoryId: 10 },
    { id: 129, name_business: 'Camping site', categoryId: 10 },
    { id: 130, name_business: 'Cinema/ Moviehouses', categoryId: 10 },
    { id: 131, name_business: 'Cockpit arenas', categoryId: 10 },
    { id: 132, name_business: 'Fitness Gym', categoryId: 10 },
    { id: 133, name_business: 'Function halls/ clubhouse', categoryId: 10 },
    { id: 134, name_business: 'Golf Course', categoryId: 10 },
    { id: 135, name_business: 'Library/ Museums', categoryId: 10 },
    { id: 136, name_business: 'Lottery outlets', categoryId: 10 },
    { id: 137, name_business: 'Music Studio/ Recording', categoryId: 10 },
    { id: 138, name_business: 'Playgrounds/ Parks', categoryId: 10 },
    { id: 139, name_business: 'Resorts', categoryId: 10 },

    { id: 140, name_business: 'Accounting firms', categoryId: 11 },
    { id: 141, name_business: 'Consultancy Services', categoryId: 11 },
    { id: 142, name_business: 'Driving school', categoryId: 11 },
    { id: 143, name_business: 'Billiard centers', categoryId: 11 },
    { id: 144, name_business: 'Funeral Parlor/Services', categoryId: 11 },
    {
      id: 145,
      name_business: 'Household maintenance services',
      categoryId: 11,
    },
    { id: 146, name_business: 'Law Offices/Notary Public', categoryId: 11 },
    {
      id: 147,
      name_business: 'Manpower services/ Job placement agency',
      categoryId: 11,
    },
    { id: 148, name_business: 'Marketing services', categoryId: 11 },
    { id: 149, name_business: 'Pest control', categoryId: 11 },
    {
      id: 150,
      name_business: 'Refrigiration/ Aircon/ Appliance repairs',
      categoryId: 11,
    },
    { id: 151, name_business: 'Schools/ learning centers', categoryId: 11 },
    { id: 152, name_business: 'Security services', categoryId: 11 },
    { id: 153, name_business: 'Talent management center', categoryId: 11 },
    { id: 154, name_business: 'Training centers', categoryId: 11 },
    { id: 155, name_business: 'Watch centers/ repair', categoryId: 11 },
    { id: 156, name_business: 'Welding shops', categoryId: 11 },
    { id: 157, name_business: 'Woodcrafts/ iron works', categoryId: 11 },
    { id: 158, name_business: 'Call Center', categoryId: 11 },

    { id: 159, name_business: 'Aluminum and glass supplies', categoryId: 12 },
    {
      id: 160,
      name_business: 'Construction contractors/ developers',
      categoryId: 12,
    },
    {
      id: 161,
      name_business: 'Construction Supplies/Concrete Products',
      categoryId: 12,
    },
    {
      id: 162,
      name_business: 'Drilling/ Excavations/ Septic services',
      categoryId: 12,
    },
    { id: 163, name_business: 'Electrical Services', categoryId: 12 },
    { id: 164, name_business: 'Engineering services', categoryId: 12 },
    { id: 165, name_business: 'Gravel and sand', categoryId: 12 },
    { id: 166, name_business: 'Hardwares/Electrical Business', categoryId: 12 },
    {
      id: 167,
      name_business: 'Home improvement/ Interior Decorating',
      categoryId: 12,
    },
    { id: 168, name_business: 'Landscaping', categoryId: 12 },
    { id: 169, name_business: 'Lumber supplies', categoryId: 12 },
    { id: 170, name_business: 'Paint centers/ retailers', categoryId: 12 },
    { id: 171, name_business: 'Plumbing services', categoryId: 12 },
    {
      id: 172,
      name_business: 'Real estate developers/ brokers',
      categoryId: 12,
    },
    { id: 173, name_business: 'Roofing supplies and services', categoryId: 12 },
    { id: 174, name_business: 'Surveyors', categoryId: 12 },
    { id: 175, name_business: 'Tiles centers/ Ceramics shops', categoryId: 12 },

    { id: 176, name_business: 'Book-binding services ', categoryId: 13 },
    { id: 177, name_business: 'Books and magazine stores', categoryId: 13 },
    { id: 178, name_business: 'Newspaper/ Print media dealer', categoryId: 13 },
    {
      id: 179,
      name_business: 'Paintings/ Printed arts retailers',
      categoryId: 13,
    },
    { id: 180, name_business: 'Photo Studio and supplies', categoryId: 13 },
    {
      id: 181,
      name_business: 'Printing Press/ printing services / publishing',
      categoryId: 13,
    },
    {
      id: 182,
      name_business: 'Signs/ billboards/ advertisement shop',
      categoryId: 13,
    },
    { id: 183, name_business: 'Tarpaulin printing', categoryId: 13 },

    { id: 184, name_business: 'Apartments', categoryId: 14 },
    { id: 185, name_business: 'Cable TV service providers', categoryId: 14 },
    { id: 186, name_business: 'Electric/ Power Companies', categoryId: 14 },
    {
      id: 187,
      name_business: 'Express Mail/  Mailing services',
      categoryId: 14,
    },
    { id: 188, name_business: 'Hotels/ Lodging houses', categoryId: 14 },
    { id: 189, name_business: 'Ice Plant', categoryId: 14 },
    { id: 190, name_business: 'Market/ Supermarket', categoryId: 14 },
    { id: 191, name_business: 'Memorial Park services', categoryId: 14 },
    {
      id: 192,
      name_business: 'Motion pictures production facility',
      categoryId: 14,
    },
    { id: 193, name_business: 'Radio/ TV Stations', categoryId: 14 },
    { id: 194, name_business: 'Rental services', categoryId: 14 },
    { id: 195, name_business: 'Storage facility', categoryId: 14 },
    { id: 196, name_business: 'Telecommunications Company', categoryId: 14 },
    { id: 197, name_business: 'Waste management services', categoryId: 14 },
    { id: 198, name_business: 'Water Utility Companies', categoryId: 14 },
  ];
}
