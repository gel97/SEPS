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
    
    // Define the table headers
    const tableHeaderss = tableHeaders;
    let tHeaders = [];
    console.log(tableHeaderss);
    const groupedData: { [key: string]: { [key: string]: any[] } }[] = [];

    data.forEach((item: any) => {
      const munCityName = item.munCityName;
      const setYear = item.setYear;
  
      let munCityNameObj = groupedData.find((obj) => obj[munCityName]);
      if (munCityNameObj) {
        if (munCityNameObj[munCityName][setYear]) {
          munCityNameObj[munCityName][setYear].push(item);
        } else {
          munCityNameObj[munCityName][setYear] = [item];
        }
      } else {
        munCityNameObj = { [munCityName]: { [setYear]: [item] } };
        groupedData.push(munCityNameObj);
      }
    });
    console.log("groupedData: ", groupedData);
  
    const tableData: any[][] = [];
    
    // groupedData.forEach((munCityNameObj) => {
    //   const munCityName = Object.keys(munCityNameObj)[0];
    //   const setYearData = munCityNameObj[munCityName];
  
    //   tableData.push([{ text: munCityName, colSpan: 4, bold: true, alignment: 'center' },{},{},{}]);
    //   const sortedYears = Object.keys(setYearData).sort((a, b) => +b - +a); // Sort years in descending order

    //   for (const setYear in setYearData) {
    //     if (setYearData.hasOwnProperty(setYear)) {
    //       const setYearItems = setYearData[setYear];
  
    //       tableData.push([{ text: setYear, colSpan: 4, bold: true, alignment: 'center' },{},{},{}]);
  
    //       setYearItems.forEach((item: any) => {
    //         tableData.push([
    //          item.brgyName,
    //          item.punongBrgy,
    //          item.contactNo,
    //          item.setYear,
    //         ]);
    //       });
    //     }
    //   }
    // });
    console.log("tableData: ", tableData);
    groupedData.forEach((munCityNameObj) => {
      const munCityName = Object.keys(munCityNameObj)[0];
      const setYearData = munCityNameObj[munCityName];
  
      tableData.push([{ text: munCityName, colSpan: 6, bold: true, alignment: 'center' },{},{},{},{},{}]);

      const sortedYears = Object.keys(setYearData).sort((a, b) => +b - +a); // Sort years in descending order
      
      sortedYears.forEach((setYear, index) => {
        const yearItems = setYearData[setYear];
        const theader = tableHeaders;
        tableData.push([{ text: setYear, colSpan: 6, bold: true, alignment: 'center' },{},{},{},{},{}]);
        tableData.push(theader);
        // tableData.push([
        //   tableHeaderss[0],
        //   tableHeaderss[1],
        //   tableHeaderss[2],
        //   tableHeaderss[3],
        //   tableHeaderss[4],
        //   tableHeaderss[5],

        // ]);
        
        yearItems.forEach((item: any) => {
          tableData.push([
            item.brgyName,
            item.punongBrgy,
            item.contactNo,
            item.setYear,
            item.landArea,
            item.address,
          ]);
        });



      });
      console.log("sortedYears: ", sortedYears);

    });
    console.log("tableData: ", tableData);

    const def = {
    	content: [
        {
          style: 'tableExample',
          table: {
            headerRows: 2,
            widths: ['*', '*', '*', '*','*','*'],
            body: tableData
          }
        },
      ],
    
    };
   this.pdfMake.createPdf(def).open();
  }

  // async GeneratePdf(data:any=[], tableHeaders:any = []) {
  //   console.log(data);
  //   await this.loadPdfMaker();
    
  //   // Define the table headers
  //   const tableHeaderss = tableHeaders;
  //   console.log(tableHeaderss);

  //   // Initialize an empty array for table rows
  //   //const tableRowss: any[][] = [];
    
  //   // Generate table rows dynamically using forEach loop
  //   // data.forEach((item:any) => {
  //   //   const row = [item.name, item.age, item.city];
  //   //   tableRowss.push(row);
  //   // });
    
  //   // Define the table structure
  //   //const table = {
  //   //   table: {
  //   //     widths: ['*', '*', '*'], // Adjust column widths as needed
  //   //     body: [
  //   //       tableHeaderss, // Table headers
  //   //       ...tableRowss // Table rows
  //   //     ]
  //   //   }
  //   // };

  //   let groupedData:any= []; 
  //   const groupedDataSetYear: { [key: string]: any[] } = {}; 

  //   // Group the data based on the "munCityName" column
  //   data.forEach((item:any) => {
  //     const munCityName = item.munCityName; // Replace "munCityName" with the actual column name
  //     const setYear = item.setYear; // Replace "munCityName" with the actual column name

  //   //   if (groupedData[munCityName]) {
  //   //     groupedData[munCityName].push(item);
  //   //   } else {
  //   //     groupedData[munCityName] = [item];
  //   //   }
  //   // });
  //   if (groupedData[munCityName]) {
  //     if (groupedData[munCityName][setYear]) {
  //       groupedData[munCityName][setYear].push(item);
  //     } else {
  //       groupedData[munCityName][setYear] = [item];
  //     }
  //   } else {
  //     groupedData[munCityName] = { [setYear]: [item] };
  //   }
  // });
  //   console.log("groupedData: ", groupedData);
  
  //   let tableData:any = [];
  
  //   //Generate the table data from the grouped data
  //   // for (const munCityName in groupedData) {

  //   //   if (groupedData.hasOwnProperty(munCityName)) {
  //   //     const munCityNameItems = groupedData[munCityName];
  
  //   //     // Add munCityName header row
  //   //     tableData.push([{ text: munCityName, colSpan: 3, bold: true, alignment: 'center' }, {},{}]);

        
  //   //     // Add category items
  //   //     munCityNameItems.forEach((item:any) => {
  //   //       tableData.push([
  //   //         item.brgyName, // Replace 'column1' with the actual column names
  //   //         item.punongBrgy,
  //   //         item.setYear,
  //   //       ]);
  //   //     });
  //   //   }
  //   // }
  //   // console.log("tableData: ", tableData);

  //   groupedData.forEach((munCityNameObj:any) => {
  //     console.log("munCityName: ");
  //     console.log("setYearData: ");

  //     const munCityName = Object.keys(munCityNameObj)[0];
  //     const setYearData = munCityNameObj[munCityName];
      
  //     tableData.push([{ text: munCityName, colSpan: 1, bold: true, alignment: 'center' }]);
  //     console.log("tableData: ", tableData);

  //     for (const setYear in setYearData) {
  //       if (setYearData.hasOwnProperty(setYear)) {
  //         const setYearItems = setYearData[setYear];
  
  //         tableData.push([{ text: setYear, colSpan: 1, bold: true, alignment: 'center' }]);
  
  //         // setYearItems.forEach((item: any) => {
  //         //   tableData.push([
  //         //     item.brgyName,
  //         //     item.punongBrgy,
  //         //     item.contactNo,
  //         //     item.setYear,
  //         //   ]);
  //         // });
  //       }
  //     }
  //   });


  //   const def = {
  //   	content: [
  //       {
  //         style: 'tableExample',
  //         table: {
  //           headerRows: 2,
  //           widths: ['*'],
  //           body: tableData
  //         }
  //       },
  //     ],
    
  //   };
  //  // this.pdfMake.createPdf(def).open();
  // }
}
