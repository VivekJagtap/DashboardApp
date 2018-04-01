
angular.module('dashboardApp').service('canvasService',canvasService);

canvasService.$inject=['$window'];

function canvasService($window){
  var canvasServiceObject = {
      originX:0,
      originY:0,
      maxX:0,
      maxY:0
  };

        /**
         * 
         * @param {*} canvasId 
         * @param {*} height 
         * @param {*} width 
         */
        canvasServiceObject.changeCanvasSize = function(canvasId,height,width){
            var c = document.getElementById(canvasId);
            var context = c.getContext("2d");

            if(height){    
                c.height = height;
                canvasServiceObject.maxY = height;
            }

            if(width){
                c.width = width;
                canvasServiceObject.maxX = width;
            }
        }

        canvasServiceObject.setMaxValues = function(){

        }

        /**
         * Clear given canvas
         * @param {*} canvasId 
         */
        canvasServiceObject.clearCanvas = function(canvasId){
            var c = document.getElementById(canvasId);
            var context = c.getContext("2d");
            context.clearRect(0, 0, c.width, c.height);
        }

        /**
         * calculate Y co-ordinate from given value and scale
         * @param {*} value 
         * @param {*} scale 
         */
        canvasServiceObject.calculateYCoOrdinate = function(value,scale){
            alert(canvasServiceObject.maxY);
            var Y = (value*scale)/canvasServiceObject.maxY;
            Y = canvasServiceObject.maxY-Y;
            return Y;
        }


        /**
         * createline from given credentials
         * @param {*} credentials 
         */
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


        /**
         * Create arc from given credentials
         * @param {*} credentials 
         */
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


        /**
         * create text Object
         * @param {*} credentials 
         */
        canvasServiceObject.createText = function(credentials){
        var c = document.getElementById(credentials.elementId);
        var context = c.getContext("2d");
            context.beginPath();
            context.font = credentials.fontSize+"px Verdana";
            context.fillText(canvasServiceObject.createAbbr(credentials.text),credentials.startX,credentials.startY);
            context.fillStyle = credentials.color;
        }


        /**
         * Abbreviate text
         * @param {*} text 
         */
        canvasServiceObject.createAbbr = function(text){
            var textarray = text.split(" ");
            var textarray1 = text.split("-");
            var Abbr = '';
            if(textarray.length>1){
                for(let i=0;i<textarray.length;i++)
                Abbr+=textarray[i].slice(0, 1);
            }
            else if(textarray1.length>1){
                for(let i=0;i<textarray1.length;i++)
                Abbr+=textarray1[i].slice(0, 1);
            }
            else{
                Abbr = text; 
            }
            return Abbr;
        }


        /**
         * create X and Y axis
         * @param {*} minValue 
         * @param {*} maxValue 
         * @param {*} axis 
         * @param {*} canvasId 
         * @param {*} padding 
         */
        canvasServiceObject.createAxis = function(minValue,maxValue,canvasId,padding){
            var c = document.getElementById(canvasId);
            var canvasHeight = c.height;
            var canvasWidth = c.width;
            
                var credentials = {
                    elementId:canvasId,
                    startX:0+padding,
                    startY:0,
                    endX:0+padding,
                    endY:canvasHeight,
                    color:'black',
                    stroke:true,
                    lineWidth:1
                }
                canvasServiceObject.createLine(credentials);
            
                credentials = {
                    elementId:canvasId,
                    startX:0,
                    startY:padding,//canvasHeight-padding,
                    endX:canvasWidth,
                    endY:padding,//canvasHeight-padding,
                    color:'black',
                    stroke:true,
                    lineWidth:1
                }
                canvasServiceObject.createLine(credentials);
                
                credentials = {
                    elementId:canvasId,
                    startX:padding-15,
                    startY:padding-15,//canvasHeight-padding+15,
                    text:'0',
                    color:'darkred',
                    fontSize:14
                }
                canvasServiceObject.createText(credentials);

                canvasServiceObject.originX = padding;
                canvasServiceObject.originY = canvasHeight-padding;
                canvasServiceObject.maxX = canvasWidth-padding;
                canvasServiceObject.maxY = canvasHeight-padding;
        }


         /**
          * Render Histogram from given data
          * @param {*} filteredOffers 
          */
        canvasServiceObject.renderHistogram = function(filteredOffers){
        
            canvasServiceObject.clearCanvas('histogram');
                
            if(filteredOffers.length>9){
                canvasServiceObject.changeCanvasSize('histogram',100+(filteredOffers.length*30),null)
            }
            else{
                canvasServiceObject.changeCanvasSize('histogram',300,null)
            }

            var credentials = {
                elementId:'histogram',
                startX:100,
                startY:10,
                endX:100,
                endY:canvasServiceObject.maxY,
                color:'black',
                stroke:true,
                lineWidth:1
            }
            canvasServiceObject.createLine(credentials);

            var credentials1 = {
                elementId:'histogram',
                startX:10,
                startY:10,
                text:'Merchants',
                color:'black',
                fontSize:14
            }
            canvasServiceObject.createText(credentials1);

            var credentials2 = {
                elementId:'histogram',
                startX:305,
                startY:10,
                text:'Distance',
                color:'black',
                fontSize:14
            }
            canvasServiceObject.createText(credentials2);

            for(var i=0,y=30;i<filteredOffers.length;i++){
                var credentials = {
                    elementId:'histogram',
                    startX:105,
                    startY:y,
                    endX:105+parseInt(Math.round(filteredOffers[i].dis)),
                    endY:y,
                    color:'teal',
                    stroke:true,
                    lineWidth:20
                }
                canvasServiceObject.createLine(credentials);

                var credentials2 = {
                    elementId:'histogram',
                    startX:parseInt(filteredOffers[i].dis)+115,
                    startY:y,
                    text:''+Math.round(filteredOffers[i].dis),
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
         * Render Line graph
         * @param {*} filteredOffers 
         */
        canvasServiceObject.renderLineGraph = function(filteredOffers){
            canvasServiceObject.clearCanvas('linegraph');
            
            if(filteredOffers.length>15){
                canvasServiceObject.changeCanvasSize('linegraph',null,100+filteredOffers.length*30);
            }
            else{
                canvasServiceObject.changeCanvasSize('linegraph',null,600);
            }

            canvasServiceObject.createAxis(0,300,'linegraph',50);
            
            var lineStart = {x:50,y:50};
            var linesEnd = {x:50,y:50}
            for(var i=0,x=80,y=10;i<filteredOffers.length;i++){
                linesEnd.x=x;
                linesEnd.y=parseInt(filteredOffers[i].dis)/2+70;
                var credentials = {
                    elementId:'linegraph',
                    startX:lineStart.x,
                    startY:lineStart.y,
                    endX:linesEnd.x,
                    endY:linesEnd.y,
                    color:'red',
                    stroke:true,
                    lineWidth:2
                }
                canvasServiceObject.createLine(credentials);
                lineStart.x = linesEnd.x;
                lineStart.y = linesEnd.y;

                var credentials = {
                    elementId:'linegraph',
                    centerX:linesEnd.x,
                    centerY:linesEnd.y,
                    radius:5,
                    startAngle:0,
                    endAngle:2*Math.PI,
                    stroke:true,
                    color:'teal'
                }

                canvasServiceObject.createCircle(credentials);

                credentials = {
                    elementId:'linegraph',
                    centerX:linesEnd.x,
                    centerY:linesEnd.y,
                    radius:3,
                    startAngle:0,
                    endAngle:2*Math.PI,
                    stroke:false,
                    color:'teal'
                }
                canvasServiceObject.createCircle(credentials);
                
                credentials = {
                    elementId:'linegraph',
                    startX:linesEnd.x,
                    startY:linesEnd.y-10,
                    text:''+Math.round(filteredOffers[i].dis),
                    color:'darkgreen',
                    fontSize:10
                }
                canvasServiceObject.createText(credentials);

                credentials = {
                    elementId:'linegraph',  
                    startX:linesEnd.x,
                    startY:linesEnd.y-20,
                    text:''+filteredOffers[i].merchant,
                    color:'darkgreen',
                    fontSize:10
                }
                canvasServiceObject.createText(credentials);
                x+=30;
            }
        }


        /**
         * Create Pie chart
         * @param {*} data 
         */
        canvasServiceObject.renderPieChart = function(data){
            
            canvasServiceObject.createAxis(0,300,'x','pie',50);
            
        }

        return canvasServiceObject;
}