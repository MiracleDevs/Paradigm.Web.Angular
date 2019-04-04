/*!
 * Paradigm Framework - Angular Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Angular/blob/master/LICENSE)
 */

import { OnDestroy, OnInit, Injector } from '@angular/core';
import { ComponentBase } from './base.component';
import { ModalService, ModalInstance } from '../services/modal.service';

export class ModalComponentBase<TParameters, TResult> extends ComponentBase implements OnInit, OnDestroy
{
    protected modalService: ModalService;

    protected modalInstance: ModalInstance<TParameters, TResult>;

    protected parameters: TParameters;

    constructor(protected injector: Injector)
    {
        super(injector);
    }

    setModalService(modalService: ModalService)
    {
        this.modalService = modalService;
    }

    setParameters(parameters: TParameters): void
    {
        this.parameters = parameters;
    }

    setModalInstance(modalInstance: ModalInstance<TParameters, TResult>): void
    {
        this.modalInstance = modalInstance;
    }

    ngOnDestroy(): void
    {

    }

    ngOnInit(): void
    {

    }

    resolve(result?: TResult): void
    {
        this.modalInstance.resolve(result);
    }

    reject(error: string): void
    {
        this.modalInstance.reject(error);
    }
}
