/*!
 * Paradigm Framework - Angular Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Angular/blob/master/LICENSE)
 */

import { OnDestroy, OnInit, Injector } from '@angular/core';

export class ComponentBase implements OnInit, OnDestroy
{
    constructor(protected injector: Injector)
    {
    }

    ngOnInit(): void
    {
    }

    ngOnDestroy(): void
    {
    }
}
