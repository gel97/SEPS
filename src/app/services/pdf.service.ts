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

  async GeneratePdf(data:any=[], tableHeaders:any = []) {
    console.log(data);
    await this.loadPdfMaker();

    const dataa = [
      { name: 'John', age: 25, city: 'New York' },
      { name: 'Jane', age: 30, city: 'London' },
      { name: 'Mike', age: 35, city: 'Paris' }
    ];
    
    // Define the table headers
    const tableHeaderss = ['Name', 'Age', 'City'];
    
    // Initialize an empty array for table rows
    const tableRowss: any[][] = [];
    
    // Generate table rows dynamically using forEach loop
    data.forEach((item:any) => {
      const row = [item.name, item.age, item.city];
      tableRowss.push(row);
    });
    
    // Define the table structure
    const table = {
      table: {
        widths: ['*', '*', '*'], // Adjust column widths as needed
        body: [
          tableHeaderss, // Table headers
          ...tableRowss // Table rows
        ]
      }
    };

    const def = {
    	content: [
        {
          text: 'This is a header (whole paragraph uses the same header style)\n\n',
          style: 'header'
        },
        {
          text: [
            'It is however possible to provide an array of texts ',
            'to the paragraph (instead of a single string) and have ',
            {text: 'a better ', fontSize: 15, bold: true},
            'control over it. \nEach inline can be ',
            {text: 'styled ', fontSize: 20},
            {text: 'independently ', italics: true, fontSize: 40},
            'then.\n\n'
          ]
        },
        {text: 'Mixing named styles and style-overrides', style: 'header'},
        {
          style: 'bigger',
          italics: false,
          text: [
            'We can also mix named-styles and style-overrides at both paragraph and inline level. ',
            'For example, this paragraph uses the "bigger" style, which changes fontSize to 15 and sets italics to true. ',
            'Texts are not italics though. It\'s because we\'ve overriden italics back to false at ',
            'the paragraph level. \n\n',
            'We can also change the style of a single inline. Let\'s use a named style called header: ',
            {text: 'like here.\n', style: 'header'},
            'It got bigger and bold.\n\n',
            'OK, now we\'re going to mix named styles and style-overrides at the inline level. ',
            'We\'ll use header style (it makes texts bigger and bold), but we\'ll override ',
            'bold back to false: ',
            {text: 'wow! it works!', style: 'header', bold: false},
            '\n\nMake sure to take a look into the sources to understand what\'s going on here.'
          ]
        }
      ],
    
    };
    this.pdfMake.createPdf(def).open();
  }
}
