window.psi = window.psi || {};
window.psi.model = window.psi.model || {};

window.psi.model.RankItem = Backbone.Model.extend({
    defaults: {
        rank: 0,
        logo: '',
        brandName: '',        
        likes: 0,
        comments: 0,
        tweets: 0,
        retweets: 0
    }
});

window.psi.model.Rank = Backbone.Model.extend({
    defaults: {
        category: '',
        ranking: []
    },

    initialize: function(options) {

    },

    url: '/api/rank/purse'
});