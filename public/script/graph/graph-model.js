window.psi = window.psi || {};
window.psi.model = window.psi.model || {};

window.psi.model.Graph = Backbone.Model.extend({
    defaults: {
      tag: ''
    },
    url: function() {
      return '/api/graph/' + this.get('tag');
    }
});