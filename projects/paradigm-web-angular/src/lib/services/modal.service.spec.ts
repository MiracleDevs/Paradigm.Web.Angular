import { TestBed } from '@angular/core/testing';
import { ModalService } from './modal.service';
import { ModalComponentBase } from '../components/modal-base.component';
import { Injector, Component, ViewContainerRef, NgModule, ViewRef } from '@angular/core';

@Component({
    selector: 'lib-container',
    template: '<div class="container"></div>'
})
class MockContainerComponent
{
    constructor(public container: ViewContainerRef)
    {
    }
}

@Component({
    selector: 'lib-modal-component',
    template: '<div class="modal"></div>'
})
class MockModalComponent extends ModalComponentBase<null, boolean>
{
    constructor(protected injector: Injector)
    {
        super(injector);
    }

    public accept(): void
    {
        this.resolve(true);
    }

    public cancel(): void
    {
        this.resolve(false);
    }

    public error(): void
    {
        this.reject('There was an error.');
    }
}

@NgModule({
    imports: [],
    declarations: [
        MockContainerComponent,
        MockModalComponent
    ],
    entryComponents: [
        MockContainerComponent,
        MockModalComponent
    ],
})
class MockModule
{
}

describe('ModalService', () =>
{
    beforeEach(() => TestBed.configureTestingModule({
        imports: [MockModule]
    }));

    describe('creating the service', () =>
    {
        it('should be created', () =>
        {
            const service: ModalService = TestBed.get(ModalService);
            expect(service).toBeTruthy();
            expect(service.getModalInstances().count()).toBe(0);
        });

        it('shouldnt have modal instances', () =>
        {
            const service: ModalService = TestBed.get(ModalService);
            expect(service.getModalInstances()).toBeDefined();
            expect(service.getModalInstances().count()).toBe(0);
        });
    });

    describe('using the service', () =>
    {
        it('should set the view container', () =>
        {
            const service: ModalService = TestBed.get(ModalService);
            const containerComponent = TestBed.createComponent(MockContainerComponent).componentInstance;
            expect(() => service.setViewContainer(containerComponent.container)).not.toThrow();
        });

        it('should throw if the view container is null or undefined', () =>
        {
            const service: ModalService = TestBed.get(ModalService);
            expect(() => service.setViewContainer(null)).toThrow();
            expect(() => service.setViewContainer(undefined)).toThrow();
        });

        it('should open a modal dialog and resolve the promise', (done: () => void) =>
        {
            const service: ModalService = TestBed.get(ModalService);
            const containerRef = TestBed.createComponent(MockContainerComponent);
            service.setViewContainer(containerRef.componentInstance.container);
            service.open(MockModalComponent).then(() => done());

            expect(service.getModalInstances().count()).toBe(1);
            const modalInstance = service.getModalInstances().get(0);
            expect(modalInstance.type).toBe(MockModalComponent);
            expect(containerRef.componentInstance.container.indexOf(modalInstance.componentRef.hostView)).toBeGreaterThanOrEqual(0);
            (modalInstance.componentRef.instance as MockModalComponent).accept();
            expect(containerRef.componentInstance.container.indexOf(modalInstance.componentRef.hostView)).toBe(-1);
        }, 1000);

        it('should open a modal dialog and reject the promise', (done: () => void) =>
        {
            const service: ModalService = TestBed.get(ModalService);
            const containerRef = TestBed.createComponent(MockContainerComponent);
            service.setViewContainer(containerRef.componentInstance.container);
            service.open(MockModalComponent).then(null, () => done());

            expect(service.getModalInstances().count()).toBe(1);
            const modalInstance = service.getModalInstances().get(0);
            expect(modalInstance.type).toBe(MockModalComponent);
            expect(containerRef.componentInstance.container.indexOf(modalInstance.componentRef.hostView)).toBeGreaterThanOrEqual(0);
            (modalInstance.componentRef.instance as MockModalComponent).error();
            expect(containerRef.componentInstance.container.indexOf(modalInstance.componentRef.hostView)).toBe(-1);
        }, 1000);
    });
});
