import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModifyCityMunService {

  constructor() { }

  ModifyText(cityMunName:string){

    let data = "";

    const matchFound: boolean = cityMunName.includes("City");
    const matchFoundSamal: boolean = cityMunName.includes("Samal");

    if(matchFound){
      if(!matchFoundSamal){
        const modifiedText: string = cityMunName.replace("City", '');
        data = "City of "+ modifiedText;
      }
      else{
        data = cityMunName;
      }
    }
    else{
      data = "Municipality of " + cityMunName;
    }

    return data;
  }
}
