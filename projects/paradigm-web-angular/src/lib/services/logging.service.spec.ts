import { TestBed } from '@angular/core/testing';
import { LoggingService, ILogProvider, LogType } from './logging.service';
import { IPerfLoggingPrefs } from 'selenium-webdriver/chrome';

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

describe('LoggingService', () =>
{
    beforeEach(() => TestBed.configureTestingModule({}));

    describe('creating the service', () =>
    {
        it('should initialize correctly', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            expect(service).toBeTruthy();
            expect(service).toBeDefined();
        });
    });

    describe('configuring the service', () =>
    {
        it('should change the log provider', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Trace);
            service.setLogProvider(provider);
            service.trace('test');
            expect(provider.traceMessage).toBeDefined();
        });

        it('should change the custom message', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Trace);
            service.setLogProvider(provider);
            service.setMessageTemplate(LogType.Trace, '<{1}><{2}><{3}>');
            service.trace('test', 'tag');

            expect(provider.traceMessage).toBe('<Trace><tag><test>');
        });

        it('should change the minimum level', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Warning);
            service.setLogProvider(provider);
            service.trace('trace');
            service.warning('warn');

            expect(provider.traceMessage).toBeUndefined();
            expect(provider.warnMessage).toBeDefined();
        });
    });

    describe('executing the service', () =>
    {
        it('should log traces', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Trace);
            service.setLogProvider(provider);
            service.trace('trace');

            expect(provider.traceMessage).toBeDefined();
        });

        it('should log debug info', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Debug);
            service.setLogProvider(provider);
            service.debug('debug');

            expect(provider.debugMessage).toBeDefined();
        });

        it('should log information', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Information);
            service.setLogProvider(provider);
            service.information('info');

            expect(provider.infoMessage).toBeDefined();
        });

        it('should log warnings', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Warning);
            service.setLogProvider(provider);
            service.warning('warn');

            expect(provider.warnMessage).toBeDefined();
        });

        it('should log error messages', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Error);
            service.setLogProvider(provider);
            service.error('error');

            expect(provider.errorMessage).toBeDefined();
        });

        it('should log critical messages', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Critical);
            service.setLogProvider(provider);
            service.critical('critical');

            expect(provider.criticalMessage).toBeDefined();
        });
    });

});
