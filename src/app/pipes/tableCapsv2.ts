import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableCapsv2'
})
export class TablesCapsv2Pipe implements PipeTransform {

  transform(element: any, ...args: unknown[]): unknown {


      $("#data-"+element.DataBuilderId).empty();

      var table = "<table id=" + 'main-' + element.DataBuilderId + " class='table table-bordered border-secondary mt-3'><tbody></tbody> </table><br/><br/>"
      $("#data-"+element.DataBuilderId).append(table);
      var tr1 = "<tr id=" + 'tr1-'+ element.DataBuilderId + "></tr>";
      $("#main-"+ element.DataBuilderId).append(tr1);

   
   
      var tempIds: any[]=[];
      var tempIds1: any[]=[];
      var trCount = 0;
   
      element.MainColumns.forEach((main:any, index:any)=>{
   
        //for colspan
        element.MainColumns.map((val:any)=> {
          if(val.SubColumns.length >0){
   
            if(main.SubColumns.length == 0){
              tempIds1.push(main.MainColumnId);
             }
   
            val.SubColumns.map((subs:any)=>{
              if(subs.MoreSubColumns.length >0){
   
               if(main.SubColumns.length == 0){
                tempIds.push(main.MainColumnId);
               }
   
              }
            });
          }
        });
   
        //push main - information
        
        
        if(trCount == 0){
            main.Informations.forEach((info:any) => {
              var splits = info.Name.split("||");
              trCount = splits.length;
            });
           }
       
        
       var th1 = "<th rowspan="+1+" colspan="+main.SubColumns.length+" id="+'thmain-'+ main.MainColumnId+">" + main.Name +"</th>";
        $("#tr1-"+ element.DataBuilderId).append(th1);
   
   
        if(main.SubColumns.length > 0){
          var tr2 = "<tr id=" + 'tr2-'+ element.DataBuilderId + "></tr>";
          $("#main-"+ element.DataBuilderId).append(tr2);
          // $("#thmain-" + main.MainColumnId).attr("rowspan", 3);
        }
   
        var count = 0;
   
          main.SubColumns.forEach((sub:any, index1:any)=>{
            if(trCount == 0){
                sub.Informations.forEach((info:any) => {
                  var splits = info.Name.split("||");
                  trCount = splits.length;
                });
              }
            
   
            var th2 = "<th rowspan="+1+" colspan="+sub.MoreSubColumns.length+" id="+'thsub-'+ index1 +">" + sub.Name +"</th>";
   
            $("#tr2-"+ element.DataBuilderId).append(th2);
   
              //#############
                if(sub.MoreSubColumns.length > 0){
                  var tr3 = "<tr id=" + 'tr3-'+ element.DataBuilderId + "></tr>";
                  $("#main-"+ element.DataBuilderId).append(tr3);
                }
                
                sub.MoreSubColumns.forEach((more:any, index2:any)=>{
                    if(trCount == 0){
                        more.Informations.forEach((info:any) => {
                          var splits = info.Name.split("||");
                          trCount = splits.length;
                        });
                      }
   
                  var th3 = "<th id="+'thmore-'+ index2 +">" + more.Name +"</th>";
                  $("#tr3-"+ element.DataBuilderId).append(th3);
   
                  count = count + 1;
                });
   
                if(sub.MoreSubColumns.length > 0){
                  $("#thmain-" + main.MainColumnId).attr("colspan", count);
                }
          });
         $("tbody").css("text-align", "center");
         $("tbody").css("vertical-align", "middle");
   
      });
   

      
       //Arrange table Header rowspan
      for (let index = 0; index < tempIds1.length; index++) {
        $("#thmain-"+ tempIds1[index]).attr("rowspan", 2);
      }
      for (let index = 0; index < tempIds.length; index++) {
        $("#thmain-"+ tempIds[index]).attr("rowspan", 3);
      }
     

      
  //create table row for data     


 

     for (let index = 0; index < trCount; index++) {
        var trdata = "<tr id=" + 'trData-'+ element.DataBuilderId + "-"+ (index + 1) +"></tr>";
        $("#main-" + element.DataBuilderId).append(trdata);
     }

     element.MainColumns.forEach((main:any, index:any)=>{
        //check information if has object
      if(main.Informations.length > 0){
        var splits = main.Informations[0].Name.split("||");
        // console.log("splits", splits);

        splits.forEach((data:any, index:any)=> {
              var thData = "<td>"+ data +"</td>";
              $("#trData-" + element.DataBuilderId + "-" + (index + 1) + "").append(thData);
        });

      }else{
        main.SubColumns.forEach((sub:any, index_sub: any)=> {
      //check sub information if has object
          if(sub.Informations.length > 0){

              var splits = sub.Informations[0].Name.split("||");
              // console.log("splits", splits);
              splits.forEach((data:any, index:any)=> {
                var thData = "<td>"+ data +"</td>";
                $("#trData-" + element.DataBuilderId + "-" + (index + 1) + "").append(thData);
              });

          }else{
            sub.MoreSubColumns.forEach((more: any, index_more:any)=> {
              var splits = more.Informations[0].Name.split("||");
              // console.log("splits", splits);
              splits.forEach((data:any, index:any)=> {
                var thData = "<td>"+ data +"</td>";
                $("#trData-" + element.DataBuilderId + "-" + (index + 1) + "").append(thData);
              });

            });
          }
          
        });
      }
    });
    return null;
  }

}
