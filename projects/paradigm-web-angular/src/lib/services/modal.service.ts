/*!
 * Paradigm Framework - Angular Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Injectable, ComponentFactoryResolver, Injector, Type, ComponentRef, ViewContainerRef } from '@angular/core';
import { ModalComponentBase } from '../components/modal-base.component';
import { ArrayList, ObjectExtensions } from '@miracledevs/paradigm-ui-web-shared';
import { ServiceBase } from './base.service';

/**
 * Represents a modal dialog instance.
 * This class lifespan depends on the modal dialog lifespan.
 */
export class ModalInstance<TParameters, TResult>
{
    /**
     * A reference to the component ref object.
     */
    private innerComponentRef: ComponentRef<ModalComponentBase<TParameters, TResult>>;

    /**
     * The type of the modal component.
     */
    readonly type: Type<ModalComponentBase<TParameters, TResult>>

    /**
     * Resolves and finish successfully the modal dialog.
     */
    resolve: (result?: TResult) => void;

    /**
     * Rejects and finish unsuccessfully the modal dialog.
     */
    reject: (reason?: string) => void;

    /**
     * Gets the component ref associated to the modal dialog.
     */
    get componentRef(): ComponentRef<ModalComponentBase<TParameters, TResult>> { return this.innerComponentRef; }

    /**
     * Creates an instance of @see ModalInstance
     * @param type the modal component type.
     */
    constructor(type: Type<ModalComponentBase<TParameters, TResult>>)
    {
        this.type = type;
    }

    /**
     * Sets the component ref reference.
     * @param componentRef the component ref object.
     */
    setComponentRef(componentRef: ComponentRef<ModalComponentBase<TParameters, TResult>>): void
    {
        this.innerComponentRef = componentRef;
    }
}

@Injectable({
    providedIn: 'root'
})
export class ModalService extends ServiceBase
{
    /**
     * A stack of modal instances.
     */
    private modalInstances: ArrayList<ModalInstance<any, any>>;

    /**
     * A reference to the view container ref that will hold
     * and contain the modal components.
     */
    private viewContainer: ViewContainerRef;

    /**
     * Creates a new instance of @see ModalService
     * @param resolver a reference to the component factory resolver,
     * @param injector a reference to the DI injector container
     */
    constructor(
        private resolver: ComponentFactoryResolver,
        private injector: Injector)
    {
        super();
        this.modalInstances = new ArrayList();
    }

    /**
     * Sets the view container ref that will hold and contain
     * the modal components.
     * @param container the view container ref.
     */
    setViewContainer(container: ViewContainerRef): void
    {
        if (ObjectExtensions.isNull(container))
        {
            throw new Error('The container can not be null or undefined.');
        }

        this.viewContainer = container;
    }

    /**
     * Gets the stack of modal instances.
     */
    getModalInstances(): ArrayList<ModalInstance<any, any>>
    {
        return this.modalInstances;
    }

    /**
     * Opens a modal dialog component.
     * @param type The modal component type.
     * @param parameters the creation parameters to pass to the modal component.
     */
    open<TParameters, TResult>(type: Type<ModalComponentBase<TParameters, TResult>>, parameters?: TParameters): Promise<TResult>
    {
        // create modal instance.
        const modalInstance = new ModalInstance<TParameters, TResult>(type);
        this.modalInstances.add(modalInstance);

        // setup the modal promise.
        const promise = new Promise<TResult>((resolve, reject) =>
        {
            modalInstance.resolve = (result?: TResult) =>
            {
                resolve(result);
                this.remove(modalInstance);
            };
            modalInstance.reject = (reason?: string) =>
            {
                reject(reason);
                this.remove(modalInstance);
            };
        });

        // create the component.
        const factory = this.resolver.resolveComponentFactory(type);
        const componentRef = factory.create(this.injector);

        // initialize the modal and component.
        modalInstance.setComponentRef(componentRef);
        componentRef.instance.setModalService(this);
        componentRef.instance.setModalInstance(modalInstance);
        componentRef.instance.setParameters(parameters);

        // insert view on screen.
        this.viewContainer.insert(componentRef.hostView);

        // return the promise.
        return promise;
    }

    /**
     * Removes the modal from the stack of modal instances.
     * @param modalInstance the modal that will be removed.
     */
    private remove<TParameters, TResult>(modalInstance: ModalInstance<TParameters, TResult>): void
    {
        this.modalInstances.remove(modalInstance);
        this.viewContainer.remove(this.viewContainer.indexOf(modalInstance.componentRef.hostView));
    }
}
