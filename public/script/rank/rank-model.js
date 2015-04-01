window.psi = window.psi || {};
window.psi.model = window.psi.model || {};

window.psi.model.Rank = Backbone.Model.extend({
    defaults: {
        rank: 0,
        logo: '',
        brandName: '',        
        likes: 0,
        comments: 0
    }
});

window.psi.model.RankCollection = Backbone.Collection.extend({
    model: window.psi.model.Rank
});