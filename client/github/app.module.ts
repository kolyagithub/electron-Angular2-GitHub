import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {HotTableModule} from 'ng2-handsontable';

import {APP_ROUTING} from "./routes/app.routes";
import {AppComponent} from "./app/app.component";
import {EntryComponent} from './entry/entry.component';
import {LoginComponent} from "./login/login.component";
import {RepoItemsComponent} from "./repo-items/repo-items.component";
import {LoadingComponent} from "./loading/loading.component";
import {ProcessComponent} from "./process/process.component";

import {ElectronService} from "./services/electron.service";
import {GithubService} from "./services/github.service";
import {SocketIOService} from "./services/socket-io.service";

@NgModule({
    imports: [BrowserModule, HttpModule, APP_ROUTING, HotTableModule, FormsModule],
    declarations: [AppComponent, EntryComponent, LoginComponent, RepoItemsComponent, LoadingComponent, ProcessComponent],
    bootstrap: [AppComponent],
    providers: [ElectronService, GithubService, SocketIOService],
})
export class AppModule {
}
