import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items:any[] , term:any): any {
    if(term == undefined){
      return items;
    }

    return items.filter(function(items){
      if(items.firstName!=null){
        return items.firstName.toLowerCase().includes(term.toLowerCase()) || items.lastName.toLowerCase().includes(term.toLowerCase())
      }else if(items.name!=null){
        return items.name.toLowerCase().includes(term.toLowerCase())
      }
      // else if(items.insuranceClass!=null){
      //   return items.insuranceClass.toLowerCase().includes(term.toLowerCase()) || items.commissionType.toLowerCase().includes(term.toLowerCase())||  items.commissionType.businessType().includes(term.toLowerCase())
      // }
      else if(items.planName!=null){
        return items.planName.toLowerCase().includes(term.toLowerCase()) || items.typeOfService.toLowerCase().includes(term.toLowerCase())
      }else if(items.benefitType!=null){
        return items.benefitType.toLowerCase().includes(term.toLowerCase()) || items.name.toLowerCase().includes(term.toLowerCase()) 
      }

      
      else if(items.code!=null){
        return items.code.includes(term) ||items.insuredName.toLowerCase().includes(term.toLowerCase())||items.tpaName.toLowerCase().includes(term.toLowerCase())
      }

  })
          // if(items.firstName!=null){
      //   return items.firstName.toLowerCase().includes(term.toLowerCase())
      // }
      // else if(items.educationName!=null){
      //   return items.educationName.toLowerCase().includes(term.toLowerCase())
      // }

  }

}
