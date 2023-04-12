import { Component, OnInit } from '@angular/core';
import { CityOfficialService } from 'src/app/shared/Governance/city-official.service'; // import service
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-city-officials',
  templateUrl: './city-officials.component.html',
  styleUrls: ['./city-officials.component.css']
})
export class CityOfficialsComponent implements OnInit {
  isLoading: boolean = true;

  constructor(private service: CityOfficialService, private auth: AuthService) { } // private service: + name of service that you've created
  toValidate: any = {};
  Official: any = [];
  city: any = {};
  city2: any = {};
  Edit: any = {};
  updateOfficial: any = {};
  editModal: any = {};
  AddModal: any = {};
  positions: any = [];

  pageSize = 25;
  p: string | number | undefined;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 25, 50, 100];

  date = new DatePipe('en-PH')
  ngOnInit(): void {
    this.Init();
  }

  Init() {
    this.getPositions();
    this.getOfficials();

  }

  getOfficials() {
    this.service.GetOfficial().subscribe(data => {
    this.Official = (<any>data);
    })
  }

  getPositions() {
    this.service.GetMunPosition().subscribe(data => {
      this.positions = <any>data;
    })
  }

  addOfficial() {
    this.toValidate.name = this.city.name == "" || this.city.name == null ? true : false;
    this.toValidate.seqNo = this.city.seqNo == "" || this.city.seqNo == undefined ? true : false;

    if (this.toValidate.name == true || this.toValidate.seqNo == true) {
      Swal.fire(
        '',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.city.munCityId = this.auth.munCityId;
      this.city.setYear = this.auth.activeSetYear;
      this.city.transId = this.date.transform(Date.now(), 'YYMM');
      this.city.tag = 1;
      this.city.setYear = this.auth.activeSetYear;
      this.city.position = "";
      this.service.AddOfficial(this.city).subscribe(_data => {
        // alert("success");
        Swal.fire(
          'Good job!',
          'Data Added Successfully!',
          'success'
        );

        this.getOfficials();
        this.city = {};

      }, err => {
        Swal.fire(
          'ERROR!',
          'Error',
          'error'
        );
      });
    }
  }

  //for modal
  update() {
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
      timer: 1000
    });
    
  }

  delete(official2: any = {}) {
    Swal.fire({

      text: 'Do you want to remove this file?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.value) {
        official2.tag = -1;
        this.service.UpdateOfficial(official2).subscribe(_data => {
          Swal.fire(
            'Deleted',
            'Removed successfully',
            'success'
          );
          this.Init();
          this.city = {};
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
      this.Init();
      this.city = {};
    })
  }


  onTableDataChange(page: any) { //paginate
    console.log(page)
    this.p = page;
    this.Init();

  }
  onTableSizeChange(event: any) { //paginate
    this.tableSize = event.target.value;
    this.p = 1;
    this.Init();
  }

}
