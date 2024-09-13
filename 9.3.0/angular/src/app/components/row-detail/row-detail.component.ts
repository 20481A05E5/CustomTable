
import { Component, Input, Output, EventEmitter, NgModule, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponentBase } from '@shared/app-component-base';


@Component({
  selector: 'app-row-detail',
  
  templateUrl: './row-detail.component.html',
  styleUrl: './row-detail.component.scss'
})
export class RowDetailComponent extends AppComponentBase {
  @Input() rowData: any; 
  @Input() id : any;
  @Input() order?: string = '';
  @Input() questions?: string = '';
  @Input() popup?: boolean = false;
  @Input() startSurvey?: boolean = false;
  @Output() saveEvent = new EventEmitter<any>();
  canUpdate: boolean = false;
  
  constructor(
    injector: Injector,
    
  ) {
    super(injector);
  }
 
  ngOnInit() {
    this.checkPermissions();
  }

  checkPermissions() {
    this.canUpdate = abp.auth.isGranted('Pages.SurveyEditor.Update');
  }
  

  expandTextarea() {
    const textarea = document.getElementById('questionsTextarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto'; 
      textarea.style.height = textarea.scrollHeight + 'px'; 
    
    }
  }
  

  save() {
    const data = {
      id: this.id,
      order: this.order,
      questions: this.questions,
      popup: this.popup,
      startSurvey: this.startSurvey
    };
    console.log(data);
    this.saveEvent.emit(data);  // Emit the data to the parent component//

}
}
