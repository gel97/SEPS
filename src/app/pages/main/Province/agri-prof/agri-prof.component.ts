import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AgriProfService } from 'src/app/shared/Province/AgriProf.Service';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import Swal from 'sweetalert2';
import { ImportComponent } from 'src/app/components/import/import.component';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { request, response } from 'express';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-agri-prof',
  templateUrl: './agri-prof.component.html',
  styleUrls: ['./agri-prof.component.css'],
})
export class AgriProfComponent implements OnInit {
  getMunCityId(): any {
    throw new Error('Method not implemented.');
  }
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: AgriProfService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService,
    private cdr: ChangeDetectorRef
  ) {
    this.o_munCityId = this.auth.o_munCityId;
  }
  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }
  item: any;
  o_munCityId: any = '';
  isAdd: boolean = false;
  isCheck: boolean = false;
  Data: boolean = false;
  selectedItem: any = null;
  selectedMunicipality: any = null;
  editData: any = {};
  data: any = {};
  listProvTypes: any[] = [];
  listData: any[] = [];
  listProvAgri: any[] = [];
  listMunicipalities: any[] = [];
  listDistricts: any[] = [];

  closebutton!: { nativeElement: { click: () => void } };
  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
  }
  ngOnInit(): void {
    this.o_munCityId = this.auth.o_munCityId;
    this.Init();
  }
  Init() {
    this.GetProvTypes;
    this.GetData();
    //this.GetMunicipalities();
    this.GetDistricts();
  }
  canModify(munCityId: string) {
    return this.auth.o_munCityId === munCityId;
  }
  GetData() {
    this.listData = []; // Clear old data
    this.service.GetProvAgri(this.auth.setYear, this.auth.munCityId).subscribe({
      next: (response) => {
        this.listProvAgri = response;
        //console.log('API Response:', this.listProvAgri);
        //console.log('Processed listData:', this.listData);
        this.GetProvTypes();
        this.listData = this.listProvAgri;
      },
      error: (error) => {
        //console.error('API Error:', error);
      },
    });
  }

  GetDistricts() {
    this.service.ListOfMunicipality().subscribe({
      next: (response) => {
        this.listDistricts = response; // Store the grouped response
        //console.log('Districts with Municipalities:', this.listDistricts);
      },
      error: (error) => {
        //console.error('Error fetching municipalities:', error);
      },
    });
  }
  GetMunicipalities() {
    this.service.ListOfMunicipality().subscribe({
      next: (response) => {
        this.listDistricts = this.groupMunicipalitiesByDistrict(response);
        //console.log('Grouped Districts:', this.listDistricts);
      },
      error: (error) => {
        //console.error('Error fetching municipalities:', error);
      },
    });
  }

  groupMunicipalitiesByDistrict(municipalities: any[]): any[] {
    const districtsMap: { [key: string]: any } = {};
    municipalities.forEach((mun) => {
      if (!districtsMap[mun.district]) {
        districtsMap[mun.district] = {
          districtName: mun.district,
          municipalities: [],
        };
      }
      districtsMap[mun.district].municipalities.push(mun);
    });

    return Object.values(districtsMap);
  }

  getTotalMunicipalities(): number {
    return this.listDistricts.reduce(
      (sum, district) => sum + district.municipalities.length,
      0
    );
  }
  // Function to get the commodity value for a specific municipality
  getCommodityValue(munCityId: string, item: any): number | string {
    // Find the matching municipality data
    let match = this.listProvAgri.find(
      (data: any) => data.munCityId === munCityId
    );

    if (!match) {
      console.warn(`No match found for municipality ID: ${munCityId}`);
      return '-'; // Return "-" to indicate missing data
    }

    if (!item || !item.commodities) {
      console.warn(`Invalid item structure for municipality ID: ${munCityId}`);
      return '-';
    }

    // Normalize key by trimming spaces
    let formattedKey = item.commodities.trim().replace(/\s+/g, '');

    // Find matching key in the data
    let actualKey = Object.keys(match).find(
      (k) => k.trim().toLowerCase() === formattedKey.toLowerCase()
    );

    if (!actualKey) {
      console.warn(
        `Key "${formattedKey}" not found in municipality ID: ${munCityId}`
      );
      return '-';
    }

    let value = match[actualKey];

    // If value is undefined or null, return "-"
    return value !== undefined && value !== null ? value : '-';
  }

  // Function to calculate total for each commodity across municipalities
  getTotalCommodity(item: any): number {
    return this.listDistricts.reduce((total, district) => {
      return (
        total +
        district.municipalities.reduce((sum: number, municipality: any) => {
          return sum + (item[municipality.munCityId] || 0);
        }, 0)
      );
    }, 0);
  }
  // Function to calculate total for each municipality
  getTotalPerMunicipality(munCityId: number): number {
    return this.listData.reduce(
      (sum: number, item: any) => sum + (item[munCityId] || 0),
      0
    );
  }
  // Function to calculate grand total of all commodities
  getGrandTotal(): number {
    return this.listData.reduce(
      (sum: number, item: any) => sum + this.getTotalCommodity(item),
      0 as number
    );
  }
  hasDataForMunicipality(): boolean {
    return this.listData.some(
      (obj: { munCityId: any }) => obj.munCityId === this.auth.o_munCityId
    );
  }
  editItem(municipalityId: string) {
    let selected = this.listProvAgri.find(
      (data: any) => data.munCityId === municipalityId
    );

    if (!selected) {
      // console.log(`No data found for municipality: ${municipalityId}`);
      return;
    }
    // Populate editData with existing values
    this.data = { ...selected };
    //console.log('Editing Data:', this.editData);
  }

  AddData() {
    this.data.setYear = this.auth.activeSetYear;
    this.data.munCityId = this.auth.o_munCityId;
    this.data.userId = this.auth.currentUserId;
    this.service.AddProvAgri(this.data).subscribe({
      next: (request) => {
        // ✅ Ensure response has the correct data
        console.log('New Data Added:', request);
        // ✅ Check if the data already exists in the list
        let index = this.listProvAgri.findIndex(
          (obj: any) => obj.munCityId === this.data.munCityId
        );
        if (index !== -1) {
          this.listProvAgri[index] = request; // ✅ Update existing record
        } else {
          this.listProvAgri.push(request); // ✅ Add new record
        }
        // ✅ Ensure UI updates
        this.listProvAgri = [...this.listProvAgri]; // Force refresh UI

        // ✅ Load the newly added data into the form for editing
      },
      error: (err) => {
        console.error('Error saving data:', err);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Failed to save data',
          text: 'This data already exists or something went wrong!',
          showConfirmButton: true,
        });
      },
      complete: () => {
        setTimeout(() => {
          this.data = {}; // ✅ Reset form
          this.closebutton.nativeElement.click(); // ✅ Close modal
        }, 500);

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Data saved successfully',
          showConfirmButton: false,
          timer: 1500,
        });
      },
    });
  }

  updateData() {
    if (!this.editData) {
      console.error('Data is undefined! Cannot proceed with update.');
      return;
    }

    this.editData.setYear = this.auth.activeSetYear; // Ensure year is set

    this.service.UpdateProvAgri(this.editData).subscribe({
      next: () => {
        console.log('Update successful:', this.editData);
        this.closebutton.nativeElement.click(); // Close modal
        // Save userId to localStorage
        localStorage.setItem('userId', this.auth.currentUserId);
        this.editData = {}; // Reset form
      },
      error: (err) => {
        console.error('Error updating data:', err);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Update failed!',
          text: 'Please try again.',
          showConfirmButton: true,
        });
      },
      complete: () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been updated',
          showConfirmButton: false,
          timer: 1000,
        });
      },
    });
  }

  loadEditData() {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    const munCityId = this.auth.o_munCityId;
    if (!munCityId) {
      console.error('No municipality ID selected for editing!');
      return;
    }

    // ✅ Find data for the selected municipality
    this.editData = this.listProvAgri.find(
      (item: any) => item.munCityId === munCityId
    );

    if (!this.editData) {
      console.error('No data found for this municipality!');
      return;
    }

    this.isAdd = false; // ✅ Switch to edit mode
    this.editData.munCityId = munCityId; // ✅ Assign correct municipality ID
    this.editData.userId = userId; // Retrieve userId from localStorage
    this.editData = this.editData || {};

    console.log('Editing Data:', this.editData);
    console.log('Keys in editData:', Object.keys(this.editData));
    this.cdr.detectChanges();
  }
  updateEditData(event: Event, commodity: string) {
    const inputElement = event.target as HTMLInputElement;
    if (!this.editData) {
      this.editData[this.formatKey(commodity)] = inputElement.value;
    }
    this.editData[this.formatKey(commodity)] = inputElement.value;
  }

  selectRow(item: any) {
    this.selectedItem = item;
    this.selectedMunicipality = this.auth.o_munCityId; // ✅ Assign municipality ID from auth
    console.log('Selected Item:', this.selectedItem);
    console.log('Selected Municipality ID:', this.selectedMunicipality);
  }

  DeleteAllData() {
    //console.log('Checking listProvAgri before delete:', this.listProvAgri);

    if (!this.listProvAgri || this.listProvAgri.length === 0) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'No data available to delete!',
        showConfirmButton: true,
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will delete the selected data and cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete selected!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Get only valid transIds from listProvAgri
        const transIds = this.listProvAgri
          .map((item: any) => item.transId)
          .filter((id: any) => id); // Remove undefined/null values

        // console.log('Valid transIds to delete:', transIds);

        if (transIds.length === 0) {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'No valid data to delete!',
            showConfirmButton: true,
          });
          return;
        }

        // Execute all delete requests in parallel
        forkJoin(
          transIds.map((id: any) => this.service.DeleteProv(id))
        ).subscribe({
          next: () => {
            //console.log('Successfully deleted selected items');

            // **NEW FIX**: Remove only the deleted items from `listProvAgri`
            this.listProvAgri = this.listProvAgri.filter(
              (item: any) => !transIds.includes(item.transId)
            );

            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Selected data deleted successfully!',
              showConfirmButton: false,
              timer: 1500,
            });
          },
          error: (err) => {
            //console.error('Error deleting selected data:', err);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Failed to delete selected data',
              text: err.message || 'Something went wrong!',
              showConfirmButton: true,
            });
          },
        });
      }
    });
  }
  trackByCommodities(index: number, item: any): string {
    return item.commodities;
  }
  // formatCommodityKey(commodity: string): string {
  //   return commodity.toLowerCase().replace(/\s/g, '');
  // }
  formatKey(key: string | undefined | null): string {
    if (!key) return ''; // Return an empty string if key is null or undefined
    return key.trim().replace(/\s+/g, '').toLowerCase();
  }
  GetProvTypes() {
    this.service.GetProvTypes().subscribe({
      next: (response) => {
        this.listProvTypes = response;
        //console.log('List of Commodities:', this.listProvTypes);
      },
      error: (error) => {
        // console.error('Error fetching commodity types:', error);
      },
      complete: () => {
        this.MergeData();
      },
    });
  }
  MergeData() {
    this.listData = this.listProvTypes.map((commodity: any) => {
      let key = commodity.commodities.toLowerCase().replace(/\s/g, '');

      let data = this.listMunicipalities.map((municipality: any) => {
        let agriData = this.listProvAgri.find(
          (item: any) => item.munCityId === municipality.munCityId
        );
        return {
          [municipality.munCityId]: agriData ? agriData[key] || 0 : '-', // Show "-" if no data
        };
      });

      return {
        type: commodity.recNo,
        commodities: commodity.commodities,
        data: data,
      };
    });
  }

  FilterList() {
    let isExist;
    this.listData = [];

    this.listProvTypes.forEach((a: any) => {
      this.listProvAgri.forEach((b: any) => {
        if (a.recNo === b.type) {
          isExist = this.listData.filter((x: any) => x.type === a.type);
          if (isExist.length === 0) {
            this.listData.push(b);
          }
        }
      });

      isExist = this.listData.filter((x: any) => x.type == a.recNo);
      if (isExist.length === 0) {
        this.listData.push({
          type: a.recNo,
          commodities: a.commodities,
        });
      }
    });
    //console.log('mergeList: ', this.listData);
  }
}
