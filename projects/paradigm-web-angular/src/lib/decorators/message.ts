/*!
 * Paradigm Framework - Angular Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Angular/blob/master/LICENSE)
 */

import { Type } from '@angular/core';

const messageNameKey = '$messageType';

/**
 * Decorates a class that needs to be marked as a message to use in conjunction
 * with the @see MessageBusService
 * @param name  the name of the message.
 */
export function Message(name: string): <T>(messageType: Type<T>) => void
{
    return <T>(messageType: Type<T>): void =>
    {
        messageType[messageNameKey] = name;
    };
}

/**
 * Gets the message name from a given message type.
 * The message type needs to be decorated with @see Message
 * @param type the type of a message.
 */
export function getMessageName<T>(type: Type<T>): string
{
    return type[messageNameKey];
}

