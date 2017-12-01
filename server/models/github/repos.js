const logger = require('../../../utils/logger')(__filename)
    , githubApi = require('./../../../utils/githubApi')
    , server = require('./../../../server/server.js')
    , parseLink = require('parse-link-header');

function pager(res, tableName, io, result) {
    result = result.concat(res);
    let pagesInfo = parseLink(res.meta.link);
    io.sockets.emit('tableName', tableName);
    if (pagesInfo) {
        let pages = pagesInfo.hasOwnProperty('next') ? `Page ${pagesInfo.next.page - 1} of ${pagesInfo.last.page}` : `Finished  ${tableName}!`;
        io.sockets.emit('pages', pages);
    }
    io.sockets.emit('rowCount', res.data.length);
    if (githubApi.hasNextPage(res)) {
        return githubApi.getNextPage(res)
            .then((res) => {
                // if clicked SKIP button
                if (global.skipLoadContent) {
                    // toggle
                    global.skipLoadContent = !global.skipLoadContent;
                    return result;
                }
                else return pager(res, tableName, io, result);
            })
    }
    return result;
}

module.exports = {

    checkRepo: (owner, repo, cb) => {
        githubApi.repos.get({
            owner: owner,
            repo: repo
        }, (err, res) => {
            if (err) {
                logger.error('Error check repo: ', err.code);
                return cb(err.code, null);
            }
            cb(null, res.meta.status);
        });
    },

    // <editor-fold desc="Get Default dates">
    getRepoEvents: (owner, repo, cb) => {
        githubApi.issues.getEventsForRepo({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoEvents: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });

    },

    getRepoNotifications: (owner, repo, cb) => {
        githubApi.activity.getNotificationsForUser({
            owner: owner,
            repo: repo
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoNotifications: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoStargazers: (owner, repo, cb) => {
        githubApi.activity.getStargazersForRepo({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoStargazers: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoSubscribers: (owner, repo, cb) => {
        githubApi.activity.getWatchersForRepo({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoSubscribers: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoReferences: (owner, repo, cb) => {
        githubApi.gitdata.getReferences({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoReferences: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoTags: (owner, repo, cb) => {
        githubApi.repos.getTags({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoTags: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoAssignees: (owner, repo, cb) => {
        githubApi.issues.getAssignees({
            owner: owner,
            repo: repo
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoAssignees: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoIssues: (owner, repo, cb) => {
        githubApi.issues.getForRepo({
            owner: owner,
            repo: repo
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoIssues: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoIssueComments: (owner, repo, cb) => {
        githubApi.issues.getCommentsForRepo({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoIssueComments: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoLabels: (owner, repo, cb) => {
        githubApi.issues.getLabels({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoLabels: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoMilestones: (owner, repo, cb) => {
        githubApi.issues.getMilestones({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoMilestones: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoProjects: (owner, repo, cb) => {
        githubApi.projects.getRepoProjects({
            owner: owner,
            repo: repo
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoProjects: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoPullRequests: (owner, repo, cb) => {
        githubApi.pullRequests.getAll({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoPullRequests: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoBranches: (owner, repo, cb) => {
        githubApi.repos.getBranches({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoBranches: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoClones: (owner, repo, cb) => {
        githubApi.repos.getClones({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoClones: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoCollaborators: (owner, repo, cb) => {
        githubApi.repos.getCollaborators({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoCollaborators: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoCommits: (owner, repo, cb) => {
        githubApi.repos.getCommits({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoCommits: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoContributors: (owner, repo, cb) => {
        githubApi.repos.getContributors({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoContributors: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoDownloads: (owner, repo, cb) => {
        githubApi.repos.getDownloads({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoDownloads: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoForks: (owner, repo, cb) => {
        githubApi.repos.getForks({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoForks: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoHooks: (owner, repo, cb) => {
        githubApi.repos.getHooks({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoHooks: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoLanguages: (owner, repo, cb) => {
        githubApi.repos.getLanguages({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoLanguages: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoPopularFiles: (owner, repo, cb) => {
        githubApi.repos.getPaths({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoPopularFiles: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoReleases: (owner, repo, cb) => {
        githubApi.repos.getReleases({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoReleases: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoStatsContributors: (owner, repo, cb) => {
        githubApi.repos.getStatsContributors({
            owner: owner,
            repo: repo
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoStatsContributors: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoStatsParticipation: (owner, repo, cb) => {
        githubApi.repos.getStatsParticipation({
            owner: owner,
            repo: repo
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoStatsParticipation: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoStatsPunchCard: (owner, repo, cb) => {
        githubApi.repos.getStatsPunchCard({
            owner: owner,
            repo: repo
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoStatsPunchCard: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoTeams: (owner, repo, cb) => {
        githubApi.repos.getTeams({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoTeams: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },

    getRepoViews: (owner, repo, cb) => {
        githubApi.repos.getViews({
            owner: owner,
            repo: repo
            //page: "all",
            //per_page: "all",
        }, (err, res) => {
            if (err) {
                logger.error('Error getRepoViews: ', err.status);
                return cb(err, null);
            }
            cb(null, res.data);
        });
    },
    // </editor-fold>

    // <editor-fold desc="Get Full dates">
    getRepoEventsAll: (owner, repo) => {
        var io = server.io, tableName = 'Events', events = [];
        return githubApi.issues.getEventsForRepo({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, events);
            })
            .catch((exp) => {
                logger.error('Error getRepoEventsAll: ', exp);
            });
    },

    getRepoNotificationsAll: (owner, repo) => {
        var io = server.io, tableName = 'Notifications', notifications = [];
        return githubApi.activity.getNotificationsForUser({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, notifications);
            })
            .catch((exp) => {
                logger.error('Error getRepoNotificationsAll: ', exp);
            });
    },

    getRepoStargazersAll: (owner, repo) => {
        var io = server.io, tableName = 'Stargazers', stargazers = [];
        return githubApi.activity.getStargazersForRepo({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, stargazers);
            })
            .catch((exp) => {
                logger.error('Error getRepoStargazersAll: ', exp);
            });
    },

    getRepoSubscribersAll: (owner, repo) => {
        var io = server.io, tableName = 'Subscribers', subscribers = [];
        return githubApi.activity.getWatchersForRepo({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, subscribers);
            })
            .catch((exp) => {
                logger.error('Error getRepoSubscribersAll: ', exp);
            });
    },

    getRepoReferencesAll: (owner, repo) => {
        var io = server.io, tableName = 'References', references = [];
        return githubApi.gitdata.getReferences({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, references);
            })
            .catch((exp) => {
                logger.error('Error getRepoReferencesAll: ', exp);
            });
    },

    getRepoTagsAll: (owner, repo) => {
        var io = server.io, tableName = 'Tags', tags = [];
        return githubApi.repos.getTags({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, tags);
            })
            .catch((exp) => {
                logger.error('Error getRepoTagsAll: ', exp);
            });
    },

    getRepoAssigneesAll: (owner, repo) => {
        var io = server.io, tableName = 'Assignees', assignees = [];
        return githubApi.issues.getAssignees({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, assignees);
            })
            .catch((exp) => {
                logger.error('Error getRepoAssigneesAll: ', exp);
            });
    },

    getRepoIssuesAll: (owner, repo) => {
        var io = server.io, tableName = 'Issues', issues = [];
        return githubApi.issues.getForRepo({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, issues);
            })
            .catch((exp) => {
                logger.error('Error getRepoIssuesAll: ', exp);
            });
    },

    getRepoIssueCommentsAll: (owner, repo) => {
        var io = server.io, tableName = 'IssueComments', issueComments = [];
        return githubApi.issues.getCommentsForRepo({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, issueComments);
            })
            .catch((exp) => {
                logger.error('Error getRepoIssueCommentsAll: ', exp);
            });
    },

    getRepoLabelsAll: (owner, repo) => {
        var io = server.io, tableName = 'Labels', labels = [];
        return githubApi.issues.getLabels({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, labels);
            })
            .catch((exp) => {
                logger.error('Error getRepoLabelsAll: ', exp);
            });
    },

    getRepoMilestonesAll: (owner, repo) => {
        var io = server.io, tableName = 'Milestones', milestones = [];
        return githubApi.issues.getMilestones({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, milestones);
            })
            .catch((exp) => {
                logger.error('Error getRepoMilestonesAll: ', exp);
            });
    },

    getRepoProjectsAll: (owner, repo) => {
        var io = server.io, tableName = 'Projects', projects = [];
        return githubApi.projects.getRepoProjects({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, projects);
            })
            .catch((exp) => {
                logger.error('Error getRepoProjectsAll: ', exp);
            });
    },

    getRepoPullRequestsAll: (owner, repo) => {
        var io = server.io, tableName = 'PullRequests', pullRequests = [];
        return githubApi.pullRequests.getAll({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, pullRequests);
            })
            .catch((exp) => {
                logger.error('Error getRepoPullRequestsAll: ', exp);
            });
    },

    getRepoBranchesAll: (owner, repo) => {
        var io = server.io, tableName = 'Branches', branches = [];
        return githubApi.repos.getBranches({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, branches);
            })
            .catch((exp) => {
                logger.error('Error getRepoBranchesAll: ', exp);
            });
    },

    getRepoClonesAll: (owner, repo) => {
        var io = server.io, tableName = 'RepoClones', repoClones = [];
        return githubApi.repos.getClones({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, repoClones);
            })
            .catch((exp) => {
                logger.error('Error getRepoClonesAll: ', exp);
            });
    },

    getRepoCollaboratorsAll: (owner, repo) => {
        var io = server.io, tableName = 'Collaborators', collaborators = [];
        return githubApi.repos.getCollaborators({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, collaborators);
            })
            .catch((exp) => {
                logger.error('Error getRepoCollaboratorsAll: ', exp);
            });
    },

    getRepoCommitsAll: (owner, repo) => {
        var io = server.io, tableName = 'Commits', commits = [];
        return githubApi.repos.getCommits({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, commits);
            })
            .catch((exp) => {
                logger.error('Error getRepoCommitsAll: ', exp);
            });
    },

    getRepoContributorsAll: (owner, repo) => {
        var io = server.io, tableName = 'Contributors', contributors = [];
        return githubApi.repos.getContributors({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, contributors);
            })
            .catch((exp) => {
                logger.error('Error getRepoContributorsAll: ', exp);
            });
    },

    getRepoDownloadsAll: (owner, repo) => {
        var io = server.io, tableName = 'Downloads', downloads = [];
        return githubApi.repos.getDownloads({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, downloads);
            })
            .catch((exp) => {
                logger.error('Error getRepoDownloadsAll: ', exp);
            });
    },

    getRepoForksAll: (owner, repo) => {
        var io = server.io, tableName = 'Forks', forks = [];
        return githubApi.repos.getForks({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, forks);
            })
            .catch((exp) => {
                logger.error('Error getRepoForksAll: ', exp);
            });
    },

    getRepoHooksAll: (owner, repo) => {
        var io = server.io, tableName = 'Hooks', hooks = [];
        return githubApi.repos.getHooks({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, hooks);
            })
            .catch((exp) => {
                logger.error('Error getRepoHooksAll: ', exp);
            });
    },

    getRepoLanguagesAll: (owner, repo) => {
        var io = server.io, tableName = 'Languages', languages = [];
        return githubApi.repos.getLanguages({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, languages);
            })
            .catch((exp) => {
                logger.error('Error getRepoLanguagesAll: ', exp);
            });
    },

    getRepoPopularFilesAll: (owner, repo) => {
        var io = server.io, tableName = 'PopularFiles', popularFiles = [];
        return githubApi.repos.getPaths({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, popularFiles);
            })
            .catch((exp) => {
                logger.error('Error getRepoPopularFilesAll: ', exp);
            });
    },

    getRepoReleasesAll: (owner, repo) => {
        var io = server.io, tableName = 'Releases', releases = [];
        return githubApi.repos.getReleases({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, releases);
            })
            .catch((exp) => {
                logger.error('Error getRepoReleasesAll: ', exp);
            });
    },

    getRepoStatsContributorsAll: (owner, repo) => {
        var io = server.io, tableName = 'StatsContributors', statsContributors = [];
        return githubApi.repos.getStatsContributors({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, statsContributors);
            })
            .catch((exp) => {
                logger.error('Error getRepoStatsContributorsAll: ', exp);
            });
    },

    getRepoStatsParticipationAll: (owner, repo) => {
        var io = server.io, tableName = 'StatsParticipation', statsParticipation = [];
        return githubApi.repos.getStatsParticipation({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, statsParticipation);
            })
            .catch((exp) => {
                logger.error('Error getRepoStatsParticipationAll: ', exp);
            });
    },

    getRepoStatsPunchCardAll: (owner, repo) => {
        var io = server.io, tableName = 'StatsPunchCard', statsPunchCard = [];
        return githubApi.repos.getStatsPunchCard({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, statsPunchCard);
            })
            .catch((exp) => {
                logger.error('Error getRepoStatsPunchCardAll: ', exp);
            });
    },

    getRepoTeamsAll: (owner, repo) => {
        var io = server.io, tableName = 'Teams', teams = [];
        return githubApi.repos.getTeams({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, teams);
            })
            .catch((exp) => {
                logger.error('Error getRepoTeamsAll: ', exp);
            });
    },

    getRepoViewsAll: (owner, repo) => {
        var io = server.io, tableName = 'Views', views = [];
        return githubApi.repos.getViews({
            owner: owner,
            repo: repo
        })
            .then((res) => {
                return pager(res, tableName, io, views);
            })
            .catch((exp) => {
                logger.error('Error getRepoViewsAll: ', exp);
            });
    }
    // </editor-fold>

};
