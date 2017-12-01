import {Component, OnInit, NgZone} from '@angular/core';
import {Router} from "@angular/router";
import {ElectronService} from '../services/electron.service';
import {GithubService} from '../services/github.service';
import * as _ from 'underscore';

@Component({
    selector: 'repo-items',
    templateUrl: './repo-items.component.html',
    styleUrls: ['../style.scss']
})

export class RepoItemsComponent implements OnInit {
    availableRepoTables: any[] = [];
    customRepoTables: any[] = [];
    selectedAll: any;
    hasSelected: boolean = false;

    data: any[] = [];
    colHeaders: string[];
    columns: any[];
    options: any;

    constructor(private electronService: ElectronService, private githubService: GithubService, private router: Router, private ngZone: NgZone) {
        this.electronService.resizeWindow(1200, 770);

        this.availableRepoTables = this.githubService.getAvailableRepoTables();
        this.availableRepoTables.forEach(x => {
            this.customRepoTables.push({
                name: x.tableName,
                selected: false
            })
        });
    }

    ngOnInit() {
    }

    selectAll() {
        this.ngZone.run(() => {
            for (var i = 0; i < this.customRepoTables.length; i++) {
                this.customRepoTables[i].selected = this.selectedAll;
            }
            this.hasSelected = typeof _.findWhere(this.customRepoTables, {selected: true}) == 'object';
        });
    }

    selectOne(e) {
        this.ngZone.run(() => {
            this.selectedAll = this.customRepoTables.every(function (item: any) {
                return item.selected == true;
            });
            this.showContent(e.target.value);
            this.hasSelected = typeof _.findWhere(this.customRepoTables, {selected: true}) == 'object';
        });
    }

    showContent(tableName: string) {

        let tableObject: any = _.findWhere(this.availableRepoTables, {tableName: tableName});

        this.ngZone.run(() => {
            this.data = tableObject.content;
            this.colHeaders = tableObject.headerNames;

            let columns = [], k = 0;
            tableObject.headerTypes.forEach(x => {
                columns.push({
                    data: k++,
                    type: x == 'integer' ? 'numeric' : x == 'bool' ? 'checkbox' : x == 'date' ? 'date' : 'text'
                })
            });

            this.columns = columns;
            this.options = {
                height: 565,
                rowHeaders: true,
                stretchH: 'all',
                columnSorting: true,
                contextMenu: true,
                className: 'htCenter htMiddle',
                readOnly: true
            };
        });
    }

    loadDataBtn() {
        let selectedTables = [];
        _.where(this.customRepoTables, {selected: true}).forEach(x => {
            selectedTables.push(x.name);
        });
        this.githubService.loadAndSaveContent(selectedTables)
            .subscribe(res => {
            });
        this.router.navigate(["process"]);
    }

    cancelBtn() {
        this.electronService.closeApp();
    }

    backBtn() {
        this.router.navigate(["entry"]);
    }
}
