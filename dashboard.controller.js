angular.module('dashboardApp',[]);

angular.module('dashboardApp').controller('dashboardController',dashboardController);

dashboardController.$inject=['$scope','$http','$window'];

function dashboardController($scope,$http,$window){
    $scope.title = "Dashboard";
    $window.locations = [];

    $scope.getMerchants = function(){
        $http({method:'GET',url:'http://35.168.89.251:5000/get_merchants',body:null}).then(function(success){
            $scope.merchants = success.data.result;
        },function(error){
            console.log("error while getting merchants : "+error.status);
        });
    };

    $scope.getDevices = function(){
        $http({method:'GET',url:'http://35.168.89.251:5000/get_devices',body:null}).then(function(success){
            $scope.devices = success.data.result;
        },function(error){
            console.log("error while getting devices : "+error.status);
        });
    }

    $scope.getOffers = function(){
        $http({method:'GET',url:'http://35.168.89.251:5000//get_all_offers',body:null}).then(function(success){
                $scope.offers = success.data; 
                $scope.filteredOffers = success.data;   
        },function(error){
            console.log("error while getting devices : "+error.status);
        });
    };

    $scope.getOffer = function(device){    
        $http({method:'GET',url:'http://35.168.89.251:5000//get_all_offers/'+device.device_id,body:null}).then(function(success){
                $scope.offer = success.data.result;
        },function(error){
            console.log("error while getting devices : "+error.status);
        });
    };

    $scope.filterOffers = function(){
        var t = false;
        $scope.filteredOffers = [];
        for(var i=0;i<$scope.offers.length;i++){
            if($scope.selectedMarchant && !$scope.selectedDevice){
                if($scope.offers[i].merchant == $scope.selectedMarchant)
                $scope.filteredOffers.push($scope.offers[i]);
            }
            else if(!$scope.selectedMarchant && $scope.selectedDevice){
                if($scope.offers[i].device_id == $scope.selectedDevice)
                     $scope.filteredOffers.push($scope.offers[i]);
            }
            else if(!$scope.selectedMarchant && !$scope.selectedDevice){
                $scope.filteredOffers.push($scope.offers[i]);
                t = true;
            }
            else{
                if($scope.offers[i].merchant == $scope.selectedMarchant && $scope.offers[i].device_id == $scope.selectedDevice)
                    $scope.filteredOffers.push($scope.offers[i]);
            }
        }
        
        if(!t){
            //Render Histogram
            $scope.renderHistogram();
            //Render LineGraph
            $scope.renderLineGraph();
        }
        
    }

    $scope.getDeviceLocation = function(device){
        $http({method:'GET',url:'http://35.168.89.251:5000//get_device_loc/'+device.device_id,body:null}).then(function(success){
            $scope.location = success.data.result;
            $window.locations = $scope.location;
            //After selecting device render it on MAP 
            $window.myMap(); 
        },function(error){
            console.log("error while getting devices : "+error.status);
        });   
    }

    $scope.getOffers();
    $scope.getMerchants();
    $scope.getDevices();

    /**
     * Render Google Map.
     */
    $window.myMap = function() {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 20,
            center: new google.maps.LatLng(18.568423977139, 73.9084966388288),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    
        //var ms = [{"created_timestamp":1521552964,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.568423977139,"longitude":73.9084966388288,"timestamp":1521552962},{"created_timestamp":1521552845,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.5684024775574,"longitude":73.9084547293129,"timestamp":1521552844},{"created_timestamp":1521552844,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.5684024775574,"longitude":73.9084547293129,"timestamp":1521552843},{"created_timestamp":1521552835,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.5684053340468,"longitude":73.908455904444,"timestamp":1521552834},{"created_timestamp":1521551476,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.5683970293203,"longitude":73.9085910190585,"timestamp":1521551476},{"created_timestamp":1521551475,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.5683581372896,"longitude":73.9086570684555,"timestamp":1521551475},{"created_timestamp":1521551474,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.5683506773958,"longitude":73.9086509496662,"timestamp":1521551474},{"created_timestamp":1521551473,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.5683785053143,"longitude":73.9085783623847,"timestamp":1521551473},{"created_timestamp":1521551473,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.5683042835617,"longitude":73.9087656979206,"timestamp":1521551471},{"created_timestamp":1521551470,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.5683560418138,"longitude":73.9088045899513,"timestamp":1521551470},{"created_timestamp":1521551468,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.5684087220752,"longitude":73.9085053560081,"timestamp":1521551468},{"created_timestamp":1521551467,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.568405571992,"longitude":73.9084560132771,"timestamp":1521551466},{"created_timestamp":1521551466,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.5685604345226,"longitude":73.9085890912208,"timestamp":1521551465},{"created_timestamp":1521551415,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.5685669304976,"longitude":73.9086033404562,"timestamp":1521551414},{"created_timestamp":1521551384,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.5685351630846,"longitude":73.9086449985149,"timestamp":1521551384},{"created_timestamp":1521551383,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.568553477543,"longitude":73.9086007420662,"timestamp":1521551383},{"created_timestamp":1521551382,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.5686017153958,"longitude":73.9085442480388,"timestamp":1521551381},{"created_timestamp":1521551379,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.5685726721013,"longitude":73.9085821342411,"timestamp":1521551379},{"created_timestamp":1521551376,"device_id":"259EF863-28F6-4AD0-B5F4-8B521D19E1C3","lat":18.5685189441019,"longitude":73.9085913543346,"timestamp":1521551374}]
        var marker, i;
    
        for (i = 0; i < $window.locations.length; i++) {  
            marker = new google.maps.Marker({
            position: new google.maps.LatLng($window.locations[i].lat, $window.locations[i].longitude),
            map: map,
            title:''+$window.locations[i].timestamp
            });
            marker.setMap(map);
        }
    }

    /**
     * Render Histogram
     */
    $scope.renderHistogram = function(){
        var c = document.getElementById("histogram");
        var ctx = c.getContext("2d");
        var context = c.getContext("2d");
        context.clearRect(0, 0, c.width, c.height);
        context.beginPath();
        context.moveTo(200,10);
        context.lineTo(200, 200);
        context.lineWidth = 5;
        // set line color
        context.strokeStyle = 'black';
        context.stroke();

        context.font = "14px Verdana";
        context.fillText('Merchants',10, 190);

        context.font = "14px Verdana";
        context.fillText('Dis', 305, 190);

        for(var i=0,y=30;i<$scope.filteredOffers.length;i++){
            ctx.beginPath();
            ctx.moveTo(205, y);
            ctx.lineWidth = 20;
            ctx.lineTo(100+parseInt($scope.filteredOffers[i].dis), y);
            ctx.strokeStyle = 'slategrey';
            ctx.stroke();
            
            ctx.font = "12px Verdana";
            ctx.fillText(''+$scope.filteredOffers[i].dis,parseInt($scope.filteredOffers[i].dis)+110, y);
            ctx.fillStyle = "darkgreen";
            
            ctx.font = "12px Verdana";
            ctx.fillText(''+$scope.filteredOffers[i].merchant, 5, y);

            y+=30;
        }
    }

    /**
     * Render line graph.
     */
    $scope.renderLineGraph = function(){

        var c = document.getElementById("linegraph");
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.beginPath();
        ctx.moveTo(30, 30);
        ctx.lineTo(600, 30);
        ctx.stroke();

        ctx.font = "12px Verdana";
        ctx.fillText('line graph by Dis field',15,15);
        ctx.fillStyle = "darkgreen";
        
        
        ctx.font = "12px Verdana";
        ctx.fillText('0.0',10,30);
        ctx.fillStyle = "darkgreen";
        
        for(var i=0,x=50,y=10;i<$scope.filteredOffers.length;i++){
            ctx.beginPath();
            ctx.arc(x,parseInt($scope.filteredOffers[i].dis)-50,5,0,2*Math.PI);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(x,parseInt($scope.filteredOffers[i].dis)-50,3,0,2*Math.PI);
            ctx.stroke();
            ctx.fill();


            ctx.font = "10px Verdana";
            ctx.fillText(''+$scope.filteredOffers[i].dis,x-30,parseInt($scope.filteredOffers[i].dis)-30);
            ctx.fillStyle = "darkgreen";

            ctx.font = "10px Verdana";
            ctx.fillText(''+$scope.filteredOffers[i].merchant,x-30,parseInt($scope.filteredOffers[i].dis)-65);
            ctx.fillStyle = "blue";

            x+=50;
        }
    }

}