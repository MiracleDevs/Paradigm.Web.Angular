import { TestBed } from '@angular/core/testing';

import { MessageBusService, RegistrationToken } from './message-bus.service';
import { Message } from '../decorators/message';

@Message('MockMessage')
export class MockMessage
{
    constructor(public readonly someValue: string)
    {
    }
}

describe('MessageBusService', () =>
{
    beforeEach(() => TestBed.configureTestingModule({}));

    describe('creating the service', () =>
    {
        it('should initialize correctly', () =>
        {
            const service: MessageBusService = TestBed.get(MessageBusService);
            expect(service).toBeTruthy();
            expect(service).toBeDefined();
        });

        it('message bus should be empty', () =>
        {
            const service: MessageBusService = TestBed.get(MessageBusService);
            expect(service.count()).toBe(0);
        });
    });

    describe('working with messages', () =>
    {
        it('should register and unregister a message', () =>
        {
            const service: MessageBusService = TestBed.get(MessageBusService);
            let token: RegistrationToken;

            expect(() => token = service.register(MockMessage, () => { })).not.toThrow();
            expect(token).not.toBe(null);
            expect(service.count()).toBe(1);
            expect(service.isRegistered(MockMessage)).toBe(true);
            expect(service.handlerCount(MockMessage)).toBe(1);

            expect(() => service.unregister(token)).not.toThrow();
            expect(service.count()).toBe(0);
            expect(service.isRegistered(MockMessage)).toBe(false);
            expect(service.handlerCount(MockMessage)).toBe(0);
        });

        it('should send a sync message', async (done: Function) =>
        {
            const service: MessageBusService = TestBed.get(MessageBusService);
            let response: string;
            const token = service.register(MockMessage, x => { response = x.someValue; });

            await service.send(new MockMessage('Test Value'));
            expect(response).toBe('Test Value');
            service.unregister(token);

            done();
        });

        it('should send an async message', async (done: Function) =>
        {
            const service: MessageBusService = TestBed.get(MessageBusService);
            let response: string;
            const token = service.register(MockMessage, x =>
            {
                return new Promise((resolve) =>
                {
                    setTimeout(() =>
                    {
                        response = x.someValue;
                        resolve();
                    }, 100);
                });
            });

            await service.send(new MockMessage('Test Value'));
            expect(response).toBe('Test Value');
            service.unregister(token);

            done();
        });
    });
});
