import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HealthHandicapService } from 'src/app/shared/SocialProfile/Health/healthHandicap.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';

@Component({
  selector: 'app-person-disability',
  templateUrl: './person-disability.component.html',
  styleUrls: ['./person-disability.component.css'],
})
export class PersonDisabilityComponent implements OnInit {
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  constructor(
    private auth: AuthService,
    private service: HealthHandicapService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  list_of_type = [
    { id: 1, type: 'Hearing Impaired' },
    { id: 2, type: 'Visually Impaired - Blindness' },
    { id: 3, type: 'Visually Impaired - Low Vision' },
    { id: 4, type: 'Intellectually Disabled' },
    { id: 5, type: 'Physically Handicapped' },
    { id: 6, type: 'Communication Disorder' },
    { id: 7, type: 'Cerebral Palsy' },
    { id: 8, type: 'Special Health Problem' },
    { id: 9, type: 'Hairlip' },
    { id: 10, type: 'Amputee' },
    { id: 11, type: 'Polio' },
    { id: 12, type: 'Orthopedic' },
    { id: 13, type: 'Down Syndrom' },
    { id: 14, type: 'Hearing & Speech Disability' },
    { id: 15, type: 'Down Syndrom' },
    { id: 16, type: 'Autism' },
    { id: 17, type: 'Psychosocial Disability' },
    { id: 18, type: 'Speech Impairment' },
    { id: 19, type: 'Chronic Illness due to Mastectomy' },
    { id: 20, type: 'Learning Disability' },
    { id: 21, type: 'Dwarfism' },
    {
      id: 22,
      type: 'Gifted & Talented (hearing impaired, visually impaired, CWA, LD, intellectual disability)',
    },
    { id: 23, type: 'Not Specified' },
  ];

  munCityName: string = this.auth.munCityName;
  listHandi: any = [];
  listBarangay: any = [];
  isAdd: boolean = false;
  listData: any = [];
  data: any = {};
  ngOnInit(): void {
    this.Init();
  }

  Init() {
    this.GetHealthHandicap();
    this.GetListBarangay();
  }

  GetHealthHandicap() {
    this.service
      .GetHealthHandicap(this.auth.setYear, this.auth.munCityId)
      .subscribe({
        next: (response) => {
          this.listHandi = <any>response;
        },
        error: (error) => {},
        complete: () => {
          this.GetListBarangay();
        },
      });
  }

  GetListBarangay() {
    this.service.ListOfBarangay(this.auth.munCityId).subscribe({
      next: (response) => {
        this.listBarangay = <any>response;
      },
      error: (error) => {},
      complete: () => {
        this.FilterList();
      },
    });
  }

  FilterList() {
    let isExist;
    this.listData = [];

    this.listBarangay.forEach((a: any) => {
      this.listHandi.forEach((b: any) => {
        if (a.brgyId == b.brgyId) {
          isExist = this.listData.filter((x: any) => x.brgyId == a.brgyId);
          if (isExist.length == 0) {
            this.listData.push(b);
          }
        }
      });

      isExist = this.listData.filter((x: any) => x.brgyId == a.brgyId);
      if (isExist.length == 0) {
        this.listData.push({
          brgyId: a.brgyId,
          brgyName: a.brgyName,
        });
      }
    });
  }

  AddData() {
    if (isEmptyObject(this.data)) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;
      this.service.AddHealthHandicap(this.data).subscribe({
        next: (request) => {
          let index = this.listData.findIndex(
            (obj: any) => obj.brgyId === this.data.brgyId
          );
          this.listData[index] = request;
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
  }

  EditData() {
    this.data.setYear = this.auth.activeSetYear;
    this.service.EditHealthHandicap(this.data).subscribe({
      next: (request) => {
        this.closebutton.nativeElement.click();
        this.data = {};
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
        this.service.DeleteHealthHandicap(transId).subscribe({
          next: (_data) => {},
          error: (err) => {
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          },
          complete: () => {
            this.listData[index] = {};
            this.listData[index].brgyId = data.brgyId;
            this.listData[index].brgyName = data.brgyName;
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
        });
      }
    });
  }
}
