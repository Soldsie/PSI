(function() {
    var initCategoryView = function() {
        var productCategories = ['Purse', 'Handbag', 'Watch', 'Smart Watch'];
        var category = new window.psi.model.Category();
        var categoryView = new window.psi.view.CategoryView({
            model: category,
            el: $('#prod-cats'),
            categoryNames: productCategories,
            template: $('#template-cat')
        });
    };
    
    var initResultListView = function() {
        // TODO: rank models to be returned by REST from server
        var brands = ['Michael Kors', 'Coach', 'Louis Vuitton', 'Prada', 'Hermes', 'Chanel', 'Gucci'];
        var rankModels = _.chain(brands)
            .map(function(brand) {
                var randomLikes = Math.ceil(Math.random() * 5000);
                var randomComments = Math.ceil(Math.random() * 800);
                return {
                    logo: [brand.toLowerCase().replace(/\s/gi, '-'), '-', 'logo', '.png'].join(''),
                    brandName: brand,
                    likes: randomLikes,
                    comments: randomComments,
                    score: randomLikes + randomComments * 2
                }
            })
            .sortBy(function(rankModel) {
                return rankModel.score * -1;
            })
            .each(function(rankModel, index) {
                rankModel.rank = index + 1;
            })
            .value();
        var rankListView = new window.psi.view.RankListView({
            collection: rankModels,
            el: $('#rank-container'),
            rankTemplate: $('#template-rl')
        });
    };
    
    // go go go
    initCategoryView();
    initResultListView();
}());