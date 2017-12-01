import {Component, OnInit, NgZone} from "@angular/core";
import {SocketIOService} from '../services/socket-io.service';
import {ElectronService} from '../services/electron.service';

@Component({
    selector: "process",
    templateUrl: "./process.component.html",
    styleUrls: ['../style.scss']
})
export class ProcessComponent implements OnInit {
    SocketInstance: any = null;
    rowCount: number = 0;
    tableName: string = '';
    pages: string = '';

    constructor(private electronService: ElectronService, private ngZone: NgZone, private socketIOService: SocketIOService) {
        this.electronService.resizeWindow(400, 260);

        this.SocketInstance = this.socketIOService.getSocketInstance();

        this.SocketInstance.on('rowCount', (result) => {
            this.ngZone.run(() => {
                this.rowCount += result;
            });
        });

        this.SocketInstance.on('tableName', (result) => {
            this.ngZone.run(() => {
                this.tableName = result;
            });
        });

        this.SocketInstance.on('pages', (result) => {
            this.ngZone.run(() => {
                this.pages = result;
            });
        });
    }

    ngOnInit() {

    }

    skipBtn() {
        this.socketIOService.emit('skipLoadContent', true);
    }

    cancelBtn() {
        this.electronService.closeApp();
    }

}
