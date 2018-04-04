angular.module('dashboardApp').controller('dashboardController',dashboardController).filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to input
        if(input)
            return input.slice(start);
        else
            return;    
    }
});

dashboardController.$inject=['$scope','$http','$window','chartService'];

function dashboardController($scope,$http,$window,chartService){
    $scope.title = "Dashboard";
    $window.locations = [];
    $scope.type="pie";
    $scope.location = 0;
    $scope.t = true;

    $scope.setType = function(t){
        $scope.type=t;
    };
    $scope.currentPage = 0;
    $scope.currentdPage = 0;
    $scope.pageSize = 5;


    /**
     * Render Google Map.
     */
    $window.myMap = function() {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            center: new google.maps.LatLng(18.568423977139, 73.9084966388288),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    
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
            $scope.selectedMarchant = '#';
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
            $scope.selectedDevice = '#';
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
    $scope.getOffer = function(){  
        $scope.offer = [];
        $http({method:'GET',url:'http://35.168.89.251:5000//get_all_offers/'+$scope.selectedDevice,body:null}).then(function(success){
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
        $scope.location = device.count;
        $http({method:'GET',url:'http://35.168.89.251:5000//get_device_loc/'+device.device_id,body:null}).then(function(success){
            $window.locations = success.data.result;
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
        
        $scope.t = false;
        $scope.longestDistance = 0;
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
                $scope.t = true;
            }
            else{
                $scope.offerTitle = 'Offers sent by '+$scope.selectedMarchant+' to device -'+$scope.selectedDevice+' are :';
                if($scope.offers[i].merchant == $scope.selectedMarchant && $scope.offers[i].device_id == $scope.selectedDevice)
                    $scope.filteredOffers.push($scope.offers[i]);
            }
        }
        
        if(!$scope.t){
            //Render Histogram
            chartService.renderHistogram($scope.filteredOffers);
            //Render LineGraph
            chartService.renderlinegraph($scope.filteredOffers);       
        }
        else{
            chartService.clearCanvas('histogram');
            chartService.clearCanvas('linegraph');
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
            var obj = {label:$scope.merchants[i].merchant , count:dummyMerchantOffers}
            $scope.classifiedMerchants.push(obj);
            if($scope.mostOffers.sentOffers<dummyMerchantOffers){
                $scope.mostOffers.sentOffers = dummyMerchantOffers;
                $scope.mostOffers.merchant = $scope.merchants[i].merchant;
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

                var obj = {label:$scope.devices[i].device_id , count:dummyDeviceOffers};
                $scope.classifiedDevices.push(obj);
                if($scope.mostOffers.receivedOffers<dummyDeviceOffers){
                    $scope.mostOffers.receivedOffers = dummyDeviceOffers;
                    $scope.mostOffers.device = $scope.devices[i].device_id;
                }
                
            }   
            chartService.renderpiegraph($scope.classifiedMerchants,'pie1');  
            chartService.renderpiegraph($scope.classifiedDevices,'pie2');  
    };
}