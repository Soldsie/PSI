var async = require('async');
var _ = require('underscore')._;
var logger = require("../util/logger.js");
var accountant = require('../service/accountant.js')

var rankByCategory = function rankByCategory(req, res) {
    var category = req.params.category;

    var brands = [  {name: 'Michael Kors', url:'http://www.michaelkors.com/bags/shoulder-bags/_/N-283l'}, 
                    {name: 'Coach', url:'http://www.coach.com/shop/women-handbags-shoulder-bags?spu=0&cid=S_G253362'}, 
                    {name: 'Louis Vuitton', url:'http://us.louisvuitton.com/eng-us/women/handbags'}, 
                    {name: 'Prada', url:'http://www.prada.com/en/US/e-store/department/woman/handbags.html'}, 
                    {name: 'Hermes', url:'http://usa.hermes.com/leather/bags-and-luggage/for-day.html'}, 
                    {name: 'Gucci', url:'http://www.gucci.com/us/category/f/handbags'}
                ];

    async.waterfall(
        [
            function(waterfallCallback) {
                accountant.scoreInstagram(function(err, result) {
                    process.nextTick(function() {
                        waterfallCallback(null, result);
                    })
                });
            },
            function(instagramResults, waterfallCallback) {
                accountant.scoreTwitter(function(err, twitterResults) {
                    var combined = [];
                    for(var i=0; i<twitterResults.length; i++) {
                        for(var j=0; i<instagramResults.length; j++) {
                            var tid = twitterResults[i].id;
                            var iid = instagramResults[j].id;

                            if(tid == iid) {
                                var temp = instagramResults[i];
                                temp.instagram = temp.value;
                                delete temp.value;

                                temp.twitter = twitterResults[i].value;
                                combined.push(temp);
                                break;
                            } 

                        }
                    }
                    console.log(combined);
                    process.nextTick(function() {
                        waterfallCallback(null, combined);
                    })
                });
            },
            function(brandsData, waterfallCallback) {
                var brandDataWithName = _.map(brands, function(brand) {
                    var brandName = brand.name.replace(/ /g, '');

                    for(var i=0; i<brandsData.length; i++) {
                        var brandData = brandsData[i];
                        var re = new RegExp(brandName, 'i');
                        var hashTag = brandData._id;
                        if(re.test(hashTag)) {
                            brandData['brandName'] =  brand.name;
                            brandData['url'] = brand.url;
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
                    var likes = data.instagram.like;
                    var comments = data.instagram.comment;

                    var tweets = data.twitter.count;
                    var retweets = data.twitter.retweetCount;

                    var brand = data.brandName
                    return {
                        logo: [brand.toLowerCase().replace(/\s/gi, '-'), '-', 'logo', '.png'].join(''),
                        brandName: brand,
                        likes: likes,
                        comments: comments,
                        tweets: tweets,
                        retweets: retweets,
                        score: likes + comments * 2,
                        url: data.url
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