angular.module('dashboardApp').controller('dashboardController',dashboardController).filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to input
        if(input)
            return input.slice(start);
        else
            return;    
    }
});

dashboardController.$inject=['$scope','$http','$window','canvasService'];

function dashboardController($scope,$http,$window,canvasService){
    $scope.title = "Dashboard";
    $window.locations = [];

    $scope.currentPage = 0;
    $scope.currentdPage = 0;
    $scope.pageSize = 5;


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
     * calculate No of pages
     */
    $scope.numberOfmerchantsPages = function(){
        if($scope.classifiedMerchants)
            return Math.ceil($scope.classifiedMerchants.length/$scope.pageSize);	                
    }

    /**
     * calculate No of pages
     */
    $scope.numberOfdevicePages = function(){
        if($scope.classifiedDevices)
            return Math.ceil($scope.classifiedDevices.length/$scope.pageSize);
    }

    /**
     * for table pagination
     * @param {*} val 
     */
    $scope.changePage = function(val,tab){
        if(tab == 'device')
            $scope.currentdPage = $scope.currentdPage+val;
        else    
            $scope.currentPage = $scope.currentPage+val;
    };


    /**
     * Get All merchants
     */
    $scope.getMerchants = function(){
        $http({method:'GET',url:'http://35.168.89.251:5000/get_merchants',body:null}).then(function(success){
            $scope.merchants = success.data.result;
        },function(error){
            console.log("error while getting merchants : "+error.status);
        });
    };


    /**
     * Get all devices 
     */
    $scope.getDevices = function(){
        $http({method:'GET',url:'http://35.168.89.251:5000/get_devices',body:null}).then(function(success){
            $scope.devices = success.data.result;
            $scope.classifyOffers($scope.offers);   
        },function(error){
            console.log("error while getting devices : "+error.status);
        });
    }


    /**
     * Get all offers.
     */
    $scope.getOffers = function(){
        $scope.offerTitle = 'All Offers are :';
        $http({method:'GET',url:'http://35.168.89.251:5000//get_all_offers',body:null}).then(function(success){
                $scope.offers = success.data; 
                $scope.filteredOffers = success.data;
                $scope.getMerchants();
                $scope.getDevices();
        },function(error){
            console.log("error while getting devices : "+error.status);
        });
    };


    /**
     * get offer from device
     * @param {*} device 
     */
    $scope.getOffer = function(device){    
        $http({method:'GET',url:'http://35.168.89.251:5000//get_all_offers/'+device.device_id,body:null}).then(function(success){
                $scope.offer = success.data.result;
        },function(error){
            console.log("error while getting devices : "+error.status);
        });
    };


    /**
     * Get Device location Object from API
     * @param {*} device 
     */
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

    /**
     * filter offers by merchant/device selection
     */
    $scope.filterOffers = function(){
        
        var t = false;
        $scope.longestDistance = 0;

        if($scope.selectedMarchant == '#')
            $scope.selectedMarchant = null;
        
        if($scope.selectedDevice == '#')
            $scope.selectedDevice = null;

        $scope.filteredOffers = [];
        for(var i=0;i<$scope.offers.length;i++){
            if($scope.longestDistance < $scope.offers[i].dis)
                $scope.longestDistance = $scope.offers[i].dis;
            if($scope.selectedMarchant && (!$scope.selectedDevice||$scope.selectedDevice == '#')){
                $scope.offerTitle = 'Offers sent by '+$scope.selectedMarchant+' are :';
                if($scope.offers[i].merchant == $scope.selectedMarchant)
                $scope.filteredOffers.push($scope.offers[i]);
            }
            else if((!$scope.selectedMarchant || $scope.selectedMarchant=='#') && $scope.selectedDevice){
                $scope.offerTitle = 'Offers sent to device-'+$scope.selectedDevice+' are :';
                if($scope.offers[i].device_id == $scope.selectedDevice)
                     $scope.filteredOffers.push($scope.offers[i]);
            }
            else if((!$scope.selectedMarchant||$scope.selectedMarchant == '#') && (!$scope.selectedDevice||$scope.selectedDevice == '#')){
                $scope.offerTitle = 'All Offers are :';
                $scope.filteredOffers.push($scope.offers[i]);
                t = true;
            }
            else{
                $scope.offerTitle = 'Offers sent by '+$scope.selectedMarchant+' to device -'+$scope.selectedDevice+' are :';
                if($scope.offers[i].merchant == $scope.selectedMarchant && $scope.offers[i].device_id == $scope.selectedDevice)
                    $scope.filteredOffers.push($scope.offers[i]);
            }
        }
        
        if(!t){
            //Render Histogram
            canvasService.renderHistogram($scope.filteredOffers);
            //Render LineGraph
            canvasService.renderLineGraph($scope.filteredOffers);
        }
        else{
            canvasService.clearCanvas('histogram');
            canvasService.clearCanvas('linegraph');
            //canvasService.clearCanvas('pie');
        }
    }


    /**
     * Classify offers 
     * @param {*} offers 
     */
    $scope.classifyOffers = function(offers){
        $scope.mostOffers = {merchant:'',sentOffers:0,device:'',receivedOffers:0};

        $scope.classifiedMerchants = [];
            for(var i=0;i<$scope.merchants.length;i++){
            var dummyMerchantOffers = 0;  
                for(var j=0;j<offers.length;j++){
                    if(offers[j].merchant == $scope.merchants[i].merchant){
                        dummyMerchantOffers++;
                    }
                }
            var obj = {merchant:$scope.merchants[i].merchant , offers:dummyMerchantOffers}
            $scope.classifiedMerchants.push(obj);
            if($scope.mostOffers.sentOffers<dummyMerchantOffers){
                $scope.mostOffers.sentOffers = dummyMerchantOffers;
                $scope.mostOffers.device = $scope.merchants[i].merchant;
            }
        } 


        $scope.classifiedDevices = [];
            for(var i=0;i<$scope.devices.length;i++){
            var dummyDeviceOffers = 0;  
                for(var j=0;j<offers.length;j++){
                    if(offers[j].device_id == $scope.devices[i].device_id){
                        dummyDeviceOffers++;
                    }
                }

                var obj = {device:$scope.devices[i].device_id , offers:dummyDeviceOffers};
                $scope.classifiedDevices.push(obj);
                if($scope.mostOffers.receivedOffers<dummyDeviceOffers){
                    $scope.mostOffers.receivedOffers = dummyDeviceOffers;
                    $scope.mostOffers.device = $scope.devices[i].device_id;
                }
                
            }    
    };
}