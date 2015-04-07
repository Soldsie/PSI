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
        var rankModel = new window.psi.model.Rank();
        rankModel.fetch({
            success: function(model) {
                var rankView = new window.psi.view.RankView({
                    model: model,
                    el: $('#rank-container'),
                    rankTemplate: $('#template-rl')
                });
            },
            error: function(model, response, options) {
                console.log('Error fetching model: ' + JSON.stringify(response, null, 4));
            }
        });        
    };

    // go go go
    initCategoryView();
    initResultListView();
}());