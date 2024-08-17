import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { FileManagerModule, FileManagerAllModule  } from '@syncfusion/ej2-angular-filemanager'
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-file-manager',
  standalone: true,
  imports: [FileManagerModule, FileManagerAllModule],
  templateUrl: './file-manager.component.html',
  styleUrl: './file-manager.component.scss'
})
export class FileManagerComponent {
public hostUrl: string = 'https://ej2-aspcore-service.azurewebsites.net/';
  public ajaxSettings: object = {
    url: this.hostUrl + 'api/FileManager/FileOperations',
    downloadUrl: this.hostUrl + 'api/FileManager/Download',
    uploadUrl: this.hostUrl + 'api/FileManager/Upload',
    getImageUrl: this.hostUrl + 'api/FileManager/GetImage'
  };




}
