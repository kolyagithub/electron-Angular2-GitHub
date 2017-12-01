import {Component, OnInit, NgZone} from "@angular/core";
import {Observable} from 'rxjs';
import {ElectronService} from "../../github/services/electron.service";

@Component({
    selector: "loading",
    templateUrl: "./loading.component.html",
    styleUrls: ['../style.scss']
})
export class LoadingComponent implements OnInit {

    private tick: string = '00:00';
    private seconds = 0;

    constructor(private electronService: ElectronService, private ngZone: NgZone) {
        this.electronService.resizeWindow(400, 210);
    }

    ngOnInit() {
        this.ngZone.run(() => {
            let timer = Observable.timer(2000, 1000);
            timer.subscribe(t => this.ticker());
        });
    }

    ticker() {
        this.ngZone.run(() => {
            ++this.seconds;
            var secs = this.seconds;
            secs %= 3600;
            var mns = Math.floor(secs / 60);
            secs %= 60;
            this.tick = ( mns < 10 ? "0" : "" ) + mns + ":" + ( secs < 10 ? "0" : "" ) + secs;
        });
    }

    cancelBtn() {
        this.electronService.closeApp();
    }

}




