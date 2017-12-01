const electron = require('../../electron/main')
    , githubRepo = require('../models/github/repos')
    , config = require('../config/config')
    , modalError = require('../../electron/modals/errors')
    , githubApi = require('../../utils/githubApi')
    , customAsync = require('../../utils/customWaterfall')
    , Promise = require("bluebird")
    , _request = Promise.promisifyAll(require("request"), {multiArgs: true})
    , logger = require('../../utils/logger')(__filename)
    , fs = require('fs')
    , helper = require('../../utils/helper');

module.exports = {

    checkRepository: (req, res) => {

        let owner = req.body.owner;
        let repo = req.body.repoName;

        // check repo (if return 404 informed user: Repo not found or not access)
        githubRepo.checkRepo(owner, repo, (errCode, successStatus) => {
            if (successStatus == '200 OK') {
                res.send({success: true});
                res.end();
            }
            else {
                res.send({success: false});
                res.end();
            }
        });
    },

    oauthUrl: (req, res) => {
        res.send({oauthUrl: `${config.gh.oauthUrl}?client_id=${config.gh.clientId}&redirect=${config.gh.callbackUrl}&scope=repo`});
        res.end();
    },

    accessToken: (req, res) => {
        getToken(req.body.code, (err, accessToken) => {
            if (err) {
                res.send({success: false});
                res.end();
            }
            else {

                githubApi.authenticate({
                    type: "oauth",
                    token: accessToken
                });

                res.send({success: true});
                res.end();
            }
        })


    },

    availableRepoTables: (req, res) => {

        let owner = req.body.owner;
        let repo = req.body.repo;
        let result = [];

        customAsync.waterfall([

                // get Events
                function (callback) {
                    githubRepo.getRepoEvents(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Events', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Assignees
                function (next, callback) {
                    githubRepo.getRepoAssignees(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Assignees', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Notifications
                function (next, callback) {
                    githubRepo.getRepoNotifications(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Notifications', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Issues
                function (next, callback) {
                    githubRepo.getRepoIssues(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Issues', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Stargazers
                function (next, callback) {
                    githubRepo.getRepoStargazers(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Stargazers', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Subscribers
                function (next, callback) {
                    githubRepo.getRepoSubscribers(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Subscribers', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get References
                function (next, callback) {
                    githubRepo.getRepoReferences(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('References', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Tags
                function (next, callback) {
                    githubRepo.getRepoTags(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Tags', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get IssueComments
                function (next, callback) {
                    githubRepo.getRepoIssueComments(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('IssueComments', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Labels
                function (next, callback) {
                    githubRepo.getRepoLabels(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Labels', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Milestones
                function (next, callback) {
                    githubRepo.getRepoMilestones(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Milestones', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Projects
                function (next, callback) {
                    githubRepo.getRepoProjects(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Projects', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get PullRequests
                function (next, callback) {
                    githubRepo.getRepoPullRequests(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('PullRequests', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Branches
                function (next, callback) {
                    githubRepo.getRepoBranches(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Branches', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Clones
                function (next, callback) {
                    githubRepo.getRepoClones(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Clones', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Collaborators
                function (next, callback) {
                    githubRepo.getRepoCollaborators(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Collaborators', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Commits
                function (next, callback) {
                    githubRepo.getRepoCommits(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Commits', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Contributors
                function (next, callback) {
                    githubRepo.getRepoContributors(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Contributors', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Downloads
                function (next, callback) {
                    githubRepo.getRepoDownloads(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Downloads', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Forks
                function (next, callback) {
                    githubRepo.getRepoForks(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Forks', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Hooks
                function (next, callback) {
                    githubRepo.getRepoHooks(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Hooks', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Languages
                function (next, callback) {
                    githubRepo.getRepoLanguages(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Languages', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get PopularFiles
                function (next, callback) {
                    githubRepo.getRepoPopularFiles(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('PopularFiles', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Releases
                function (next, callback) {
                    githubRepo.getRepoReleases(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Releases', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get StatsContributors
                function (next, callback) {
                    githubRepo.getRepoStatsContributors(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('StatsContributors', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get StatsParticipation
                function (next, callback) {
                    githubRepo.getRepoStatsParticipation(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('StatsParticipation', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get StatsPunchCard
                function (next, callback) {
                    githubRepo.getRepoStatsPunchCard(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('StatsPunchCard', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Teams
                function (next, callback) {
                    githubRepo.getRepoTeams(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Teams', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                },

                // get Views
                function (next, callback) {
                    githubRepo.getRepoViews(owner, repo, (err, res) => {
                        if (err) {
                            return callback(null, true);
                        }
                        if (res.length > 0) {
                            let obj = helper.createTable.gh('Views', res);
                            result.push(obj);
                        }
                        callback(null, true);
                    });
                }

            ],
            function (err, response) {
                logger.info('Available tables count: ', result.length);
                res.send({tables: result});
                res.end();
            });
    },

    loadData: (req, res) => {

        let tables = req.body.tables;
        let owner = req.body.owner;
        let repo = req.body.repo;
        let result = [], funcs = [];

        tables.forEach((table, i) => {
            let fn;
            if (funcs.length > 0) {
                fn = function (next, callback) {
                    githubRepo[`getRepo${table}All`](owner, repo)
                        .then((repoData) => {
                            if (repoData.length > 0 && repoData[0].data.length > 0) {
                                parseContent(repoData, table, result);
                            }
                            callback(null, true);
                        })
                        .catch((exp) => {
                            return callback(null, true);
                        })
                };
            }
            else {
                fn = function (callback) {
                    githubRepo[`getRepo${table}All`](owner, repo)
                        .then((repoData) => {
                            if (repoData.length > 0 && repoData[0].data.length > 0) {
                                parseContent(repoData, table, result);
                            }
                            callback(null, true);
                        })
                        .catch((exp) => {
                            return callback(null, true);
                        })
                };
            }
            funcs.push(fn);
        });

        customAsync.waterfall(funcs,
            function (err, response) {
                fs.writeFileSync(config.resultFile, JSON.stringify(result), 'utf-8');
                logger.info('GitHub. Result file saved!');
                electron.closeApp();
                res.end();
            });

    }

};

function getToken(code, cb) {
    if (helper.isNullOrUndefined(code)) {
        logger.error('Empty return code github OAuth!');
        return cb('Error', null);
    }
    _request({
            url: config.gh.accessUrl,
            method: 'POST',
            qs: {
                client_id: config.gh.clientId,
                client_secret: config.gh.clientSecret,
                code: code
            },
            responseType: 'json',
            resolveWithFullResponse: true,
            json: true
        }, (error, response, body) => {

            if (!error && response.statusCode == 200) {

                let accessToken = response.body.access_token;
                cb(null, accessToken);

            }
            else {
                logger.error('Error authenticate. ', error);
                modalError.showError(electron.getCurrentWindow(), 'Error authenticate.', error);
                cb(error, null);
            }
        }
    );
}

function parseContent(repoData, tableName, result) {
    let allObj = [], allData = [];
    repoData.forEach((item, i) => {
        if (item.data.length > 0) {
            let obj = helper.createTable.gh(tableName, item.data);
            allObj.push(obj);
        }
    });
    // parse all data content
    allObj.forEach((obj, i) => {
        allData = allData.concat(obj.content);
    });
    let resultObj = {
        "tableName": allObj[0].tableName,
        "headerNames": allObj[0].headerNames,
        "headerTypes": allObj[0].headerTypes,
        "content": allData
    };
    result.push(resultObj);
}