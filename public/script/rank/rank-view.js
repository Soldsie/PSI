window.psi = window.psi || {};
window.psi.view = window.psi.view || {};

window.psi.view.RankItemView = Backbone.Epoxy.View.extend({
    tagName: 'li',
    className: 'list-group-item',
    initialize: function(options) {
        this.model = options.model;        
        this.$template = options.template;        
    },

    render: function() {        
        var rendered = Mustache.render(this.$template.html(), this.model.toJSON());
        this.$el.html(rendered);
        return this;
    }
});

window.psi.view.RankView = Backbone.Epoxy.View.extend({
    initialize: function(options) {
        this.model = options.model;
        this.el = options.el;
        this.$rankTemplate = options.rankTemplate;
        this.render();        
    },

    render: function() {
        var _self = this;
        _.each(this.model.get('ranking'), function(rankItem) {
            var rankItemView = new window.psi.view.RankItemView({
                model: new window.psi.model.RankItem(rankItem),
                template: _self.$rankTemplate
            });
            _self.$el.append(rankItemView.render().el);
        });
        return this;
    }
});