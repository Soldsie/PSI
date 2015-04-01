(function() {
    var initCategoryView = function() {
        var productCategories = ['Dress', 'Handbag', 'Watch', 'Smart Watch'];
        var category = new window.psi.model.Category();
        var categoryView = new window.psi.view.CategoryView({
            model: category,
            el: $('#prod-cats'),
            categoryNames: productCategories,
            template: $('#template-cat')
        });
    };
    
    var initChartView = function() {

    };
    
    // go go go
    initCategoryView();
}());