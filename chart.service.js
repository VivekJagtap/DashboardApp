angular.module('dashboardApp').service('chartService',chartService);

chartService.$inject=['$window'];

function chartService(){
    var chartsServiceObject = {};

    /**
         * Clear given canvas
         * @param {*} canvasId 
         */
        chartsServiceObject.clearCanvas = function(canvasId){
            var canvasDiv = $('#'+canvasId).parent();
            canvasDiv.remove();
            canvasDiv.append("<canvas id='"+canvasId+"'><canvas>");
            var c = document.getElementById(canvasId);
            var ctx = c.getContext("2d");
            ctx.canvas.width = $('#graph').width(); // resize to parent width
            ctx.canvas.height = $('#graph').height(); // resize to parent height
            return ctx;
        }

        chartsServiceObject.getRandomColor = function() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        chartsServiceObject.renderHistogram = function(filteredOffers){
            //var ctx = chartsServiceObject.clearCanvas('histogram');
            
            $('#histogram').remove();
            $('#hist').append("<canvas id='histogram'><canvas>");
            var c = document.getElementById('histogram');
            var ctx = c.getContext("2d");
            ctx.canvas.width = $('#graph').width(); // resize to parent width
            ctx.canvas.height = $('#graph').height();
            
            var labelArr = [],dataArr=[],colorArr=[];
            for(let i=0;i<filteredOffers.length;i++){
                labelArr.push(filteredOffers[i].timestamp);
                dataArr.push(filteredOffers[i].dis);
            }

            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labelArr,
                    datasets: [{
                        label: 'Distance',
                        data: dataArr,
                        backgroundColor: 'teal',
                        borderColor: 'black',
                        borderWidth: 1
                    }]
                },options: {
                    responsive: true,
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Histogram of distances'
                    },
                    scales: {
                        xAxes: [{
                          display: true,
                          scaleLabel: {
                            display: true,
                            labelString: 'Timestamp'
                          }
                        }],
                        yAxes: [{
                          display: true,
                          scaleLabel: {
                            display: true,
                            labelString: 'Distance',
                            beginAtZero:true
                          }
                        }]
                      }
                    }
            });
        }

            chartsServiceObject.renderlinegraph = function(filteredOffers){
                $('#linegraph').remove();
                $('#line').append("<canvas id='linegraph'><canvas>");
                var c = document.getElementById('linegraph');
                var ctx = c.getContext("2d");
                ctx.canvas.width = $('#graph').width(); // resize to parent width
                ctx.canvas.height = $('#graph').height();

                var labelArr = [],dataArr=[],colorArr=[];

                for(let i=0;i<filteredOffers.length;i++){
                    labelArr.push(filteredOffers[i].timestamp);
                    dataArr.push(filteredOffers[i].dis);
                }
                
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labelArr,
                        datasets: [{
                            label: 'Distance',
                            data: dataArr,
                            backgroundColor: 'limegreen',
                            borderColor: 'limegreen',
                            borderWidth: 3,
                            fill:false
                        }]
                    },
                    options: {
                        responsive: true,
                        legend:{
                            position:'top'
                        },
                        title: {
                          display: true,
                          text: 'Line Chart of Distance'
                        },
                        tooltips: {
                          mode: 'index',
                          intersect: false,
                        },
                        hover: {
                          mode: 'nearest',
                          intersect: true
                        },
                        elements: {
                            point: {
                                pointStyle: 'rect'
                            }
                        },
                        scales: {
                            xAxes: [{
                              display: true,
                              scaleLabel: {
                                display: true,
                                labelString: 'Timestamp'
                              }
                            }],
                            yAxes: [{
                              display: true,
                              scaleLabel: {
                                display: true,
                                labelString: 'Distance',
                                beginAtZero:true
                              }
                            }]
                          }
                    }
                });
            }

            chartsServiceObject.renderpiegraph = function(classifiedMerchants,c_id){
                    //chartsServiceObject.clearCanvas(c_id);
                    
                    var ctx = document.getElementById(c_id).getContext('2d');
                    var labelArr = [],dataArr=[],colorArr=[];
                    for(let i=0;i<classifiedMerchants.length;i++){
                        labelArr.push(classifiedMerchants[i].label);
                        dataArr.push(classifiedMerchants[i].count);
                        colorArr.push(chartsServiceObject.getRandomColor());
                    }
                    var credentials = {
                        type: 'pie',
                        data: {
                            'labels': labelArr,
                            'datasets': [{
                                label: '# of distance',
                                data: dataArr,
                                backgroundColor: colorArr,
                                borderColor: 'white',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                                legend: {
                                    display: false
                                },
                                title: {
                                    display: true,
                                    text: 'Offers count'
                                },
                                animation: {
                                    animateScale: true,
                                    animateRotate: true
                                }
                        }
                    }
                        
                    var myChart = new Chart(ctx,credentials);
                }
        return chartsServiceObject;
}