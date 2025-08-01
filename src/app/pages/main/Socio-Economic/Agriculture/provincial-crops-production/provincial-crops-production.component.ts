import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AgricultureProdService } from 'src/app/shared/Socio-Economic/Agriculture/agricultureProd.service';
import Swal from 'sweetalert2';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { SourceService } from 'src/app/shared/Source/Source.Service';

@Component({
  selector: 'app-provincial-crops-production',
  templateUrl: './provincial-crops-production.component.html',
  styleUrls: ['./provincial-crops-production.component.css'],
})
export class ProvincialCropsProductionComponent implements OnInit {
  constructor(
    private service: AgricultureProdService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService,
    private SourceService: SourceService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  message = 'Provincial Crops Production';
  Crops: any = [];
  crop: any = {};
  listofCrop: any = [
    { id: 1, name: 'Rice - Irrigated' },
    { id: 2, name: 'Rice - Rainfed' },
    { id: 3, name: 'Corn - White' },
    { id: 4, name: 'Corn - Yellow' },
    { id: 5, name: 'Banana - Bungulan' },
    { id: 6, name: 'Banana - Cavendish' },
    { id: 7, name: 'Banana - Lakatan' },
    { id: 8, name: 'Banana - Latundan' },
    { id: 9, name: 'Banana - Saba/Cardaba' },
    { id: 10, name: 'Coconut' },
    { id: 11, name: 'Mango' },
    { id: 12, name: 'Durian' },
    { id: 13, name: 'Papaya' },
    { id: 14, name: 'Coffee' },
    { id: 15, name: 'Cacao' },
    { id: 16, name: 'Mongo' },
    { id: 17, name: 'Eggplant' },
    { id: 18, name: 'Tomato' },
    { id: 19, name: 'Pechay' },
    { id: 20, name: 'String beans' },
    { id: 21, name: 'Gabi' },
    { id: 22, name: 'Ampalaya' },
    { id: 23, name: 'Onion leeks' },
    { id: 24, name: 'Ube' },
    { id: 25, name: 'Chayote' },
    { id: 26, name: 'Patola' },
    { id: 27, name: 'Pomelo' },
    { id: 28, name: 'Gourd' },
    { id: 29, name: 'Raddish' },
    { id: 30, name: 'Rubber' },
    { id: 31, name: 'Okra' },
    { id: 32, name: 'Cucumber' },
    { id: 33, name: 'Abaca' },
    { id: 34, name: 'Squash fruit' },
    { id: 35, name: 'Camote' },
    { id: 36, name: 'Falcata' },
    { id: 37, name: 'Ginger' },
    { id: 38, name: 'Cassava' },
    { id: 39, name: 'Lanzones' },
    { id: 40, name: 'Pepper' },
    { id: 41, name: 'Other Vgetables' },
  ];

  // list_of_CropType =[{ id: 1, name: "Sample1" },
  // { id: 2, name: "sample2" },];

  add_Crops: boolean = true;

  munCityName: string = this.auth.munCityName;
  setYear = this.auth.activeSetYear;
  munCityId = this.auth.munCityId;
  menuId = '8';
  toValidate: any = {};

  isCheck: boolean = false;
  visible: boolean = true;
  not_visible: boolean = true;
  sources: any = [];
  newSource: any = {};
  selectedSourceId: number | null = null;
  showAddForm: boolean = true;
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }

  clearData() {
    this.crop = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }

  parentMethod() {
    // alert('parent Method');
    this.crop = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }

  ngOnInit(): void {
    this.List_Crops();
    this.getSources();
  }
  getSources(): void {
    const setYear = this.auth.activeSetYear;
    const munCityId = this.auth.munCityId;
    const sourceFor = 'crops';

    this.SourceService.getSources(setYear, munCityId, sourceFor).subscribe({
      next: (data) => {
        this.sources = data;
        this.showAddForm = data.length === 0;
      },
      error: (error) => {
        console.error('Failed to fetch sources:', error);
      },
    });
  }

