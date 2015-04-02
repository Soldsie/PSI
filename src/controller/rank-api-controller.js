var async = require('async');
var _ = require('underscore')._;
var logger = require("../util/logger.js");

var rankByCategory = function rankByCategory(req, res) {
    var category = req.params.category;
    // TODO: use category to pull data from DB
    var brands = ['Michael Kors', 'Coach', 'Louis Vuitton', 'Prada', 'Hermes', 'Chanel', 'Gucci'];
    async.waterfall(
        [
            function(waterfallCallback) {
                var rankModels = _.map(brands, function(brand) {
                    var randomLikes = Math.ceil(Math.random() * 5000);
                    var randomComments = Math.ceil(Math.random() * 800);
                    return {
                        logo: [brand.toLowerCase().replace(/\s/gi, '-'), '-', 'logo', '.png'].join(''),
                        brandName: brand,
                        likes: randomLikes,
                        comments: randomComments,
                        score: randomLikes + randomComments * 2
                    }
                });
                process.nextTick(function() {
                    waterfallCallback(null, rankModels);
                });
            },
            function(rankModels, waterfallCallback) {
                var sortedRankModels = _.sortBy(rankModels, function(rankModel) {
                    return rankModel.score * -1;
                });
                process.nextTick(function() {
                    waterfallCallback(null, sortedRankModels);
                });
            },
            function(sortedRankModels, waterfallCallback) {
                var completeRankModels = _.each(sortedRankModels, function(rankModel, index) {
                    rankModel.rank = index + 1;
                });
                process.nextTick(function() {
                    waterfallCallback(null, completeRankModels);
                });
            }
        ],
        function(err, rankModels) {
            res.json({
                category: category,
                ranking: rankModels
            });
        }
    );

};

module.exports = {
    rankByCategory: rankByCategory
};