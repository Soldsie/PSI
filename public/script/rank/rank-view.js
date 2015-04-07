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
        var _self = this;

        // Clear it
        $('#graph-container').html('<div class="ajax-loader"><div class="loader"></div></div>');

        $('#graph-modal').modal('toggle');
        var tag = _self.model.get('brandName').replace(/ /, '') + 'purse';
        _self.graph = new window.psi.model.Graph({tag: tag.toLowerCase()});
        _self.graph.fetch({
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
        });
    }
});

window.psi.view.RankView = Backbone.Epoxy.View.extend({
    events: {
        'click .breakdown-stat.comments': 'orderByComments',
        'click .breakdown-stat.likes': 'orderByLikes',
        'click .breakdown-stat.tweets': 'orderByTweets',
        'click .breakdown-stat.retweets': 'orderByRetweets',
    },

    initialize: function(options) {
        this.model = options.model;
        this.el = options.el;
        this.$rankTemplate = options.rankTemplate;
        this.views = [];
        this.render();
    },

    orderByComments: function() {
        this.orderBy('comments');
    },

    orderByLikes: function() {
        this.orderBy('likes');
    },

    orderByTweets: function() {
        this.orderBy('tweets');
    },

    orderByRetweets: function() {
        this.orderBy('retweets');
    },

    orderBy: function(attribute) {
        console.log(this.views);
        var orderedViews = this.views.sort(function(a, b) {
            return b.model.get(attribute) - a.model.get(attribute);
        });
        this.reRender(orderedViews);
    },

    reRender: function(views) {
        this.$el = this.el;
        for(var i=0; i<views.length; i++) {
            var rankItemView = views[i];
            this.$el.append(rankItemView.render().el);
        }
    },

    render: function() {
        var _self = this;
        _.each(this.model.get('ranking'), function(rankItem) {
            var rankItemView = new window.psi.view.RankItemView({
                model: new window.psi.model.RankItem(rankItem),
                template: _self.$rankTemplate
            });
            _self.views.push(rankItemView);
            _self.$el.append(rankItemView.render().el);
        });
        return this;
    }
});
