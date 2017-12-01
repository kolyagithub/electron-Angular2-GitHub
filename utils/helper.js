const _ = require('underscore')._
    , logger = require('./logger')(__filename);

let exports = module.exports = {};


// <editor-fold desc="check types">
exports.isEmptyString = (obj) => {
    if (typeof obj == 'undefined') return true;
    if (obj == null) return true;
    return !(obj.length > 0);
};

exports.isNumber = (obj) => {
    return (typeof obj == 'number');
};

exports.isNullOrUndefined = (obj) => {
    if (typeof obj == 'undefined') return true;
    else if (obj == null) return true;
    return false;
};

let isDate = exports.isDate = (dateStr) => {
    if (dateStr == "" || dateStr == null) {
        return false;
    }
    else {
        dateStr = dateStr.trim(); //Trim out any whitespace
        let parsedDate = Date.parse(dateStr);
        let regTestDate_start1or2digit = /^[0-9]{1,2}[/\-\\\.][0-9]{1,2}[/\-\\\.][0-9]+[.]*/;
        let regTestDate_start4digit = /^[0-9]{4}[/\-\\\.][0-9]{1,2}[/\-\\\.][0-9]+[.]*/;

        let regTestDate = /[$|€|£][.]*/;

        return (new Date(dateStr)).toString() !== "Invalid Date"
            && ((regTestDate_start1or2digit.test(dateStr) || (regTestDate_start4digit.test(dateStr)))
                && !regTestDate.test(dateStr))
            && isNaN(dateStr)
            && !isNaN(parsedDate);
    }
};

let isInt = exports.isInt = (x) => {
    if (x == "" || x == null) return false;
    if (x == 0) return true;
    else {
        try {
            return !isNaN(x) && eval(x).toString().length == parseInt(eval(x)).toString().length
        }
        catch (e) {
            logger.error('Error in isInt() function. Value: ', x);
            return false;
        }
    }

};

let isFloat = exports.isFloat = (x) => {
    if (x == "" || x == null) return false;
    else {
        try {
            return !isNaN(x) && !isInt(eval(x)) && x.toString().length > 0;
        }
        catch (e) {
            logger.error('Error in isFloat() function. Value: ', x);
            return false;
        }
    }
};

exports.isBool = (x) => {
    if (x == 'FALSE' || x == 'TRUE' || x == 'false' || x == 'true') return true;
    else return false;
};
// </editor-fold>

// <editor-fold desc="create table structure">

let setTableName = (tableStructure, tableName) => {
    tableStructure.tableName = tableName;
    return tableStructure;
};

let defineHeadersGH = (obj, nullProperties, headers) => {
    _.mapObject(obj, function (val, key) {
        // define column type
        let type = null;
        if (val === null || _.isObject(val) || _.isArray(val)) {
            nullProperties[key] = type;
            delete headers[key];
        }
        else {
            if (val === false || val === true) type = 'bool';
            else if (val === 0) type = 'integer';
            else if (isInt(val)) type = 'integer';
            else if (isFloat(val)) type = 'float';
            else if (isDate(val)) type = 'date';
            else type = 'string';
        }

        if (!headers.hasOwnProperty(key))
            headers[key] = type;
    });
};

let gitHub = (tableName, contents) => {

    let tableStructure = {
        "tableName": "",
        "headerNames": [],
        "headerTypes": [],
        "content": []
    };
    let nullProperties = {};
    let headers = {};

    // define table and set table name
    let table = setTableName(tableStructure, tableName);

    if (tableName === 'StatsPunchCard') {

        tableStructure.headerNames.push('DayOfWeek', 'HourOfDay', 'NumberOfCommits');
        tableStructure.headerTypes.push('integer', 'integer', 'integer');

        contents.forEach(function (arr) {
            tableStructure.content.push(arr);
        });

    }
    else if (tableName === 'Commits') {

        tableStructure.headerNames.push('author', 'committer', 'message', 'date', 'comment_count', 'sha', 'url', 'html_url', 'comments_url');
        tableStructure.headerTypes.push('string', 'string', 'string', 'date', 'integer', 'string', 'string', 'string', 'string');

        for (let content in contents) {

            let rowData = [];

            rowData.push(contents[content].commit.author.name);
            rowData.push(contents[content].commit.committer.name);
            rowData.push(contents[content].commit.message);
            rowData.push(contents[content].commit.author.date);
            rowData.push(contents[content].commit.comment_count);
            rowData.push(contents[content].sha);
            rowData.push(contents[content].url);
            rowData.push(contents[content].html_url);
            rowData.push(contents[content].comments_url);

            tableStructure.content.push(rowData);
        }

    }
    else {
        // define headers
        for (let content in contents) {
            defineHeadersGH(contents[content], nullProperties, headers);
        }

        // set contents
        for (let content in contents) {

            let rowData = [];
            _.mapObject(contents[content], function (val, key) {
                if (nullProperties.hasOwnProperty(key)) {
                    return;
                }
                else if (headers[key] === 'bool') {
                    rowData.push(contents[content][key]);
                }
                else if (headers[key] === 'integer') {
                    if (isNaN(parseInt(val))) {
                        headers[key] = 'string';
                        rowData.push('');
                    }
                    else {
                        rowData.push(parseInt(val));
                    }
                }
                else if (headers[key] === 'float') {
                    if (isNaN(parseFloat(val))) {
                        headers[key] = 'string';
                        rowData.push('');
                    }
                    else {
                        rowData.push(parseFloat(val));
                    }
                }
                else if (headers[key] === 'date') {
                    try {
                        let isoDate = new Date(contents[content][key]).toISOString();
                        rowData.push(isoDate);
                    }
                    catch (e) {
                        rowData.push('');
                    }
                }
                else rowData.push(contents[content][key] || '');
            });

            table.content.push(rowData);
        }

        _.mapObject(nullProperties, function (val, key) {
            delete headers[key];
        });

        //set finished headers
        _.mapObject(headers, function (val, key) {
            table.headerNames.push(key);
            table.headerTypes.push(val);
        });
    }

    return table;
};

exports.createTable = {
    gh: gitHub
};
// </editor-fold>


