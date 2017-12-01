import {Component} from "@angular/core";
import {SocketIOService} from "./../services/socket-io.service";

@Component({
    selector: "app",
    templateUrl: "./app.component.html",
    styleUrls: ['../style.scss']
})
export class AppComponent {

    appIco = '../assets/icon/app.ico';

    // socketIOService --- for start socket connecting
    constructor(private socketIOService: SocketIOService) {
    }

    closeBtn() {
        const {BrowserWindow} = require('electron').remote;
        var window = BrowserWindow.getFocusedWindow();
        window.close();
    }
}
