import { TestBed } from '@angular/core/testing';
import { AlertService, AlertType } from './alert.service';
import { ILogProvider, LoggingService } from './logging.service';

class MockLogProvider implements ILogProvider
{
    traceMessage: string;

    debugMessage: string;

    infoMessage: string;

    warnMessage: string;

    errorMessage: string;

    criticalMessage: string;

    trace(message: string): void
    {
        this.traceMessage = message;
    }

    debug(message: string): void
    {
        this.debugMessage = message;
    }

    info(message: string): void
    {
        this.infoMessage = message;
    }

    warn(message: string): void
    {
        this.warnMessage = message;
    }

    error(message: string): void
    {
        this.errorMessage = message;
    }

    critical(message: string): void
    {
        this.criticalMessage = message;
    }
}

describe('AlertService', () =>
{
    const loggingProvider = new MockLogProvider();

    beforeEach(() =>
    {
        TestBed.configureTestingModule({});
        const loggingService: LoggingService = TestBed.get(LoggingService);
        loggingService.setLogProvider(loggingProvider);
        loggingService.setMessageTemplateForAll('{3}');
    });

    describe('creating the service', () =>
    {
        it('should be created', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            expect(service).toBeTruthy();
        });

        it('alert collection shouldn\'t be null', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            expect(service.getAlerts()).not.toBeNull();
            expect(service.getAlerts().getInnerArray()).not.toBeNull();
        });

        it('alert collection should be empty', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            expect(service.getAlerts().count()).toBe(0);
        });

        it('should fail if get log type with a wrong alert type', () =>
        {
            expect(() => AlertService.getLogType(-1)).toThrow();
        });
    });

    describe('working with messages', () =>
    {
        it('should add a message', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            service.addMessage('testing message');

            const alert = service.getAlerts().get(0);
            expect(alert.message).toBe('testing message');
            expect(alert.type).toBe(AlertType.Message);
            expect(alert.typeName).toBe('Message');
            expect(loggingProvider.infoMessage).toBe('testing message');
        });

        it('should remove a message by index', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            service.addMessage('testing message');
            service.remove(0);

            expect(service.getAlerts().count()).toBe(0);
        });

        it('should remove a message by alert', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            service.addMessage('testing message');
            const alert = service.get(0);
            service.remove(alert);

            expect(service.getAlerts().count()).toBe(0);
        });

        it('should remove several messages', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            service.addMessage('testing message 1');
            service.addMessage('testing message 2');
            service.addMessage('testing message 3');
            service.addMessage('testing message 4');

            const alert1 = service.get(0);
            const alert2 = service.get(1);
            const alert3 = service.get(2);
            const alert4 = service.get(3);

            service.remove(alert1);
            service.remove(alert2);
            service.remove(alert3);
            service.remove(alert4);

            expect(service.getAlerts().count()).toBe(0);
        });

        it('should get a message', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            service.addMessage('testing message');
            const alert = service.get(0);
            service.remove(0);

            expect(alert.type).toBe(AlertType.Message);
            expect(alert.message).toBe('testing message');
        });

        it('should clear all messages', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            service.clear();

            expect(service.getAlerts().count()).toBe(0);
        });
    });

    describe('working with warnings', () =>
    {
        it('should add a warning', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            service.addWarning('testing warning');

            expect(service.getAlerts().count()).toBe(1);

            const alert = service.getAlerts().get(0);
            expect(alert.message).toBe('testing warning');
            expect(alert.type).toBe(AlertType.Warning);
            expect(alert.typeName).toBe('Warning');
            expect(loggingProvider.warnMessage).toBe('testing warning');
        });

        it('should remove a warning by index', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            service.addWarning('testing warning');
            service.remove(0);

            expect(service.getAlerts().count()).toBe(0);
        });

        it('should remove a warning by alert', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            service.addWarning('testing warning');
            const alert = service.get(0);
            service.remove(alert);

            expect(service.getAlerts().count()).toBe(0);
        });

        it('should get a warning', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            service.addWarning('testing warning');
            const alert = service.get(0);
            service.remove(0);

            expect(alert.type).toBe(AlertType.Warning);
            expect(alert.message).toBe('testing warning');
        });

        it('should clear all warnings', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            service.clear();

            expect(service.getAlerts().count()).toBe(0);
        });
    });

    describe('working with errors', () =>
    {
        it('should add an error', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            service.addError('testing error');

            const alert = service.getAlerts().get(0);
            expect(alert.message).toBe('testing error');
            expect(alert.type).toBe(AlertType.Error);
            expect(alert.typeName).toBe('Error');
            expect(loggingProvider.errorMessage).toBe('testing error');
        });

        it('should remove a error by index', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            service.addError('testing error');
            service.remove(0);

            expect(service.getAlerts().count()).toBe(0);
        });

        it('should remove a error by alert', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            service.addError('testing error');
            const alert = service.get(0);
            service.remove(alert);

            expect(service.getAlerts().count()).toBe(0);
        });

        it('should get an error', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            service.addError('testing error');
            const alert = service.get(0);
            service.remove(0);

            expect(alert.type).toBe(AlertType.Error);
            expect(alert.message).toBe('testing error');
        });

        it('should clear all errors', () =>
        {
            const service: AlertService = TestBed.get(AlertService);

            service.clear();

            expect(service.getAlerts().count()).toBe(0);
        });
    });
});
