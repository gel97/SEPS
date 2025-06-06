import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SepDataService } from 'src/app/shared/Tools/sep-data.service';

@Component({
  selector: 'app-sep-data',
  templateUrl: './sep-data.component.html',
  styleUrls: ['./sep-data.component.css'],
})
export class SepDataComponent implements OnInit {
  list_muncity: any = {};
  set_year: any;
  muncity_id: any;
  muncity: any = {};
  list_sep_year: any = [];

  isGuestUser: boolean = false;

  constructor(private service: SepDataService, private auth: AuthService) {}

  ngOnInit(): void {
    this.set_year = this.auth.setYear;
    this.muncity_id = this.auth.munCityId;

    this.isGuestUser = this.muncity_id === 'Guest';

    if (!this.isGuestUser) {
      this.service
        .ListMunCity()
        .subscribe((data) => (this.list_muncity = data));
    }

    this.service.ListSepYear().subscribe((data) => (this.list_sep_year = data));
  }

  Init() {
    this.service.ListMunCity().subscribe((data) => {
      this.list_muncity = <any>data;
    });
    this.service.ListSepYear().subscribe((data) => {
      this.list_sep_year = <any>data;
    });
  }
  onChange(value: any) {}
  SetData() {
    localStorage.setItem('setYear', this.set_year);

    // Only set municipality if user is NOT a guest
    if (!this.isGuestUser) {
      const newArray = this.list_muncity.filter(
        (el: any) => el.munCityId == this.muncity_id
      );

      if (newArray.length > 0) {
        localStorage.setItem('munCityId', this.muncity_id);
        localStorage.setItem('munCityName', newArray[0].munCityName);
      }
    }

    window.location.reload();
  }
}
