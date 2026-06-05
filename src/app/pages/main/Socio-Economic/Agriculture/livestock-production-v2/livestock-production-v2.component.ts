import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { AgricultureLivestockServiceV2 } from 'src/app/shared/Socio-Economic/Agriculture/agricultureLivestockV2.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-livestock-production-v2',
  templateUrl: './livestock-production-v2.component.html',
  styleUrls: ['./livestock-production-v2.component.css']
})
export class LivestockProductionV2Component implements OnInit {
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  constructor(
    private auth: AuthService,
    private service: AgricultureLivestockServiceV2,
    private modifyService: ModifyCityMunService,
    private route: ActivatedRoute,
  ) { }

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  munCityName: string = this.auth.munCityName;
  listLivestock2: any = [];
  listBarangay: any = [];
  isAdd: boolean = false;
  listData: any = [];
  data: any = {};
  isUpdated = false;
  sources: any = [];
  newSource: any = {};
  selectedSourceId: number | null = null;
  showAddForm: boolean = true;
  public showOverlay = false;

  ngOnInit(): void {
    this.Init();
  }

  Init() {
    this.GetData();
  }

  GetData() {
    console.log('=== GET DATA ===');
    console.log('setYear:', this.auth.setYear);
    console.log('munCityId:', this.auth.munCityId);
    
    this.service
      .GetListAgricultureLivestockV2(this.auth.setYear, this.auth.munCityId)
      .subscribe({
        next: (response) => {
          this.listLivestock2 = <any>response || [];
          console.log('API Response (listLivestock2):', JSON.stringify(this.listLivestock2, null, 2));
        },
        error: (error) => {
          console.error('GetData error:', error);
        },
        complete: () => {
          this.GetListBarangay();
        },
      });
  }

  GetListBarangay() {
    console.log('=== GET BARANGAY ===');
    console.log('munCityId:', this.auth.munCityId);
    
    this.service.ListOfBarangay(this.auth.munCityId).subscribe({
      next: (response) => {
        this.listBarangay = <any>response || [];
        console.log('Barangays:', JSON.stringify(this.listBarangay, null, 2));
      },
      error: (error) => {
        console.error('GetListBarangay error:', error);
      },
      complete: () => {
        this.FilterList();
      },
    });
  }

  FilterList() {
    console.log('=== FILTER LIST ===');
    console.log('listLivestock2 count:', this.listLivestock2.length);
    console.log('listBarangay count:', this.listBarangay.length);
    
    this.listData = [];

    this.listBarangay.forEach((brgy: any) => {
      // Use loose equality (==) to handle string/number mismatch
      const livestockRecord = this.listLivestock2.find(
        (livestock: any) => livestock.brgyId == brgy.brgyId
      );

      if (livestockRecord) {
        console.log(`Match found for ${brgy.brgyName}:`, livestockRecord);
        this.listData.push({
          ...livestockRecord,
          brgyName: brgy.brgyName,
          brgyId: brgy.brgyId,
        });
      } else {
        console.log(`No match for ${brgy.brgyName} (brgyId: ${brgy.brgyId})`);
        this.listData.push({
          brgyId: brgy.brgyId,
          brgyName: brgy.brgyName,
        });
      }
    });

    console.log('Final listData:', JSON.stringify(this.listData, null, 2));
  }

  AddData() {
    console.log('=== ADD DATA ===');
    console.log('Original data:', this.data);
    
    if (isEmptyObject(this.data)) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
      return;
    }

    // Ensure brgyId is set from the selected barangay
    if (!this.data.brgyId && this.data.brgyName) {
      const selectedBrgy = this.listBarangay.find(
        (b: any) => b.brgyName === this.data.brgyName
      );
      if (selectedBrgy) {
        this.data.brgyId = selectedBrgy.brgyId;
      }
    }

    this.data.munCityId = this.auth.munCityId;
    this.data.setYear = this.auth.setYear;

    console.log('Data to send:', JSON.stringify(this.data, null, 2));

    this.service.AddAgricultureLivestockV2(this.data).subscribe({
      next: (response: any) => {
        console.log('Add response:', JSON.stringify(response, null, 2));
        
        // Find the barangay name from listBarangay
        const brgy = this.listBarangay.find(
          (b: any) => b.brgyId == this.data.brgyId
        );

        const mergedData = {
          ...response,
          brgyName: brgy ? brgy.brgyName : this.data.brgyName,
          brgyId: this.data.brgyId,
        };

        // Update listLivestock2
        const livestockIndex = this.listLivestock2.findIndex(
          (x: any) => x.brgyId == this.data.brgyId
        );
        if (livestockIndex >= 0) {
          this.listLivestock2[livestockIndex] = response;
        } else {
          this.listLivestock2.push(response);
        }

        // Update listData
        const dataIndex = this.listData.findIndex(
          (obj: any) => obj.brgyId == this.data.brgyId
        );
        if (dataIndex >= 0) {
          this.listData[dataIndex] = mergedData;
        }
      },
      error: (err) => {
        console.error('Add error:', err);
        Swal.fire('Oops!', 'Something went wrong.', 'error');
      },
      complete: () => {
        this.data = {};
        this.closebutton.nativeElement.click();

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1000,
        });
      },
    });
  }

  EditData() {
    console.log('=== EDIT DATA ===');
    console.log('Data to edit:', this.data);
    
    this.data.setYear = this.auth.setYear;
    this.data.munCityId = this.auth.munCityId;

    this.service.EditAgricultureLivestockV2(this.data).subscribe({
      next: (response: any) => {
        console.log('Edit response:', JSON.stringify(response, null, 2));
        
        // Update listLivestock2
        const livestockIndex = this.listLivestock2.findIndex(
          (x: any) => x.brgyId == this.data.brgyId
        );
        if (livestockIndex >= 0) {
          this.listLivestock2[livestockIndex] = response;
        }

        // Update listData - preserve brgyName
        const dataIndex = this.listData.findIndex(
          (obj: any) => obj.brgyId == this.data.brgyId
        );
        if (dataIndex >= 0) {
          const brgyName = this.listData[dataIndex].brgyName;
          this.listData[dataIndex] = {
            ...response,
            brgyName: brgyName,
            brgyId: this.data.brgyId,
          };
        }

        this.closebutton.nativeElement.click();
        this.data = {};
      },
      error: (err) => {
        console.error('Edit error:', err);
        Swal.fire('Oops!', 'Something went wrong.', 'error');
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

  DeleteData(transId: any, index: any, data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteAgricultureLivestockV2(transId).subscribe({
          next: (_data) => {},
          error: (err) => {
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          },
          complete: () => {
            // Remove from listLivestock2
            const livestockIndex = this.listLivestock2.findIndex(
              (x: any) => x.transId == transId
            );
            if (livestockIndex >= 0) {
              this.listLivestock2.splice(livestockIndex, 1);
            }

            // Reset listData entry to empty barangay
            this.listData[index] = {
              brgyId: data.brgyId,
              brgyName: data.brgyName,
            };

            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
        });
      }
    });
  }
}