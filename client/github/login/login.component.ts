import {Component} from "@angular/core";
import {GithubService} from "../services/github.service";
import {ElectronService} from "../../github/services/electron.service";

@Component({
    selector: "my-login",
    templateUrl: "./login.component.html",
})
export class LoginComponent {

    isClick: boolean = false;

    constructor(private electronService: ElectronService, private githubService: GithubService) {
        this.electronService.resizeWindow(500, 400);
    }

    public login() {
        this.isClick = true;
        this.githubService.logIn();
    }

}
