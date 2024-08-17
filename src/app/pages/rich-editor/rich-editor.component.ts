import { UploadFileService } from './../../core/services/upload/upload-file.service';
import { Component, ViewChild  } from '@angular/core';
import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditorboxService } from '../../core/services/upload/editorbox.service';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { catchError, finalize, map, Observable, of, tap, throwError } from 'rxjs';
import { AngularEditorComponent } from '@kolkov/angular-editor';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


interface UploadResponse {
  imageUrl: string;
  html?: string;
}
@Component({
  selector: 'app-rich-editor',
  standalone: true,
  imports: [AngularEditorModule, FormsModule, CommonModule, ProgressSpinnerModule],
  templateUrl: './rich-editor.component.html',
  styleUrl: './rich-editor.component.scss'
})
export class RichEditorComponent {
  @ViewChild(AngularEditorComponent)
  private angularEditor!: AngularEditorComponent;

  htmlContent: string = '';
  isLoading: boolean = false;
  constructor(private UploadFileService: UploadFileService) {}

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '250px',
    minHeight: '200px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: 'div',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
      {
        name: 'center-image',
        class: 'center-image',
      },
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    upload: (file: File): Observable<HttpEvent<UploadResponse>> => {
      this.isLoading = true;
      return this.UploadFileService.uploadImage(file,'upload_images').pipe(
        map(event => {
          if (event instanceof HttpResponse) {
            const imageUrl = event.body?.imageUrl;
            if (imageUrl) {
              return new HttpResponse<UploadResponse>({
                body: { imageUrl: imageUrl }
              });
            }
          }
          return event;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      );
    }
  }



  insertHtml(html: string) {
    if (this.angularEditor) {
      // Chèn HTML vào vị trí con trỏ trong editor
      this.angularEditor.executeCommand('insertHtml', html);
    } else {
      console.error('Angular Editor not initialized');
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result;
        this.insertImage(base64);
      };
      reader.readAsDataURL(file);
    }
  }

  insertImage(base64: string) {
    this.htmlContent += `<img src="${base64}" alt="Image">`;
  }
}
