window.psi = window.psi || {};
window.psi.view = window.psi.view || {};

window.psi.view.RankItemView = Backbone.Epoxy.View.extend({
    tagName: 'div',
    className: 'brand',
    events: {
        'click .brand-score': 'showGraph'
    },
    initialize: function(options) {
        this.model = options.model;
        this.$template = options.template;
    },

    render: function() {
        var rendered = Mustache.render(this.$template.html(), this.model.toJSON());
        this.$el.html(rendered);
        return this;
    },

    showGraph: function() {
        console.log('show graph called');
        var tag = this.model.get('brandName').replace(/ /, '') + 'purse';
        console.log(tag)
        this.graph = new window.psi.model.Graph({tag: tag.toLowerCase()});
        this.graph.fetch({
            success: function(model) {
                console.log("SUCCESS");
                var graphView = new window.psi.view.GraphView({
                    model: model,
                    el: $('#graph-container')
                });
            },
            error: function(model, response, options) {
                console.log('Error fetching model: ' + JSON.stringify(response, null, 4));
            }
        })
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
