import { Injectable } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
//pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  pdfMake: any;

  constructor() {}

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import("pdfmake/build/pdfmake");
      const pdfFontsModule = await import("pdfmake/build/vfs_fonts");
      this.pdfMake = pdfMakeModule;
      this.pdfMake.vfs = pdfFontsModule.pdfMake.vfs;
    }
  }

  async GeneratePdf(data:any=[]) {
    console.log(data);
    await this.loadPdfMaker();
   
    const def = {
      header: {
        columns: [
          {
            image: await this.getBase64ImageFromURL(
              "assets/img/davnor.png") 
              ,            
            width: 60,
            height:60,
            marginLeft: 100,
          },
          {
            text: 'Provincial Government of Davao del Norte', // Add the title text
            fontSize: 16, // Adjust the font size of the title as needed
            bold: true, // Make the title bold if desired
            alignment: 'center',
            margin: [0, 10] // Adjust the margin around the title as needed
          }
        ],
        margin: [10, 10] // Adjust the margin around the header as needed
      },
    	content: data,
    };
   this.pdfMake.createPdf(def).open();
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
    });}

}
