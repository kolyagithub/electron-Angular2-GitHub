import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {EntryComponent} from "../entry/entry.component";
import {LoginComponent} from "../login/login.component";
import {RepoItemsComponent} from "../repo-items/repo-items.component";
import {LoadingComponent} from "../loading/loading.component";
import {ProcessComponent} from "../process/process.component";

const appRoutes: Routes = [
    {component: LoginComponent, path: "login"},
    {component: RepoItemsComponent, path: "repo-items"},
    {component: LoadingComponent, path: "loading"},
    {component: ProcessComponent, path: "process"},
    {component: EntryComponent, path: "entry"},
    {component: EntryComponent, path: "**"}
];

export const APP_ROUTING: ModuleWithProviders = RouterModule.forRoot(appRoutes);
