/*!
 * Paradigm Framework - Angular Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Angular/blob/master/LICENSE)
 */

import { OnDestroy, OnInit, Injector, Type } from '@angular/core';
import { MessageBusService, RegistrationToken, MessageHandler } from '../services/message-bus.service';
import { ArrayList } from '@miracledevs/paradigm-ui-web-shared';
import { AlertService } from '../services/alert.service';

export class ComponentBase implements OnInit, OnDestroy
{
    private messageBus: MessageBusService;

    private messageTokens: ArrayList<RegistrationToken<any>>;

    private alerts: AlertService;

    constructor(protected injector: Injector)
    {
    }

    ngOnInit(): void
    {
    }

    ngOnDestroy(): void
    {
        this.unregisterTokens();
    }

    protected getMessageBus(): MessageBusService
    {
        if (!this.messageBus)
        {
            this.messageBus = this.injector.get(MessageBusService);
            this.messageTokens = new ArrayList();
        }

        return this.messageBus;
    }

    protected registerMessage<T>(type: Type<T>, handler: MessageHandler<T>): void
    {
        const token = this.getMessageBus().register(type, handler);
        this.messageTokens.add(token);
    }

    protected unregisterTokens(): void
    {
        if (this.messageTokens && this.messageTokens.count() > 0)
        {
            this.messageTokens.forEach(x => x.unregister());
            this.messageTokens.clear();
        }
    }

    protected unregisterToken<T>(type: Type<T>): void
    {
        if (this.messageTokens && this.messageTokens.count() > 0)
        {
            const token = this.messageTokens.firstOrDefault(x => x.type === type);

            if (token)
            {
                token.unregister();
                this.messageTokens.remove(token);
            }
        }
    }

    protected async sendMessage<T>(message: T, token?: RegistrationToken<T>): Promise<void>
    {
        await this.getMessageBus().send(message, token);
    }

    protected getAlerts(): AlertService
    {
        if (!this.alerts)
        {
            this.alerts = this.injector.get(AlertService);
        }

        return this.alerts;
    }

    protected addMessage(message: string): void
    {
        this.getAlerts().addMessage(message);
    }

    protected addWarning(warning: string): void
    {
        this.getAlerts().addWarning(warning);
    }

    protected addError(error: string): void
    {
        this.getAlerts().addError(error);
    }

    protected handleError(ex: any): void
    {
        if (!ex)
        {
            return;
        }

        if (ex.message)
        {
            this.addError(ex.message);
        }
        else if (ex.Message)
        {
            this.addError(ex.Message);
        }
        else if (ex.exceptionMessage)
        {
            this.addError(ex.exceptionMessage);
        }
        else if (ex.ExceptionMessage)
        {
            this.addError(ex.ExceptionMessage);
        }
        else if (ex.error && ex.error.message)
        {
            this.addError(ex.error.message);
        }
        else if (ex.error && ex.error.Message)
        {
            this.addError(ex.error.Message);
        }
    }
}
