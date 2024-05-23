import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare var $:any

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent {
  birthDefectsVal:any
  treatmentsVal:any;
  constructor(){}
  AnswerExamForm:FormGroup = new FormGroup({
    '1':new FormControl('',[Validators.required]),
    '2':new FormControl('',[Validators.required]),
    '3':new FormControl('',[Validators.required]),
    '4':new FormControl('',[Validators.required]),
    '5':new FormControl('',[Validators.required]),
    '6':new FormControl('',[Validators.required]),
    '7':new FormControl('',[Validators.required]),
    '8':new FormControl('',[Validators.required]),
    '9':new FormControl('',[Validators.required]),
    '10':new FormControl('',[Validators.required]),
    '11':new FormControl('',[Validators.required]),
    '12':new FormControl('',[Validators.required]),
    '13':new FormControl('',[Validators.required]),
    '14':new FormControl('',[Validators.required])
  })
  submitQuestions(){
    console.log(this.AnswerExamForm.value);
  }
  getBirthDefects(value:any){
    this.birthDefectsVal=value 
  }
  getTreatments(value:any){
    this.treatmentsVal=value
  }

  inCaseDisease(){
    if(this.birthDefectsVal==0||this.treatmentsVal==0){
      $("#existedDisease").show(300)
    }else if (this.birthDefectsVal==1 && this.treatmentsVal==1){
      $("#existedDisease").hide(300)
    }
  }
}
