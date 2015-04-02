var async = require('async');
var _ = require('underscore')._;
var logger = require("../util/logger.js");
var accountant = require('../service/accountant.js')

var rankByCategory = function rankByCategory(req, res) {
    var category = req.params.category;

    var brands = ['Michael Kors', 'Coach', 'Louis Vuitton', 'Prada', 'Hermes', 'Gucci'];

    async.waterfall(
        [
            function(waterfallCallback) {
                accountant.score(function(err, result) {
                    process.nextTick(function() {
                        waterfallCallback(null, result);
                    })
                });
            },
            function(brandsData, waterfallCallback) {
                var brandDataWithName = _.map(brands, function(brand) {
                    var brandName = brand.replace(/ /g, '');

                    for(var i=0; i<brandsData.length; i++) {
                        var brandData = brandsData[i];
                        var re = new RegExp(brandName, 'i');
                        var hashTag = brandData._id;
                        if(re.test(hashTag)) {
                            brandData['brandName'] =  brand;
                            return brandData;
                        } 
                    }
                });

                process.nextTick(function() {
                    waterfallCallback(null, brandDataWithName);
                })
            },
            function(brandDataWithName, waterfallCallback) {
                var rankModels = _.map(brandDataWithName, function(data) {
                    var randomLikes = data.value.like;
                    var randomComments = data.value.comment;
                    var brand = data.brandName
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