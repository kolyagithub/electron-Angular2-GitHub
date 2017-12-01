import {Injectable} from "@angular/core";
import "rxjs/add/operator/toPromise";
import {remote} from "electron";

@Injectable()
export class ElectronService {

    currentWindow: any;
    BrowserWindow: any;
    LoadingWindow: any;

    constructor() {
        let {BrowserWindow} = require('electron').remote;
        this.currentWindow = BrowserWindow.getFocusedWindow();
        this.BrowserWindow = remote.BrowserWindow;
    }

    currentWinHide() {
        this.currentWindow.hide();
    }

    currentWinShow() {
        this.currentWindow.show();
    }

    getCurrentWin() {
        return this.currentWindow;
    }

    resizeWindow(width: number, height: number) {
        this.currentWindow.setSize(width, height);
        this.currentWindow.center()
    }

    closeApp() {
        this.currentWindow.close();
    }

}
