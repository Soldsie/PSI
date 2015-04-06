var async = require('async');
var _ = require('underscore')._;
var logger = require("../util/logger.js");
var accountant = require('../service/accountant.js')

var graphData = require('../service/graph-data.js');


var buildGraph = function buildGraph(req, res) {
    var tag = req.params.tag || '';

    graphData.cumulativeData(tag, function(err, result) {
        console.log(result);    
        res.json({
            data: result
        });
    })



};

module.exports = {
    buildGraph: buildGraph
};