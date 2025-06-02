import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import * as XLSX from 'xlsx';
import { ActivatedRoute } from '@angular/router';
import { delay, pluck } from 'rxjs';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { pdfpService } from 'src/app/shared/Province/pdfp.service';

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.css'],
})
export class UploadDataComponent implements OnInit {
  constructor(
    private elementRef: ElementRef,
    private httpClient: HttpClient,
    private _location: Location,
    private pdfp: pdfpService,
    private router: ActivatedRoute
  ) {}

  backClicked() {
    this._location.back();
  }
  ngOnInit(): void {
    this.myjson();
    $('body').addClass('toggle-sidebar');
    this.router.params.subscribe((params) => (this.requestId = params['id']));
    var s = document.createElement('script');
    s.type = 'text/javascript';
    // s.src = "../assets/js/main.js";
    this.elementRef.nativeElement.appendChild(s);
  }
  userId = 0;
  requestId: any;
  convertedJson!: string;
  jsonData: any;
  builderData: any;
  myjson() {
    //  this.utility.GetDataBuilder(this.sessionStorage.retrieve('userdata').userId).subscribe((data)=>{
    //     this.builderData = data;
    //  });
  }

  fileUpload(event: any) {
    this.jsonData = [];
    // console.log(event.target.files);
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) => {
      // console.log(event);
      let binaryData = event.target?.result;
      let workbook = XLSX.read(binaryData, { type: 'binary' });
      workbook.SheetNames.forEach((sheet) => {
        console.log('----------');
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

        console.log(data);

        this.convertedJson = JSON.stringify(data, undefined, 4);
      });

      // console.log(workbook);

      var Jsondata = JSON.parse(this.convertedJson);
      var databuilder = [];
      console.log(this.convertedJson);
      let dataindex = Jsondata.map(
        (item: { template: any }) => item.template
      ).indexOf('data');
      let main = Jsondata.map(
        (item: { template: any }) => item.template
      ).indexOf('main');
      let sub = Jsondata.map(
        (item: { template: any }) => item.template
      ).indexOf('sub');
      let more = Jsondata.map(
        (item: { template: any }) => item.template
      ).indexOf('more');
      console.log(dataindex);
      console.log(main);
      console.log(sub);
      console.log(more);
      const builder_keys = Object.keys(Jsondata[0]);
      var temp_builder: {
        DataBuilderId: number;
        BranchId: any;
        AgencyId: number;
        Title: any;
        Details: any;
        UserId: number;
        Year: number;
      }[] = [];
      builder_keys.forEach((key, Builderindex) => {
        // console.log(`${key}: ${Jsondata[i][key]}`);
        var key_id = key.split('_')[3] == undefined ? '0' : key.split('_')[3];
        var next_key_id = builder_keys[Builderindex + 1];
        var next_key_id_temp =
          next_key_id == undefined ? '100' : next_key_id.split('_')[3];

        const main_keys = Object.keys(Jsondata[main]);
        var temp_main: {
          MainColumnId: number;
          DataBuilderId: number;
          Name: any;
          Sort: number;
        }[] = [];

        main_keys.forEach((key, MainIndex) => {
          var main_key_id =
            key.split('_')[3] == undefined ? '0' : key.split('_')[3];
          // console.log(`${key}: ${Jsondata[main][key]}`);
          // console.log(`${key}: main-- ${Jsondata[MainIndex][key]}`);

          if (Jsondata[main][key] != 'main') {
            // var main_key_id = key.split('_')[3] == undefined? "0" : key.split('_')[3];
            var main_next_key_id = main_keys[MainIndex + 1];
            var main_next_key_id_temp =
              main_next_key_id == undefined
                ? '100'
                : main_next_key_id.split('_')[3];

            if (
              Number(main_key_id) < Number(next_key_id_temp) &&
              Number(main_key_id) >= Number(key_id)
            ) {
              const sub_keys = Object.keys(Jsondata[sub]);
              var temp_sub: {
                SubColumnId: number;
                MainColumnId: number;
                Name: any;
                Sort: number;
              }[] = [];
              sub_keys.forEach((key, SubIndex) => {
                var sub_key_id =
                  key.split('_')[3] == undefined ? '0' : key.split('_')[3];
                if (Jsondata[sub][key] != 'sub') {
                  var sub_next_key_id = sub_keys[SubIndex + 1];
                  var sub_next_key_id_temp =
                    sub_next_key_id == undefined
                      ? '100'
                      : sub_next_key_id.split('_')[3];

                  if (
                    Number(sub_key_id) < Number(main_next_key_id_temp) &&
                    Number(sub_key_id) >= Number(main_key_id)
                  ) {
                    const more_sub_keys = Object.keys(Jsondata[more]);
                    var temp_more_sub: {
                      MoreSubColumnId: number;
                      SubColumnId: number;
                      Name: any;
                      Sort: number;
                    }[] = [];
                    more_sub_keys.forEach((key, MoreSubIndex) => {
                      var more_sub_key_id =
                        key.split('_')[3] == undefined
                          ? '0'
                          : key.split('_')[3];

                      if (Jsondata[more][key] != 'more') {
                        if (
                          Number(more_sub_key_id) <
                            Number(sub_next_key_id_temp) &&
                          Number(more_sub_key_id) >= Number(sub_key_id)
                        ) {
                          var more_sub_info: {
                            InformationId: number;
                            Name: any;
                            SubColumnId: number;
                          }[] = [];
                          for (
                            let index = dataindex;
                            index < Jsondata.length;
                            index++
                          ) {
                            const info_data = Object.keys(Jsondata[index]);
                            info_data.forEach((key, infoIndex) => {
                              var info_id =
                                key.split('_')[3] == undefined
                                  ? '0'
                                  : key.split('_')[3];

                              if (Jsondata[dataindex][key] != 'data') {
                                if (
                                  Number(info_id) == Number(more_sub_key_id)
                                ) {
                                  var info_obj = {
                                    InformationId: infoIndex,
                                    Name: String(Jsondata[index][key]),
                                    SubColumnId: MainIndex,
                                  };

                                  more_sub_info.push(info_obj);
                                }
                              }
                            });
                          }

                          var joinData_temp_more_sub = more_sub_info
                            .map((x) => x.Name)
                            .join('||');
                          var joined =
                            more_sub_info.length == 0
                              ? []
                              : [{ Name: joinData_temp_more_sub }];

                          var more_sub_obj = {
                            MoreSubColumnId: MoreSubIndex,
                            SubColumnId: SubIndex,
                            Name: String(Jsondata[more][key]),
                            Sort: MoreSubIndex + 1,
                            Informations: joined, // more_sub_info,
                          };
                          temp_more_sub.push(more_sub_obj);
                        }
                      }
                    });

                    var main_info_sub: {
                      InformationId: number;
                      Name: any;
                      SubColumnId: number;
                    }[] = [];

                    for (
                      let index = dataindex;
                      index < Jsondata.length;
                      index++
                    ) {
                      const info_data = Object.keys(Jsondata[index]);
                      info_data.forEach((key, infoIndex) => {
                        if (Jsondata[dataindex][key] != 'data') {
                          var info_id =
                            key.split('_')[3] == undefined
                              ? '0'
                              : key.split('_')[3];
                          if (temp_more_sub.length == 0) {
                            if (Number(info_id) == Number(sub_key_id)) {
                              var info_obj = {
                                InformationId: infoIndex,
                                Name: String(Jsondata[index][key]),
                                SubColumnId: MainIndex,
                              };

                              main_info_sub.push(info_obj);
                            }
                          }
                        }
                      });
                    }

                    var joinData_sub_obj = main_info_sub
                      .map((x) => x.Name)
                      .join('||');

                    var joined =
                      main_info_sub.length == 0
                        ? []
                        : [{ Name: joinData_sub_obj }];
                    var sub_obj = {
                      SubColumnId: SubIndex,
                      MainColumnId: MainIndex,
                      Name: String(Jsondata[sub][key]),
                      Sort: SubIndex + 1,
                      MoreSubColumns: temp_more_sub,
                      Informations: joined, //main_info_sub
                    };
                    temp_sub.push(sub_obj);
                  }
                }
              });

              //Add information
              var main_info: {
                InformationId: number;
                Name: any;
                MainColumnId: number;
              }[] = [];
              for (let index = dataindex; index < Jsondata.length; index++) {
                const info_keys = Object.keys(Jsondata[index]);
                info_keys.forEach((key, infoIndex) => {
                  var info_key_id =
                    key.split('_')[3] == undefined ? '0' : key.split('_')[3];

                  if (Jsondata[index][key] != 'data') {
                    if (temp_sub.length == 0) {
                      if (Number(info_key_id) == Number(main_key_id)) {
                        var info_obj = {
                          InformationId: infoIndex,
                          Name: String(Jsondata[index][key]),
                          MainColumnId: MainIndex,
                        };
                        main_info.push(info_obj);
                      }
                    }
                  }
                });
              }

              var joinData_temp_main = main_info.map((x) => x.Name).join('||');

              var joined =
                main_info.length == 0 ? [] : [{ Name: joinData_temp_main }];

              var main_obj = {
                MainColumnId: MainIndex,
                DataBuilderId: Builderindex,
                Name: String(Jsondata[main][key]),
                Sort: MainIndex + 1,
                SubColumns: temp_sub,
                Informations: joined, //main_info,
              };
              temp_main.push(main_obj);
            }
          }
        });

        var builder_obj = {
          DataBuilderId: Builderindex,
          BranchId: null,

          Title: Jsondata[0][key],
          Details: Jsondata[0][key] + '|' + this.remark, // remark holder for saving response
          UserId: this.userId.toString() as unknown as number,
          AgencyId: 0,
          munCityId: '112317', // default: real value in server
          Year: 2023,
          DataResponseId: 8, // just holding the value
          MainColumns: temp_main,
        };
        temp_builder.push(builder_obj);
      });

      databuilder.push(temp_builder);

      console.log(databuilder[0]);
      this.jsonData = databuilder[0];
      this.convertedJson = JSON.stringify(databuilder[0], undefined, 4);
    };
  }

  remark: any;
  saveData() {
    console.log(this.jsonData);
    // let dataindex = Jsondata.map((item: { temp1: any; }) => item.temp1).indexOf("data");
    this.jsonData.map((item: { Details: string }) => {
      item.Details = item.Details.split('|')[0] + '|' + this.remark;
    });

    this.pdfp
      .Postupload(this.jsonData)

      .pipe(delay(1000))
      .subscribe((data) => {
        console.log('--------------');
        this.backClicked();
      });
  }
}
