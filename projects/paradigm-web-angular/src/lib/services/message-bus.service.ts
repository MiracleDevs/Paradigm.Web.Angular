/*!
 * Paradigm Framework - Angular Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Angular/blob/master/LICENSE)
 */
import { Injectable } from '@angular/core';
import { ServiceBase } from './base.service';
import { Dictionary, ArrayList, Guid, ObjectExtensions } from '@miracledevs/paradigm-ui-web-shared';
import { getMessageType } from '../decorators/message';

@Injectable({
    providedIn: 'root'
})
export class MessageBusService extends ServiceBase
{
    private handlers: Dictionary<string, ArrayList<MessageBusHandler>>;

    constructor()
    {
        super();
        this.handlers = new Dictionary<string, ArrayList<MessageBusHandler>>();
    }

    count(): number
    {
        return this.handlers.count();
    }

    isRegistered<T>(messageType: new (...args: any[]) => T): boolean
    {
        const type = getMessageType(messageType);
        return this.handlers.containsKey(type);
    }

    handlerCount<T>(messageType: new (...args: any[]) => T): number
    {
        const type = getMessageType(messageType);

        if (!this.handlers.containsKey(type))
        {
            return 0;
        }

        return this.handlers.get(type).count();
    }

    register<T>(messageType: { new(...args: any[]): T }, handler: (x: T) => void|Promise<void>): RegistrationToken
    {
        const type = getMessageType(messageType);

        if (!this.handlers.containsKey(type)) {
            this.handlers.add(type, new ArrayList<MessageBusHandler>());
        }

        const messageBusHandler = new MessageBusHandler(messageType, handler);
        this.handlers.get(type).add(messageBusHandler);

        return messageBusHandler.token;
    }

    unregister(token: RegistrationToken): void
    {
        const type = getMessageType(token.type);

        if (!this.handlers.containsKey(type)) {
            return;
        }

        const handler = this.handlers.get(type);
        handler.removeAll(x => x.token.guid === token.guid);

        if (!handler.any()) {
            this.handlers.remove(type);
        }
    }

    async send<T>(message: T, token?: RegistrationToken): Promise<boolean>
    {
        if (ObjectExtensions.isNull(message)) {
            throw new Error('Can not send a null message.');
        }

        if (ObjectExtensions.isNull(message.constructor)) {
            throw new Error('Message does not have a constructor, and the system can not infer the type.');
        }

        const type = getMessageType(message.constructor);

        if (!this.handlers.containsKey(type)) {
            return false;
        }

        const handlers = this.handlers.get(type)
            .where(x => token == null || token.guid === x.token.guid)
            .select(x => x.handler);

        let accepted = false;

        for (let i = (handlers.count() - 1); i >= 0; i--)
        {
            const handler = handlers.get(i);

            if (handler == null) {
                continue;
            }

            accepted = true;
            await handler(message);
        }

        return accepted;
    }
}

export class MessageBusHandler
{
    private innerToken: RegistrationToken;

    private innerHandler: Function;

    get token(): RegistrationToken { return this.innerToken; }

    get handler(): Function { return this.innerHandler; }

    constructor(type: Function, handler: Function)
    {
        this.innerHandler = handler;
        this.innerToken = new RegistrationToken(type);
    }
}

export class RegistrationToken
{
    private innerType: Function;

    private innerGuid: Guid;

    get type(): Function
    {
        return this.innerType;
    }

    get guid(): Guid
    {
        return this.innerGuid;
    }

    constructor(type: Function)
    {
        this.innerType = type;
        this.innerGuid = Guid.new();
    }
}
