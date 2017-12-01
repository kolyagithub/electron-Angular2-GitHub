import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {Router} from "@angular/router";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {remote} from "electron";
import {ElectronService} from "./electron.service";

@Injectable()
export class GithubService {

    owner: string;
    repo: string;
    tables: string[];
    availableRepoTables: any[] = [];

    constructor(private _http: Http, private router: Router, private electronService: ElectronService) {
    }

    checkRepository(owner: string, repoName: string): Promise<String> {

        this.owner = owner;
        this.repo = repoName;

        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        var data = JSON.stringify({
            owner: owner,
            repoName: repoName
        });

        return this._http.post('http://localhost:3310/gh/checkRepository', data, options).toPromise()
            .then((res: Response) => {
                let body = res.json();
                return body.success;
            })
            .catch(this.handleErrorPromise);
    }

    private handleErrorPromise(error: Response | any) {
        console.error(error.message || error);
        return Promise.reject(error.message || error);
    }

    public logIn() {

        var self = this;
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});

        var currentWin = this.electronService.getCurrentWin();

        self._http.get('http://localhost:3310/gh/oauthUrl', options).toPromise()
            .then((res: Response) => {
                let body = res.json();
                let oauthUrl = body.oauthUrl;
                let BrowserWindow = remote.BrowserWindow;
                var authWindow = new BrowserWindow({
                    width: 800,
                    height: 800,
                    show: false,
                    autoHideMenuBar: true,
                    parent: currentWin,
                    frame: true
                });
                authWindow.loadURL(oauthUrl);
                authWindow.show();

                function handleCallback(url) {
                    var raw_code = /code=([^&]*)/.exec(url) || null;
                    var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
                    var error = /\?error=(.+)$/.exec(url);

                    if (code || error) {
                        authWindow.destroy();
                    }
                    if (code) {
                        // get access_token by code
                        let data = JSON.stringify({
                            code: decodeURIComponent(code)
                        });
                        self._http.post('http://localhost:3310/gh/accessToken', data, options).toPromise()
                            .then((res: Response) => {
                                let body = res.json();
                                if (body.success) {
                                    // check repo is has
                                    self.checkRepository(self.owner, self.repo)
                                        .then(success => {
                                                if (success) {
                                                    self.router.navigate(["loading"]);
                                                    self.setAvailableRepoTables(self.owner, self.repo, () => {
                                                        self.router.navigate(["repo-items"]);
                                                    });
                                                }
                                                else {
                                                    alert('Repository or organization not found !');
                                                    self.router.navigate(["entry"]);
                                                }
                                            },
                                            error => {
                                                alert('Check repository error!');
                                                console.log('Error msg: ', error);
                                                self.router.navigate(["entry"]);
                                            });

                                }
                                else self.router.navigate(["login"]);
                            })
                            .catch(self.handleErrorPromise);

                    } else if (error) {
                        alert('Oops! Something went wrong and we couldn\'t' +
                            'log you in using Github. Please try again.');
                        self.router.navigate(["entry"]);
                    }
                }

                authWindow.webContents.on('will-navigate', function (event, url) {
                    handleCallback(url);
                });

                authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
                    handleCallback(newUrl);
                });

                authWindow.on("close", () => {
                    authWindow = null;
                    currentWin.close();
                });

                authWindow.on("closed", () => {
                    authWindow = null;
                });

            })
            .catch(self.handleErrorPromise);
    }

    getAvailableRepoTables() {
        return this.availableRepoTables;
    }

    setAvailableRepoTables(owner: string, repo: string, cb: Function) {

        // get available repo items (Issues, Commits, Branches etc.)
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});

        let data = JSON.stringify({
            owner: owner,
            repo: repo
        });

        this._http.post('http://localhost:3310/gh/availableRepoTables', data, options).toPromise()
            .then((res: Response) => {
                let body = res.json();
                this.availableRepoTables = body.tables;
                cb();
            })
            .catch(this.handleErrorPromise);
    }

    loadAndSaveContent(selectedTables) {

        let body = JSON.stringify({
            tables: selectedTables,
            owner: this.owner,
            repo: this.repo
        });
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this._http.post('http://localhost:3310/gh/loadData', body, options)
            .map(res => res.json());
    }

}
