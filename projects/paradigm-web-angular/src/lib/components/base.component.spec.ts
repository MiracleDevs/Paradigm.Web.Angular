import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentBase } from './base.component';
import { Component, Injector } from '@angular/core';
import { ObjectExtensions, ArrayList } from '@miracledevs/paradigm-ui-web-shared';
import { Message } from '../decorators/message';
import { RegistrationToken, MessageBusService } from '../services/message-bus.service';
import { AlertService, AlertType } from '../services/alert.service';
import { LoggingService, LogType } from '../services/logging.service';

@Message('mock-message')
class MockMessage
{
}

@Component({
    selector: 'lib-mock-component',
    template: '<div></div>'
})
class MockComponent extends ComponentBase
{
    mockMessage: MockMessage;

    loading: boolean;

    constructor(protected injector: Injector)
    {
        super(injector);
        this.loading = false;
    }

    hasInjector(): boolean
    {
        return !ObjectExtensions.isNull(this.injector);
    }

    registerTheToken(): void
    {
        this.registerMessage(MockMessage, x => this.messageHandler(x));
    }

    unregisterTheToken(): void
    {
        this.unregisterToken(MockMessage);
    }

    unregisterAllTheTokens(): void
    {
        this.unregisterTokens();
    }

    addAMessage(): void
    {
        this.addMessage('message');
    }

    addAWarning(): void
    {
        this.addWarning('warning');
    }

    addAnError(): void
    {
        this.addError('error');
    }

    handleTheError(error: any): void
    {
        this.handleError(error);
    }

    async sendAMessage(): Promise<void>
    {
        await this.sendMessage(new MockMessage());
    }

    private messageHandler(x: MockMessage): void
    {
        this.mockMessage = x;
    }
}

describe('ComponentBase', () =>
{
    let component: MockComponent;
    let fixture: ComponentFixture<MockComponent>;
    let messageBus: MessageBusService;
    let alerts: AlertService;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [MockComponent]
        }).compileComponents();
    }));

    beforeEach(() =>
    {
        fixture = TestBed.createComponent(MockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        messageBus = TestBed.get(MessageBusService);
        alerts = TestBed.get(AlertService);
        TestBed.get(LoggingService).setMinimumLevel(LogType.Critical);
    });

    describe('creating the component', () =>
    {
        it('should create', () =>
        {
            expect(component).toBeTruthy();
            expect(component.hasInjector()).toBeTruthy();
        });
    });

    describe('using the inherited logic', () =>
    {
        it('should register and unregister token', () =>
        {
            expect(() => component.registerTheToken()).not.toThrow();
            expect(messageBus.count()).toBe(1);
            expect(messageBus.handlerCount(MockMessage)).toBe(1);
            expect(() => component.unregisterTheToken()).not.toThrow();
            expect(messageBus.handlerCount(MockMessage)).toBe(0);
            expect(messageBus.count()).toBe(0);
        });

        it('should register and unregister all token', () =>
        {
            expect(() => component.registerTheToken()).not.toThrow();
            expect(() => component.registerTheToken()).not.toThrow();
            expect(messageBus.count()).toBe(1);
            expect(messageBus.handlerCount(MockMessage)).toBe(2);
            expect(() => component.unregisterAllTheTokens()).not.toThrow();
            expect(messageBus.handlerCount(MockMessage)).toBe(0);
            expect(messageBus.count()).toBe(0);
        });

        it('should receive a message', async (done: () => void) =>
        {
            component.registerTheToken();
            await messageBus.send(new MockMessage());
            expect(component.mockMessage).toBeDefined();
            component.unregisterAllTheTokens();
            done();
        }, 1000);

        it('should send a message', async (done: () => void) =>
        {
            messageBus.register(MockMessage, x =>
            {
                expect(x).toBeDefined();
                done();
            });

            await component.sendAMessage();
        }, 1000);

        it('should add a message', () =>
        {
            component.addAMessage();
            expect(alerts.getAlerts().count()).toBe(1);
            expect(alerts.getAlerts().get(0).type).toBe(AlertType.Message);
            expect(alerts.getAlerts().get(0).message).toBe('message');
        });

        it('should add a warning', () =>
        {
            component.addAWarning();
            expect(alerts.getAlerts().count()).toBe(1);
            expect(alerts.getAlerts().get(0).type).toBe(AlertType.Warning);
            expect(alerts.getAlerts().get(0).message).toBe('warning');
        });

        it('should add an error', () =>
        {
            component.addAnError();
            expect(alerts.getAlerts().count()).toBe(1);
            expect(alerts.getAlerts().get(0).type).toBe(AlertType.Error);
            expect(alerts.getAlerts().get(0).message).toBe('error');
        });

        it('should handle errors', () =>
        {
            component.handleTheError(new Error('test'));
            expect(alerts.getAlerts().count()).toBe(1);
            expect(alerts.getAlerts().get(0).type).toBe(AlertType.Error);
            expect(alerts.getAlerts().get(0).message).toBe('test');
            alerts.clear();

            component.handleTheError({ message: 'test' });
            expect(alerts.getAlerts().count()).toBe(1);
            expect(alerts.getAlerts().get(0).type).toBe(AlertType.Error);
            expect(alerts.getAlerts().get(0).message).toBe('test');
            alerts.clear();

            component.handleTheError({ Message: 'test' });
            expect(alerts.getAlerts().count()).toBe(1);
            expect(alerts.getAlerts().get(0).type).toBe(AlertType.Error);
            expect(alerts.getAlerts().get(0).message).toBe('test');
            alerts.clear();

            component.handleTheError({ error: { message: 'test' } });
            expect(alerts.getAlerts().count()).toBe(1);
            expect(alerts.getAlerts().get(0).type).toBe(AlertType.Error);
            expect(alerts.getAlerts().get(0).message).toBe('test');
            alerts.clear();

            component.handleTheError({ error: { Message: 'test' } });
            expect(alerts.getAlerts().count()).toBe(1);
            expect(alerts.getAlerts().get(0).type).toBe(AlertType.Error);
            expect(alerts.getAlerts().get(0).message).toBe('test');
            alerts.clear();

            component.handleTheError({ exceptionMessage: 'test' });
            expect(alerts.getAlerts().count()).toBe(1);
            expect(alerts.getAlerts().get(0).type).toBe(AlertType.Error);
            expect(alerts.getAlerts().get(0).message).toBe('test');
            alerts.clear();

            component.handleTheError({ ExceptionMessage: 'test' });
            expect(alerts.getAlerts().count()).toBe(1);
            expect(alerts.getAlerts().get(0).type).toBe(AlertType.Error);
            expect(alerts.getAlerts().get(0).message).toBe('test');
            alerts.clear();
        });

        it('should ignore null or undefined errors', () =>
        {
            component.handleTheError(null);
            expect(alerts.getAlerts().count()).toBe(0);
            component.handleTheError(undefined);
            expect(alerts.getAlerts().count()).toBe(0);

        });
    });
});
