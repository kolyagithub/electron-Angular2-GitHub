import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {GithubService} from '../services/github.service';
import {ElectronService} from '../services/electron.service';

@Component({
    selector: 'entry',
    templateUrl: './entry.component.html',
    styleUrls: ['../style.scss']
})
export class EntryComponent {

    constructor(private githubService: GithubService, private electronService: ElectronService, private router: Router) {
        this.electronService.resizeWindow(600, 300);
    }

    public submitEntry(event: Event, owner: string, repo: string) {
        event.preventDefault();
        this.githubService.checkRepository(owner, repo)
            .then(success => {
                    if (success) {
                        this.router.navigate(["loading"]);
                        this.githubService.setAvailableRepoTables(owner, repo, () => {
                            this.router.navigate(["repo-items"]);
                        });
                    }
                    else {
                        this.router.navigate(["login"]);
                    }

                },
                error => {
                    console.log('Error msg: ', error)
                });
    }

    public closeEntry() {
        this.electronService.closeApp();
    }

}
