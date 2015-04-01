window.psi = window.psi || {};
window.psi.view = window.psi.view || {};

window.psi.view.RankView = Backbone.Epoxy.View.extend({
    tagName: 'li',
    className: 'list-group-item',
    initialize: function(options) {
        this.model = options.model;        
        this.$template = options.template;        
    },

    render: function() {
        var rendered = Mustache.render(this.$template.html(), this.model);
        this.$el.html(rendered);
        return this;
    }
});

window.psi.view.RankListView = Backbone.Epoxy.View.extend({
    initialize: function(options) {
        this.collection = options.collection;
        this.el = options.el;
        this.$rankTemplate = options.rankTemplate;
        this.render();        
    },

    render: function() {
        var _self = this;
        _.each(this.collection, function(rankModel) {
            var rankView = new window.psi.view.RankView({
                model: rankModel,
                template: _self.$rankTemplate
            });
            _self.$el.append(rankView.render().el);
        });
        return this;
    }
});