/*!
 * Paradigm Framework - Angular Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Angular/blob/master/LICENSE)
 */
import { ObjectExtensions, FunctionExtensions } from '@miracledevs/paradigm-ui-web-shared';

const messageTypeKey = '$messageType';

export function Message(name: string): <T>(constructor: { new(...args: any[]): T }) => void
{
    return <T>(constructor: { new(...args: any[]): T }): void =>
    {
        if (ObjectExtensions.isNull(constructor))
        {
            throw new Error('Missing message constructor.');
        }

        constructor[messageTypeKey] = name || FunctionExtensions.getFunctionName(constructor);
    };
}

export function getMessageType<T>(constructor: { new(...args: any[]): T } | Function): string
{
    return constructor[messageTypeKey];
}

