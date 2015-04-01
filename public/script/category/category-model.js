window.psi = window.psi || {};
window.psi.model = window.psi.models || {};

window.psi.model.Category = Backbone.Model.extend({
    defaults: {
        name: ''
    }
});