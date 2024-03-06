import { Injectable } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
//pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  pdfMake: any;
  remarks:string = "";

  constructor() {}

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import("pdfmake/build/pdfmake");
      const pdfFontsModule = await import("pdfmake/build/vfs_fonts");
      this.pdfMake = pdfMakeModule;
      this.pdfMake.vfs = pdfFontsModule.pdfMake.vfs;
    }
  }



    headerFunction = async (currentPage: any, pageCount: any) => {
    if (currentPage == 1) {
      const imageUrl = "assets/img/davnor.png";   
      const imageData = await this.getBase64ImageFromURL(imageUrl);
      return {
        columns: [
          {
            image: imageUrl,
            width: 60,
            height: 60,
            marginLeft: 100,
          },
          {
            text: 'Provincial Government of Davao del Norte',
            fontSize: 16,
            bold: true,
            alignment: 'center',
          }
        ],
      };
    }
    // Return null for other pages to have no header
    return null;
  };

  async GeneratePdf(data: any = [], isPortrait: boolean, remarks:string) {
    console.log(data);
    this.remarks = remarks;
    console.log(this.remarks);

    await this.loadPdfMaker();
    let _pageOrientation = isPortrait ? "portrait" : "landscape";

    const def = {
      header: (currentPage:any, pageCount:any) =>{  
        if(currentPage === 1){
        return {
        columns: [
          // {
          //   image: this.getBase64ImageFromURL("assets/img/davnor.png"),
          //   width: 60,
          //   height: 60,
          //   marginLeft: 100,
          // },
          {
            text: 'Provincial Government of Davao del Norte',
            fontSize: 16,
            bold: true,
            alignment: 'center',
          }
        ],
      }}else{
        return null;
      }
    },
      content: data,
      pageOrientation: _pageOrientation,
      pageSize: 'legal',
      footer: this.footerFunction.bind(this),
    };
    this.pdfMake.createPdf(def).open();
  }

  footerFunction(currentPage: any, pageCount: any) {
    return [ 
      {
        text: this.remarks,
        alignment: 'left',
        margin: [20, 0, 0, 0],
      },
      {
      text: 'Page ' + currentPage.toString() + ' of ' + pageCount.toString(),
      alignment: 'right',
      margin: [0, 0, 40, 20],
    }];
  }

  getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx!.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  
}
