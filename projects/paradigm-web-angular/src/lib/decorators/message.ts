/*!
 * Paradigm Framework - Angular Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Angular/blob/master/LICENSE)
 */

import { ObjectExtensions, FunctionExtensions } from '@miracledevs/paradigm-ui-web-shared';

const messageTypeKey = '$messageType';

export function Message(name: string): <T>(messageType: { new(...args: any[]): T }) => void
{
    return <T>(messageType: { new(...args: any[]): T }): void =>
    {
        messageType[messageTypeKey] = name || FunctionExtensions.getFunctionName(messageType);
    };
}

export function getMessageType<T>(messageType: { new(...args: any[]): T } | Function): string
{
    return messageType[messageTypeKey];
}

