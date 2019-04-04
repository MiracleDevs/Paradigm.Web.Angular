/*!
 * Paradigm Framework - Angular Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Angular/blob/master/LICENSE)
 */

import { Injectable } from '@angular/core';
import { ServiceBase } from './base.service';
import { Dictionary, ArrayList, Guid, ObjectExtensions } from '@miracledevs/paradigm-ui-web-shared';
import { getMessageType } from '../decorators/message';

/**
 * Represents a message bus registration token.
 */
export class RegistrationToken
{
    /**
     * A reference to the @see MessageBusService.
     */
    private messageBus: MessageBusService;

    /**
     * The inner message type.
     */
    private innerType: Function;

    /**
     * A guid identifying this registration.
     */
    private innerGuid: Guid;

    /**
     * Gets the message type.
     */
    get type(): Function
    {
        return this.innerType;
    }

    /**
     * Gets the registration guid.
     */
    get guid(): Guid
    {
        return this.innerGuid;
    }

    /**
     * Creates a new instance of @see RegistrationToken
     * @param messageBus a reference to the message bus.
     * @param type the message type.
     */
    constructor(messageBus: MessageBusService, type: Function)
    {
        this.messageBus = messageBus;
        this.innerType = type;
        this.innerGuid = Guid.new();
    }

    /**
     * Removes the callback from the message bus.
     */
    unregister(): void
    {
        this.messageBus.unregister(this);
    }
}

/**
 * Represents a message bus callback handler.
 * It holds a method that must be called when certain
 * message is received.
 */
export class MessageBusHandler
{
    /**
     * The registration token that identifies this handler.
     */
    private innerToken: RegistrationToken;

    /**
     * The handler or function that should be called when the message is received.
     */
    private innerHandler: Function;

    /**
     * Gets the registration token that identifies this handler.
     */
    get token(): RegistrationToken { return this.innerToken; }

    /**
     * Gets the handler function that should be called when the message is received.
     */
    get handler(): Function { return this.innerHandler; }

    /**
     * Creates a new instance of @see MessageBusHandler
     * @param messageBus a reference to the message bus.
     * @param type the message type.
     * @param handler the message handler.
     */
    constructor(messageBus: MessageBusService, type: Function, handler: Function)
    {
        this.innerHandler = handler;
        this.innerToken = new RegistrationToken(messageBus, type);
    }
}

@Injectable({
    providedIn: 'root'
})
export class MessageBusService extends ServiceBase
{
    /**
     * A collection of message types and all their handlers or observers.
     */
    private handlers: Dictionary<string, ArrayList<MessageBusHandler>>;

    /**
     * Creates a new instance of @see MessageBusService
     */
    constructor()
    {
        super();
        this.handlers = new Dictionary<string, ArrayList<MessageBusHandler>>();
    }

    /**
     * Gets the amount of messages registered.
     */
    count(): number
    {
        return this.handlers.count();
    }

    /**
     * Indicates if the given message type is registered and has handlers associated to it.
     * @param messageType the message type.
     */
    isRegistered<T>(messageType: new (...args: any[]) => T): boolean
    {
        const type = getMessageType(messageType);
        return this.handlers.containsKey(type);
    }

    /**
     * Gets the amount of handler or observers a given message has.
     * @param messageType the message type.
     */
    handlerCount<T>(messageType: new (...args: any[]) => T): number
    {
        const type = getMessageType(messageType);

        if (!this.handlers.containsKey(type))
        {
            return 0;
        }

        return this.handlers.get(type).count();
    }

    /**
     * Registers a new message handler.
     * The handler will be called every time a message of @see messageType is called.
     * @param messageType the message type.
     * @param handler the message handler.
     */
    register<T>(messageType: { new(...args: any[]): T }, handler: (x: T) => void | Promise<void>): RegistrationToken
    {
        const type = getMessageType(messageType);

        if (!this.handlers.containsKey(type))
        {
            this.handlers.add(type, new ArrayList<MessageBusHandler>());
        }

        const messageBusHandler = new MessageBusHandler(this, messageType, handler);
        this.handlers.get(type).add(messageBusHandler);

        return messageBusHandler.token;
    }

    /**
     * Removes a handler registration from the collection.
     * @param token the registration token.
     */
    unregister(token: RegistrationToken): void
    {
        const type = getMessageType(token.type);

        if (!this.handlers.containsKey(type))
        {
            return;
        }

        const handler = this.handlers.get(type);
        handler.removeAll(x => x.token.guid === token.guid);

        if (!handler.any())
        {
            this.handlers.remove(type);
        }
    }

    /**
     * Sends a message to all the registered handlers.
     * @param message the message to be sent.
     * @param token if specified, the message will be sent only to one handler.
     */
    async send<T>(message: T, token?: RegistrationToken): Promise<boolean>
    {
        if (ObjectExtensions.isNull(message))
        {
            throw new Error('Can not send a null message.');
        }

        if (ObjectExtensions.isNull(message.constructor))
        {
            throw new Error('Message does not have a constructor, and the system can not infer the type.');
        }

        const type = getMessageType(message.constructor);

        if (!this.handlers.containsKey(type))
        {
            return false;
        }

        const handlers = this.handlers.get(type)
            .where(x => token == null || token.guid === x.token.guid)
            .select(x => x.handler);

        let accepted = false;

        for (let i = (handlers.count() - 1); i >= 0; i--)
        {
            const handler = handlers.get(i);

            if (handler == null)
            {
                continue;
            }

            accepted = true;
            await handler(message);
        }

        return accepted;
    }
}
