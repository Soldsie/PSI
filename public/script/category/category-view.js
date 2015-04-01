window.psi = window.psi || {};
window.psi.view = window.psi.view || {};

window.psi.view.CategoryView = Backbone.Epoxy.View.extend({
    events: {
        'click a.nav-link': 'categoryChanged'
    },

    initialize: function(options) {
        this.model = options.model;
        this.el = options.el;        
        // default to use the first category
        this.model.set('name', options.categoryNames[0]);
        this.categories = _.map(options.categoryNames, function(catName) {
            return {
                name: catName,
                navClass: ''
            }
        });
        this.categories[0].navClass = 'active';
        this.$template = options.template;
        this.render();
    },

    categoryChanged: function(e) {
        this.model.set('name', $(e.currentTarget).attr('id').split('-')[1]);
        this.$el.find('.cat-wrapper').removeClass('active')
        $(e.currentTarget).parent().addClass('active');
        console.log('model: ' + this.model.get('name'));
    },

    render: function() {
        var rendered = Mustache.render(
            this.$template.html(), 
            {categories: this.categories}
        );
        this.$el.find('#cat-container').html(rendered);
    }
});