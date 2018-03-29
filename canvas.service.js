
angular.module('dashboardApp').service('canvasService',canvasService);

canvasService.$inject=[];

function canvasService(){
  var canvasServiceObject = {};

        canvasServiceObject.clearCanvas = function(canvasId){
            var c = document.getElementById(canvasId);
            var context = c.getContext("2d");
            context.clearRect(0, 0, c.width, c.height);
        }

        canvasServiceObject.createLine = function(credentials){
        var c = document.getElementById(credentials.elementId);
        var context = c.getContext("2d");

            context.beginPath();
            context.moveTo(credentials.startX,credentials.startY);
            context.lineTo(credentials.endX,credentials.endY);
            context.lineWidth = credentials.lineWidth;
            // set line color
            context.strokeStyle = credentials.linecolor;
            if(credentials.stroke)
                context.stroke();
            else    
                context.fill();
        }

        canvasServiceObject.createCircle = function(credentials){
            var c = document.getElementById(credentials.elementId);
            var context = c.getContext("2d");
            
            context.beginPath();
            context.arc(credentials.centerX,credentials.centerY,credentials.radius,credentials.startAngle*Math.PI,credentials.endAngle*Math.PI);
            if(credentials.stroke)
                context.stroke();
            else{
                context.fillStyle = credentials.color;
                context.fill();
            }    
        }

        canvasServiceObject.createText = function(credentials){
        var c = document.getElementById(credentials.elementId);
        var context = c.getContext("2d");
            context.beginPath();
            context.font = credentials.fontSize+"px Verdana";
            context.fillText(credentials.text,credentials.startX,credentials.startY);
            context.fillStyle = credentials.color;
        }

         /**
         * Render Histogram
         */
        canvasServiceObject.renderHistogram = function(filteredOffers){
            canvasServiceObject.clearCanvas('histogram');

            var credentials = {
                elementId:'histogram',
                startX:200,
                startY:10,
                endX:200,
                endY:200,
                color:'black',
                stroke:true,
                lineWidth:5
            }
            canvasServiceObject.createLine(credentials);

            var credentials1 = {
                elementId:'histogram',
                startX:10,
                startY:190,
                text:'Merchants',
                color:'red',
                fontSize:14
            }
            canvasServiceObject.createText(credentials1);

            var credentials2 = {
                elementId:'histogram',
                startX:305,
                startY:190,
                text:'Dis',
                color:'red',
                fontSize:14
            }
            canvasServiceObject.createText(credentials2);

            for(var i=0,y=30;i<filteredOffers.length;i++){
                var credentials = {
                    elementId:'histogram',
                    startX:205,
                    startY:y,
                    endX:100+parseInt(filteredOffers[i].dis),
                    endY:y,
                    color:'slategrey',
                    stroke:true,
                    lineWidth:20
                }
                canvasServiceObject.createLine(credentials);

                var credentials2 = {
                    elementId:'histogram',
                    startX:parseInt(filteredOffers[i].dis)+110,
                    startY:y,
                    text:''+filteredOffers[i].dis,
                    color:'blue',
                    fontSize:10
                }
                canvasServiceObject.createText(credentials2);

            var credentials3 = {
                    elementId:'histogram',
                    startX:5,
                    startY:y,
                    text:''+filteredOffers[i].merchant,
                    color:'blue',
                    fontSize:10
                }
                canvasServiceObject.createText(credentials3);
                
                y+=30;
            }
        }

        /**
         * Render line graph.
         */
        canvasServiceObject.renderLineGraph = function(filteredOffers){
            canvasServiceObject.clearCanvas('linegraph');

            var credentials = {
                elementId:'linegraph',
                startX:30,
                startY:30,
                endX:600,
                endY:30,
                color:'black',
                stroke:true,
                lineWidth:4
            }
            canvasServiceObject.createLine(credentials);
    
            var credentials2 = {
                elementId:'linegraph',
                startX:15,
                startY:15,
                text:'line graph by Dis field',
                color:'darkgreen',
                fontSize:10
            }
            canvasServiceObject.createText(credentials2);

            credentials2 = {
                elementId:'linegraph',
                startX:10,
                startY:30,
                text:'0',
                color:'darkgreen',
                fontSize:10
            }
            canvasServiceObject.createText(credentials2);
            
            for(var i=0,x=50,y=10;i<filteredOffers.length;i++){
                var credentials = {
                    elementId:'linegraph',
                    centerX:x,
                    centerY:parseInt(filteredOffers[i].dis)-50,
                    radius:5,
                    startAngle:0,
                    endAngle:2*Math.PI,
                    stroke:true,
                    color:'darkpink'
                }

                canvasServiceObject.createCircle(credentials);

                credentials = {
                    elementId:'linegraph',
                    centerX:x,
                    centerY:parseInt(filteredOffers[i].dis)-50,
                    radius:3,
                    startAngle:0,
                    endAngle:2*Math.PI,
                    stroke:false,
                    color:'pink'
                }

                canvasServiceObject.createCircle(credentials);
                
                credentials = {
                    elementId:'linegraph',
                    startX:x-30,
                    startY:parseInt(filteredOffers[i].dis)-30,
                    text:''+filteredOffers[i].dis,
                    color:'darkgreen',
                    fontSize:10
                }
                canvasServiceObject.createText(credentials);

                credentials = {
                    elementId:'linegraph',
                    startX:x-30,
                    startY:parseInt(filteredOffers[i].dis)-65,
                    text:''+filteredOffers[i].merchant,
                    color:'darkgreen',
                    fontSize:10
                }
                canvasServiceObject.createText(credentials);
                x+=50;
            }
        }
        return canvasServiceObject;
}