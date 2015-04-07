window.psi = window.psi || {};
window.psi.view = window.psi.view || {};

window.psi.view.GraphView = Backbone.Epoxy.View.extend({
    events: {
    },

    initialize: function(options) {
        this.model = options.model;
        this.el = options.el;        

        var data = this.model.get('data');
        var media = data.mediaCumulative
        var comments = data.commentCumulative;
        var tweets = data.tweetCumulative;

        for(var i=0; i<media.length; i++) {
            var date = new Date(media[i][0]);
            media[i][0] = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
        }

        for(var i=0; i<comments.length; i++) {
            var date = new Date(comments[i][0]);
            comments[i][0] = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
        }

        for(var i=0; i<tweets.length; i++) {
            var date = new Date(tweets[i][0]);
            tweets[i][0] = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
        }

        $(function () {
            $('#graph-container').highcharts({
                chart: {
                    type: 'spline',
                    zoomType: 'x',
                },
                title: {
                    text: 'PSI Index'
                },
                // subtitle: {
                //     text: 'Irregular time data in Highcharts JS'
                // },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: { // don't display the dummy year
                        month: '%e. %b',
                        year: '%b'
                    },
                    title: {
                        text: 'Date'
                    }
                },
                yAxis: {
                    title: {
                        text: 'PSI'
                    },
                    min: 0
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x:%e. %b}: {point.y:.2f}'
                },

                plotOptions: {
                    spline: {
                        marker: {
                            enabled: true
                        }
                    }
                },

                series: [{
                    name: 'Instagram Posts',
                    data: media
                }, {
                    name: 'Instagram Comments',
                    data: comments
                }, {
                    name: 'Tweets',
                    data: tweets

                }]
            });
        });



    },

    render: function() {
        // this.$el.find('#cat-container').html(rendered);
    }
});