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

  const selectedFile = event.target.files[0];
  if (!selectedFile) return;

  const fileReader = new FileReader();

  fileReader.onload = (e: any) => {
    try {
      const arrayBuffer = e.target.result;

      // Read Excel file
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // Convert first sheet to JSON
      const sheetName = workbook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      console.log("Excel JSON:", data);

      // Save JSON
      this.convertedJson = JSON.stringify(data, null, 4);
      const Jsondata = JSON.parse(this.convertedJson);

      if (!Jsondata || Jsondata.length === 0) {
        console.error("Excel file is empty or invalid format");
        return;
      }

      // -------------------------
      // FIND ROW INDEXES
      // -------------------------
      const getIndex = (key: string) =>
        Jsondata.map((x: any) => x.template).indexOf(key);

      const dataindex = getIndex("data");
      const main = getIndex("main");
      const sub = getIndex("sub");
      const more = getIndex("more");

      console.log("Indexes:", { dataindex, main, sub, more });

      if (dataindex === -1 || main === -1 || sub === -1 || more === -1) {
        //console.error("Missing required template rows in Excel");
        return;
      }

      // -------------------------
      // SAFELY READ BUILDER KEYS
      // -------------------------
      const builder_keys = Object.keys(Jsondata[0] || {});
      if (builder_keys.length === 0) {
        console.error("Jsondata[0] is empty");
        return;
      }

      const databuilder: any[] = [];
      const temp_builder: any[] = [];

      builder_keys.forEach((key, Builderindex) => {

        const key_id =
          key.split("_")[3] == null ? "0" : key.split("_")[3];

        const next_key_id =
          builder_keys[Builderindex + 1] || "100_0_0_100";
        const next_key_id_temp = next_key_id.split("_")[3];

        const main_keys = Object.keys(Jsondata[main] || {});
        const temp_main: any[] = [];

        // -------------------------
        // PROCESS MAIN LEVEL
        // -------------------------
        main_keys.forEach((key, MainIndex) => {
          const main_key_id =
            key.split("_")[3] == null ? "0" : key.split("_")[3];

          if (Jsondata[main][key] !== "main") {

            const main_next_key_id =
              main_keys[MainIndex + 1] || "100_0_0_100";
            const main_next_key_id_temp =
              main_next_key_id.split("_")[3];

            // MAIN FILTER
            if (
              Number(main_key_id) < Number(next_key_id_temp) &&
              Number(main_key_id) >= Number(key_id)
            ) {
              const sub_keys = Object.keys(Jsondata[sub] || {});
              const temp_sub: any[] = [];

              // -------------------------
              // PROCESS SUB LEVEL
              // -------------------------
              sub_keys.forEach((key, SubIndex) => {
                const sub_key_id =
                  key.split("_")[3] == null ? "0" : key.split("_")[3];

                if (Jsondata[sub][key] !== "sub") {
                  const sub_next_key_id =
                    sub_keys[SubIndex + 1] || "100_0_0_100";
                  const sub_next_key_id_temp =
                    sub_next_key_id.split("_")[3];

                  // SUB FILTER
                  if (
                    Number(sub_key_id) < Number(main_next_key_id_temp) &&
                    Number(sub_key_id) >= Number(main_key_id)
                  ) {

                    const more_sub_keys = Object.keys(Jsondata[more] || {});
                    const temp_more_sub: any[] = [];

                    // -------------------------
                    // MORE-SUB LEVEL
                    // -------------------------
                    more_sub_keys.forEach((key, MoreSubIndex) => {
                      const more_sub_key_id =
                        key.split("_")[3] == null
                          ? "0"
                          : key.split("_")[3];

                      if (Jsondata[more][key] !== "more") {

                        if (
                          Number(more_sub_key_id) <
                            Number(sub_next_key_id_temp) &&
                          Number(more_sub_key_id) >= Number(sub_key_id)
                        ) {

                          const more_sub_info: any[] = [];

                          for (let i = dataindex; i < Jsondata.length; i++) {
                            const info_keys = Object.keys(Jsondata[i] || {});
                            info_keys.forEach((key2, infoIndex) => {
                              const info_id =
                                key2.split("_")[3] == null
                                  ? "0"
                                  : key2.split("_")[3];

                              if (Jsondata[dataindex][key2] !== "data") {
                                if (Number(info_id) === Number(more_sub_key_id)) {
                                  more_sub_info.push({
                                    InformationId: infoIndex,
                                    Name: String(Jsondata[i][key2]),
                                    SubColumnId: MainIndex,
                                  });
                                }
                              }
                            });
                          }

                          const joined =
                            more_sub_info.length === 0
                              ? []
                              : [
                                  {
                                    Name: more_sub_info
                                      .map((x) => x.Name)
                                      .join("||"),
                                  },
                                ];

                          temp_more_sub.push({
                            MoreSubColumnId: MoreSubIndex,
                            SubColumnId: SubIndex,
                            Name: String(Jsondata[more][key]),
                            Sort: MoreSubIndex + 1,
                            Informations: joined,
                          });
                        }
                      }
                    });

                    // -------------------------
                    // SUB INFO
                    // -------------------------
                    const main_info_sub: any[] = [];

                    for (let i = dataindex; i < Jsondata.length; i++) {
                      const info_keys = Object.keys(Jsondata[i] || {});
                      info_keys.forEach((key2, infoIndex) => {
                        const info_id =
                          key2.split("_")[3] == null ? "0" : key2.split("_")[3];

                        if (Jsondata[dataindex][key2] !== "data") {
                          if (temp_more_sub.length === 0) {
                            if (Number(info_id) === Number(sub_key_id)) {
                              main_info_sub.push({
                                InformationId: infoIndex,
                                Name: String(Jsondata[i][key2]),
                                SubColumnId: MainIndex,
                              });
                            }
                          }
                        }
                      });
                    }

                    const joined =
                      main_info_sub.length === 0
                        ? []
                        : [
                            {
                              Name: main_info_sub
                                .map((x) => x.Name)
                                .join("||"),
                            },
                          ];

                    temp_sub.push({
                      SubColumnId: SubIndex,
                      MainColumnId: MainIndex,
                      Name: String(Jsondata[sub][key]),
                      Sort: SubIndex + 1,
                      MoreSubColumns: temp_more_sub,
                      Informations: joined,
                    });
                  }
                }
              });

              // -------------------------
              // MAIN INFO
              // -------------------------
              const main_info: any[] = [];

              for (let i = dataindex; i < Jsondata.length; i++) {
                const info_keys = Object.keys(Jsondata[i] || {});
                info_keys.forEach((key2, infoIndex) => {
                  const info_key_id =
                    key2.split("_")[3] == null ? "0" : key2.split("_")[3];

                  if (Jsondata[i][key2] !== "data") {
                    if (temp_sub.length === 0) {
                      if (Number(info_key_id) === Number(main_key_id)) {
                        main_info.push({
                          InformationId: infoIndex,
                          Name: String(Jsondata[i][key2]),
                          MainColumnId: MainIndex,
                        });
                      }
                    }
                  }
                });
              }

              const joined =
                main_info.length === 0
                  ? []
                  : [
                      {
                        Name: main_info.map((x) => x.Name).join("||"),
                      },
                    ];

              temp_main.push({
                MainColumnId: MainIndex,
                DataBuilderId: Builderindex,
                Name: String(Jsondata[main][key]),
                Sort: MainIndex + 1,
                SubColumns: temp_sub,
                Informations: joined,
              });
            }
          }
        });

        // -------------------------
        // BUILDER OBJECT
        // -------------------------
        temp_builder.push({
          DataBuilderId: Builderindex,
          BranchId: null,
          Title: Jsondata[0][key],
          Details: Jsondata[0][key] + "|" + this.remark,
          UserId: +this.userId,
          AgencyId: 0,
          munCityId: "112317",
          Year: 2023,
          DataResponseId: 8,
          MainColumns: temp_main,
        });
      });

      databuilder.push(temp_builder);

      this.jsonData = databuilder[0];
      this.convertedJson = JSON.stringify(databuilder[0], null, 4);

      console.log("Final Output:", this.jsonData);

    } catch (err) {
      console.error("Error reading file:", err);
    }
  };

  fileReader.readAsArrayBuffer(selectedFile);
}


  remark: any;
  saveData() {
  // Ensure we have a proper flat array
  if (!this.jsonData || this.jsonData.length === 0) {
    console.error("No data to upload");
    return;
  }

  // Update remarks
  this.jsonData.forEach((item: any) => {
    item.Details = item.Details.split('|')[0] + '|' + this.remark;
  });

  console.log("Final JSON to upload:", this.jsonData);

  this.pdfp
    .Postupload(this.jsonData)
    .pipe(delay(1000))
    .subscribe({
      next: (data) => {
        console.log('Upload successful', data);
        this.backClicked();
      },
      error: (err) => {
        console.error('Upload failed', err);
      }
    });
}

}
