/*!
 * Paradigm Framework - Angular Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Angular/blob/master/LICENSE)
 */

import { Type } from '@angular/core';

const messageTypeKey = '$messageType';

export function Message(name: string): <T>(messageType: Type<T>) => void
{
    return <T>(messageType: Type<T>): void =>
    {
        messageType[messageTypeKey] = name;
    };
}

export function getMessageType<T>(messageType: Type<T>): string
{
    return messageType[messageTypeKey];
}