  addSource(): void {
    if (!this.newSource?.name) {
      Swal.fire('Warning', 'Please enter a source name.', 'warning');
      return;
    }

    const sourceFor = 'crops'; // 👈 assign your module name

    // ✅ Add metadata
    this.newSource.munCityId = this.auth.munCityId;
    this.newSource.setYear = this.auth.activeSetYear;
    this.newSource.sourceFor = sourceFor;

    this.SourceService.createSource(this.newSource).subscribe({
      next: () => {
        this.newSource = {};
        Swal.fire('Success', 'Source added successfully.', 'success');
        this.getSources(); // ✅ Re-fetch source list
      },
      error: (error) => {
        Swal.fire('Error', `Failed to create source.\n${error}`, 'error');
      },
    });
  }

  updateSource(): void {
    if (this.selectedSourceId === null || !this.newSource?.name) {
      Swal.fire('Warning', 'No source selected or missing name.', 'warning');
      return;
    }

    this.SourceService.updateSource(
      this.selectedSourceId,
      this.newSource
    ).subscribe({
      next: () => {
        this.getSources();
        this.selectedSourceId = null;
        this.newSource = {};
        Swal.fire('Success', 'Source updated successfully!', 'success');
      },
      error: (error) => {
        Swal.fire('Error', `Failed to update source.\n${error}`, 'error');
      },
    });
  }
  deleteSource(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will delete the source.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading dialog
        Swal.fire({
          title: 'Deleting...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Perform delete operation
        this.SourceService.deleteSource(id).subscribe({
          next: () => {
            this.getSources(); // Refresh list
            Swal.fire('Deleted!', 'Source has been deleted.', 'success');
          },
          error: (error) => {
            Swal.fire(
              'Error',
              `Failed to delete source.\n${error.message || error}`,
              'error'
            );
          },
        });
      }
    });
  }

  editSource(source: any): void {
    this.selectedSourceId = source.id;
    this.newSource = { ...source };
  }

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import(this.menuId).subscribe({
      next: (data) => {
        this.ngOnInit();
        if (data.length === 0) {
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
        } else {
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

  List_Crops() {
    this.service
      .GetListAgricultureProd(this.menuId, this.setYear, this.munCityId)
      .subscribe((data) => {
        console.log('Checked_Data', data);
        this.Crops = <any>data;
      });
  }

  Add_Crops() {
    this.toValidate.type =
      this.crop.type == '' || this.crop.type == null ? true : false;
    this.toValidate.totalProd =
      this.crop.totalProd == '' || this.crop.totalProd == undefined
        ? true
        : false;
    this.toValidate.area =
      this.crop.area == '' || this.crop.area == undefined ? true : false;

    if (
      this.toValidate.type == true ||
      this.toValidate.totalProd == true ||
      this.toValidate.area == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.crop.menuId = this.menuId;
      this.crop.setYear = this.setYear;
      this.crop.munCityId = this.munCityId;
      this.service.AddAgricultureProd(this.crop).subscribe((data) => {
        if (!this.isCheck) {
          this.closebutton.nativeElement.click();
        }
        console.log(data);
        this.clearData();
        this.List_Crops();

        Swal.fire('Good job!', 'Data Added Successfully!', 'success');
        this.List_Crops();
        this.crop = {};
      });
    }
  }

  Edit_Crops() {
    this.toValidate.type =
      this.crop.type == '' || this.crop.type == null ? true : false;
    this.toValidate.totalProd =
      this.crop.totalProd == '' || this.crop.totalProd == undefined
        ? true
        : false;
    this.toValidate.area =
      this.crop.area == '' || this.crop.area == undefined ? true : false;

    if (
      this.toValidate.type == true ||
      this.toValidate.totalProd == true ||
      this.toValidate.area == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.EditAgricultureProd(this.crop).subscribe({
        next: (_data) => {
          this.List_Crops();
          this.clearData();
        },
      });

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been updated',
        showConfirmButton: false,
        timer: 1000,
      });
      this.crop = {};
      document.getElementById('ModalAdd')?.click();
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
        for (let i = 0; i < this.Crops.length; i++) {
          if (this.Crops[i].transId == transId) {
            this.Crops.splice(i, 1);
            Swal.fire('Deleted', 'Removed successfully', 'success');
          }
        }

        this.service.DeleteAgricultureProd(transId).subscribe((_data) => {
          this.List_Crops();
          this.crop = {};
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
}
