import { TestBed } from '@angular/core/testing';
import { LoggingService, ILogProvider, LogType } from './logging.service';

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

class MockLogWithoutCriticalProvider implements ILogProvider
{
    traceMessage: string;

    debugMessage: string;

    infoMessage: string;

    warnMessage: string;

    errorMessage: string;

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

        it('should fail when changing custom message for an unknown type', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            expect(() => service.setMessageTemplate(-1, '<{1}><{2}><{3}>')).toThrow();
        });

        it('should fail when changing a custom message with a null message', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            expect(() => service.setMessageTemplate(LogType.Trace, null)).toThrow();
        });

        it('should fail when changing a custom message with an undefined message', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            expect(() => service.setMessageTemplate(LogType.Trace, undefined)).toThrow();
        });

        it('should change the custom message for all', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Trace);
            service.setLogProvider(provider);
            service.setMessageTemplateForAll('<{1}><{2}><{3}>');
            service.trace('test', 'tag');

            expect(provider.traceMessage).toBe('<Trace><tag><test>');
        });

        it('should fail when changing a custom message for all with an null message', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            expect(() => service.setMessageTemplateForAll(null)).toThrow();
        });

        it('should fail when changing a custom message for all with an undefined message', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            expect(() => service.setMessageTemplateForAll(undefined)).toThrow();
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

        it('should fail if the minimum level it is outside boundaries', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);

            expect(() => service.setMinimumLevel(-1)).toThrow();
            expect(() => service.setMinimumLevel(20)).toThrow();
        });
    });

    describe('executing the generic log', () =>
    {
        it('should log', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Trace);
            service.setLogProvider(provider);
            service.log('trace', LogType.Trace, 'tag');

            expect(provider.traceMessage).toBeDefined();
        });

        it('should fail if message is null', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Trace);
            service.setLogProvider(provider);
            expect(() => service.log(null, LogType.Trace, 'tag')).toThrow();
        });

        it('should fail if message is undefined', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Trace);
            service.setLogProvider(provider);
            expect(() => service.log(undefined, LogType.Trace, 'tag')).toThrow();
        });

        it('should fail the log type is unknown', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Trace);
            service.setLogProvider(provider);
            expect(() => service.log('trace', -1, 'tag')).toThrow();
        });
    });

    describe('executing the different methods without tags', () =>
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

    describe('executing the different methods with tag', () =>
    {
        it('should log traces with tags', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Trace);
            service.setLogProvider(provider);
            service.trace('trace', 'tag');

            expect(provider.traceMessage).toBeDefined();
        });

        it('should log debug info with tags', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Debug);
            service.setLogProvider(provider);
            service.debug('debug', 'tag');

            expect(provider.debugMessage).toBeDefined();
        });

        it('should log information with tags', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Information);
            service.setLogProvider(provider);
            service.information('info', 'tag');

            expect(provider.infoMessage).toBeDefined();
        });

        it('should log warnings with tags', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Warning);
            service.setLogProvider(provider);
            service.warning('warn', 'tag');

            expect(provider.warnMessage).toBeDefined();
        });

        it('should log error messages with tags', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Error);
            service.setLogProvider(provider);
            service.error('error', 'tag');

            expect(provider.errorMessage).toBeDefined();
        });

        it('should log critical messages with tags', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogProvider();

            service.setMinimumLevel(LogType.Critical);
            service.setLogProvider(provider);
            service.critical('critical', 'tag');

            expect(provider.criticalMessage).toBeDefined();
        });
    });

    describe('executing critical without critical method', () =>
    {
        it('should log critical messages without tags', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogWithoutCriticalProvider();

            service.setMinimumLevel(LogType.Critical);
            service.setLogProvider(provider);
            service.critical('critical');

            expect(provider.errorMessage).toBeDefined();
        });

        it('should log critical messages with tags', () =>
        {
            const service: LoggingService = TestBed.get(LoggingService);
            const provider = new MockLogWithoutCriticalProvider();

            service.setMinimumLevel(LogType.Critical);
            service.setLogProvider(provider);
            service.critical('critical', 'tag');

            expect(provider.errorMessage).toBeDefined();
        });
    });

});
