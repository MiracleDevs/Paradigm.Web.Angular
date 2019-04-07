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
            let token: RegistrationToken<MockMessage>;

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

        it('should unregister message using the token', () =>
        {
            const service: MessageBusService = TestBed.get(MessageBusService);
            const token = service.register(MockMessage, () => { });
            expect(() => token.unregister()).not.toThrow();
        });

        it('should unregister all the handlers', () =>
        {
            const service: MessageBusService = TestBed.get(MessageBusService);
            service.register(MockMessage, () => { });

            expect(() => service.unregisterAll()).not.toThrow();
            expect(service.count()).toBe(0);
        });

        it('should fail unregistering a token that has been unregistered already', () =>
        {
            const service: MessageBusService = TestBed.get(MessageBusService);
            const token = service.register(MockMessage, () => { });
            service.unregisterAll();
            expect(() => token.unregister()).toThrow();
        });

        it('should fail when sending a null message.', async (done: () => void) =>
        {
            const service: MessageBusService = TestBed.get(MessageBusService);

            try
            {
                await service.send(null);
            }
            catch
            {
                done();
                return;
            }

            throw new Error('did not throw error.');
        });

        it('should fail when sending an undefined message.', async (done: () => void) =>
        {
            const service: MessageBusService = TestBed.get(MessageBusService);

            try
            {
                await service.send(undefined);
            }
            catch
            {
                done();
                return;
            }

            throw new Error('did not throw error.');
        });

        it('should fail when sending an anonymous object.', async (done: () => void) =>
        {
            const service: MessageBusService = TestBed.get(MessageBusService);

            try
            {
                const object = {};
                object.constructor = null;
                await service.send(object);
            }
            catch
            {
                done();
                return;
            }

            throw new Error('did not throw error.');
        });

        it('should not execute if no handlers available', async (done: () => void) =>
        {
            const service: MessageBusService = TestBed.get(MessageBusService);
            const result = await service.send(new MockMessage('some value'));
            expect(result).toBeFalsy();
            done();
        });
    });
});
