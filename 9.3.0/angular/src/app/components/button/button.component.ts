import { Component, Output,EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {SurveyEditorServiceProxy,SurveyEditorDto} from '@shared/service-proxies/service-proxies';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { NotifyService } from 'abp-ng2-module';
import Swal from 'sweetalert2';





@Component({
  selector: 'app-button',
 
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  isModalOpen = false;
  newQuestion: SurveyEditorDto;

  @Output() onButtonClicked :EventEmitter<any>=new EventEmitter<any>();
  
  canCreate: boolean = false;
  
 
  checkPermissions() {
    this.canCreate = abp.auth.isGranted('Pages.SurveyEditor.Create');
  }
  
    
  ngOnInit(): void {
    this.checkPermissions();

}

  
  





  constructor(private gridDataService: SurveyEditorServiceProxy,private snackBar: MatSnackBar,private http: HttpClient,private notify: NotifyService) {
   
    this.newQuestion = new SurveyEditorDto();
  }

  
 
  openModal() {
    this.isModalOpen = true;
  }

 
  closeModal() {
    this.isModalOpen = false;
    this.onButtonClicked.emit(null);
  }

  showAlert() {
    Swal.fire({
      title: 'Success!',
      text: 'Data Updated',
      icon: 'success',
      position: 'top-end',
      toast: true,
      showConfirmButton: false,
      timer: 2000,
      customClass: {
        container: 'custom-swal-container'
      }
    });
  }
    
  saveQuestion() {
    
    
    this.gridDataService.createSurveyEditorData(this.newQuestion).subscribe({
      next: (response) => {
        console.log('Data saved successfully', response);
        this.showAlert();
      //   this.notify.success('Data Inserted', '', {
      //     positionClass: 'toast-top-center',
          
      // });
        this.onButtonClicked.emit(null);
        this.closeModal(); 
      },
      error: (error) => {
        console.error('Failed to save data', error);
      }
    });
    
  }


}

