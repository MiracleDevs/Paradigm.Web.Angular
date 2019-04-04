import { TestBed } from '@angular/core/testing';
import { FileService } from './file.service';

class MockFile
{
    file: File;

    constructor()
    {
        const content = 'Hello World';
        const data = new Blob([content], { type: 'text/plain' });
        const arrayOfBlob = new Array<Blob>();
        arrayOfBlob.push(data);
        this.file = new File(arrayOfBlob, 'Mock.txt', { type: 'text/plain' });
    }
}

describe('FileService', () =>
{
    beforeEach(() => TestBed.configureTestingModule({}));

    describe('creating the service', () =>
    {
        it('should be created', () =>
        {
            const service: FileService = TestBed.get(FileService);
            expect(service).toBeTruthy();
        });
    });

    describe('using the service', () =>
    {
        it('should read as string', (done: () => void) =>
        {
            const service: FileService = TestBed.get(FileService);
            const mockFile = new MockFile();
            let progress = -1;

            service.readAsText(mockFile.file, p => progress = p).then(content =>
            {
                expect(progress).toBe(100);
                expect(content).toBe('Hello World');
                done();
            });
        }, 1000);

        it('should read as binary string', (done: () => void) =>
        {
            const service: FileService = TestBed.get(FileService);
            const mockFile = new MockFile();
            let progress = -1;

            service.readAsBinaryString(mockFile.file, p => progress = p).then(content =>
            {
                expect(progress).toBe(100);
                expect(content).toBe('Hello World');
                done();
            });
        }, 1000);

        it('should read as blob', (done: () => void) =>
        {
            const service: FileService = TestBed.get(FileService);
            const mockFile = new MockFile();
            let progress = -1;

            service.readAsBlob(mockFile.file, p => progress = p).then(content =>
            {
                expect(progress).toBe(100);
                expect(content).toBeDefined();
                expect(content instanceof Blob).toBe(true);
                expect(content.type).toBe('text/plain');
                done();
            });
        }, 1000);
    });
});
