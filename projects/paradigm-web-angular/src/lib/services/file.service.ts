/*!
 * Paradigm Framework - Angular Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Injectable } from '@angular/core';
import { ServiceBase } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class FileService extends ServiceBase
{
    /**
     * Reads a file as a blog.
     * @param file the file that needs to be read.
     * @param onProgress A progress handler to receive progress reports.
     */
    async readAsBlob(file: File, onProgress?: (percentage: number) => void): Promise<Blob>
    {
        return new Blob([await this.read(file, fileReader => fileReader.readAsArrayBuffer(file), onProgress)], { type: file.type });
    }

    /**
     * Reads a file as text.
     * @param file the file that needs to be read.
     * @param onProgress A progress handler to receive progress reports.
     */
    async readAsText(file: File, onProgress?: (percentage: number) => void): Promise<string>
    {
        return await this.read(file, fileReader => fileReader.readAsText(file), onProgress) as string;
    }

    /**
     * Reads a file as binary text.
     * @param file the file that needs to be read.
     * @param onProgress A progress handler to receive progress reports.
     */
    async readAsBinaryString(file: File, onProgress?: (percentage: number) => void): Promise<string>
    {
        return await this.read(file, fileReader => fileReader.readAsBinaryString(file), onProgress) as string;
    }

    /**
     * Reads a file and handles all the events and event removing.
     * @param file the file to read.
     * @param action the reading action.
     * @param progress a progress handler to report progress.
     */
    private read(file: File, action: (fileReader: FileReader) => void, progress?: (percentage: number) => void): Promise<string | ArrayBuffer>
    {
        return new Promise<string | ArrayBuffer>((resolve, reject) =>
        {
            const fileReader = new FileReader();

            function addEventListeners(): void
            {
                fileReader.addEventListener('progress', onProgress);
                fileReader.addEventListener('loadend', onLoadEnd);
                fileReader.addEventListener('error', onError);
            }

            function removeEventListeners(): void
            {
                fileReader.removeEventListener('progress', onProgress);
                fileReader.removeEventListener('loadend', onLoadEnd);
                fileReader.removeEventListener('error', onError);
            }

            function onProgress(e: ProgressEvent): void
            {
                if (e.lengthComputable)
                {
                    const percentLoaded = Math.round((e.loaded / e.total) * 100);
                    progress(percentLoaded);
                }
            }

            function onLoadEnd()
            {
                removeEventListeners();
                resolve(fileReader.result);
            }

            function onError(e: any)
            {
                console.log(e.message);
                removeEventListeners();
                reject(e);
            }

            addEventListeners();

            try
            {
                action(fileReader);
            }
            catch (error)
            {
                onError(error);
            }
        });
    }
}
