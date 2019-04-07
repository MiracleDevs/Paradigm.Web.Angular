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
    /**
     * Reference to a message bus service.
     */
    private messageBus: MessageBusService;

    /**
     * Array of message bus registration tokens that needs to be
     * unregistered before destroying the component.
     */
    private messageTokens: ArrayList<RegistrationToken<any>>;

    /**
     * Reference to an alert service.
     */
    private alerts: AlertService;

    /**
     * Creates a new instance of @see ComponentBase
     * @param injector reference to an injector service.
     */
    constructor(protected injector: Injector)
    {
    }

    /**
     * Called when the component is initialized.
     */
    ngOnInit(): void
    {
    }

    /**
     * Called when the component is destroyed.
     */
    ngOnDestroy(): void
    {
        this.unregisterTokens();
    }

    /**
     * Gets a reference to the message bus.
     */
    protected getMessageBus(): MessageBusService
    {
        if (!this.messageBus)
        {
            this.messageBus = this.injector.get(MessageBusService);
            this.messageTokens = new ArrayList();
        }

        return this.messageBus;
    }

    /**
     * Registers a message handler for a given message type.
     * @param type the message type.
     * @param handler the message handler to process when some part of the application sends a message of type @see type
     */
    protected registerMessage<T>(type: Type<T>, handler: MessageHandler<T>): void
    {
        const token = this.getMessageBus().register(type, handler);
        this.messageTokens.add(token);
    }

    /**
     * Unregisters all the tokens registered within this component.
     */
    protected unregisterTokens(): void
    {
        if (this.messageTokens && this.messageTokens.count() > 0)
        {
            this.messageTokens.forEach(x => x.unregister());
            this.messageTokens.clear();
        }
    }

    /**
     * Unregisters a particular token.
     * If no unregister take place, the component will unregister all the tokens
     * on @see ngOnDestroy
     * @param type the type of message to unregister
     */
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

    /**
     * Sends a message using the message bus.
     * @param message The message instance to send using the message bus.
     * @param token if specified, the component can target one specific registration token and handler;
     * if not, all the handlers registered for this message type, will receive the message.
     */
    protected async sendMessage<T>(message: T, token?: RegistrationToken<T>): Promise<void>
    {
        await this.getMessageBus().send(message, token);
    }

    /**
     * Gets the alert service.
     */
    protected getAlerts(): AlertService
    {
        if (!this.alerts)
        {
            this.alerts = this.injector.get(AlertService);
        }

        return this.alerts;
    }

    /**
     * Adds a message in the alert service.
     * @param message message to add.
     */
    protected addMessage(message: string): void
    {
        this.getAlerts().addMessage(message);
    }

    /**
     * Adds a warning in the alert service.
     * @param warning warning to add.
     */
    protected addWarning(warning: string): void
    {
        this.getAlerts().addWarning(warning);
    }

    /**
     * Adds an error in the alert service.
     * @param error error to add.
     */
    protected addError(error: string): void
    {
        this.getAlerts().addError(error);
    }

    /**
     * Handles an application error, reporting the error to the alert service.
     * @param error the error that needs to be handled.
     */
    protected handleError(error: any): void
    {
        if (!error)
        {
            return;
        }

        if (error.message)
        {
            this.addError(error.message);
        }
        else if (error.Message)
        {
            this.addError(error.Message);
        }
        else if (error.exceptionMessage)
        {
            this.addError(error.exceptionMessage);
        }
        else if (error.ExceptionMessage)
        {
            this.addError(error.ExceptionMessage);
        }
        else if (error.error && error.error.message)
        {
            this.addError(error.error.message);
        }
        else if (error.error && error.error.Message)
        {
            this.addError(error.error.Message);
        }
    }
}
