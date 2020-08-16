import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-file-input',
    templateUrl: './file-input.component.html',
    styleUrls: ['./file-input.component.scss'],
})
export class FileInputComponent implements OnInit {
    @ViewChild('fileDropRef', { static: false }) fileDropEl: ElementRef;
    @Input() isView: boolean;
    @Input() multiple = false;
    @Input() allowedTypes = ['image/gif', 'image/jpeg', 'image/png', 'video/mp4'];
    @Input() existingFiles = [];
    files: any[] = [];

    @Output() fileDone: EventEmitter<any> = new EventEmitter<any>();
    @Output() deleteFile: EventEmitter<any> = new EventEmitter<any>();


    constructor(private snackBar: MatSnackBar) {}


    ngOnInit(): void {}


    /**
     * on file drop handler
     */
    onFileDropped($event) {
        this.prepareFilesList($event);
    }

    /**
     * handle file from browsing
     */
    fileBrowseHandler(files) {
        this.prepareFilesList(files);
    }

    /**
     * Delete file from files list
     * @param index (File index)
     */
    deleteFileAction(index: number) {
        this.deleteFile.emit(this.files[index]);
        this.files.splice(index, 1);
    }

    // saveFile(index: number) {
    //     const file = this.files[index];
    //     if (window.navigator.msSaveOrOpenBlob) { // IE10+
    //         window.navigator.msSaveOrOpenBlob(file, file.name);
    //     } else { // Others
    //         const a = document.createElement('a')
    //         const url = URL.createObjectURL(file);
    //         a.href = url;
    //         a.download = file.name;
    //         a.style.display = 'none';
    //         document.body.appendChild(a);
    //         a.click();
    //         setTimeout(() => {
    //             document.body.removeChild(a);
    //             window.URL.revokeObjectURL(url);
    //         }, 0);
    //     }
    // }

    /**
     * Convert Files list to normal array list
     * @param files (Files List)
     */
    prepareFilesList(files: Array<any>) {
        if (!this.multiple) {
            this.files = [];
        }
        let index = 0;
        for (const item of files) {
            if (this.isTypeAllowed(item)) {
                item.progress = 0;
                const name = this.getUniqueNameForFile(item, 0);
                this.files.push(item);
                index++;
                if (!this.multiple) {
                    break;
                }
            } else {
                this.snackBar.open('File with name: ' + item.name + ' is not allowed', 'Ok');
            }
        }
        this.fileDone.emit(this.files);
        this.fileDropEl.nativeElement.value = '';
    }

    getUniqueNameForFile(file, increment: number) {
        const nameParts = file.name.split('.');
        nameParts[0] = nameParts[0] + '(' + increment + ')';
        const newFileName = increment === 0 ? file.name : nameParts.join('.');
        for (const currentFile of this.files) {
            if (currentFile.name === newFileName) {
                increment++;
                return this.getUniqueNameForFile(file, increment);
            }
        }
        return newFileName;
    }

    isTypeAllowed(file) {
        return file && this.allowedTypes.includes(file.type);
    }

    isImage(file) {
        return ['image/gif', 'image/jpeg', 'image/png'].includes(file.type);
    }

    /**
     * format bytes
     * @param bytes (File size in bytes)
     * @param decimals (Decimals point)
     */
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const dm = decimals <= 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

}
