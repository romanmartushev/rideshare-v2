var app = new Vue({
    el: '#page-wrapper',
    data: {
        message: '',
        user: JSON.parse(localStorage.getItem('rideshare.user')),
        requests: [],
        lat: 0,
        long: 0,
        errors: [],
        map: '',
        marker: '',
        pos: {},
        directionsService: '',
        directionsDisplay: '',
        mapHeight: {
            height: '70vh',
        },
        directionsHeight : {
            height: '0',
            width: '100%',
        },
        myRequests: [],
    },
    methods: {
        getRequests: function () {
            var vm = this;
            axios.get('https://rideshareapi.herokuapp.com/api/serviceable-requests')
                .then(function(response){
                    vm.requests = response.data;
                    vm.getMyRequests();
                })
                .catch(function (error) {

                })
        },
        getMyRequests: function() {
            this.myRequests = [];
            var vm = this;
            this.requests.forEach(function(request){
                if(request.driver_id === vm.user.id){
                    vm.myRequests.push(request);
                }
            });
        },
        getLocation: function() {
            // Checks to see if we are able to get the location of the driver
            if (navigator.geolocation) {
                this.initMap(); // if we can get the current location of the driver initialize the map
            }
            else {
                // if we cant log/tell the user we are unable to get the current location
                console.log('unable to fetch location')
            }
        },
        initMap: function() {
            var vm = this;
            navigator.geolocation.getCurrentPosition(function (position) {
                // Get the coordinates of the current position.
                vm.lat = position.coords.latitude;
                vm.long = position.coords.longitude;
                //Get Location
                vm.pos = {lat: vm.lat, lng: vm.long};
                // The map, centered at pos
                vm.directionsService = new google.maps.DirectionsService();
                vm.directionsDisplay = new google.maps.DirectionsRenderer();

                vm.map = new google.maps.Map(document.getElementById('map'), {zoom: 20, center: vm.pos});
                vm.directionsDisplay.setMap(vm.map);
                vm.directionsDisplay.setPanel(document.getElementById('directionsPanel'));
                vm.marker = new google.maps.Marker({position: vm.pos, map: vm.map});
            });
        },
        getDirections: function(destination_address){
            this.mapHeight.height = '40vh';
            this.directionsHeight.height = '30vh';
            $('#pills-tab a[href="#pills-home"]').tab('show');
            var vm = this;
            this.marker.setMap(null);
            var request = {
                origin: new google.maps.LatLng(vm.lat, vm.long),
                destination: destination_address,
                travelMode: 'DRIVING'
            };
            this.directionsService.route(request, function(result, status) {
                if (status == 'OK') {
                    vm.directionsDisplay.setDirections(result);
                    setTimeout(() => {
                        vm.directionsDisplay.map.setZoom(15);
                        vm.directionsDisplay.map.setCenter(vm.pos);
                    },100);
                }
            });
        },
        updateMap: function(){
            if (navigator.geolocation) {
                var vm = this;
                navigator.geolocation.getCurrentPosition(function (position) {
                    vm.lat = position.coords.latitude;
                    vm.long = position.coords.longitude;
                    vm.pos = {lat: vm.lat, lng: vm.long};
                });
                this.map.setCenter(this.pos);
            }
        },
        finishedRequest: function(request_id){
            var vm = this;
            axios.get('https://rideshareapi.herokuapp.com/api/finished-request?request_id='+request_id+'&driver_id='+vm.user.id)
                .then(function(response){
                    if(response.data.hasOwnProperty('client_id')){
                        vm.getRequests();
                        vm.message = 'request marked as finished'
                    }
                })
                .catch(function (error) {
                    vm.message = 'there was an issue removing the request'
                });
            setTimeout(function(){
                vm.message = '';
            },5000);
        },
        acceptRequest: function(request_id){
            var vm = this;
            axios.get('https://rideshareapi.herokuapp.com/api/accept-request?request_id='+request_id+'&driver_id='+vm.user.id)
                .then(function(response){
                    vm.getRequests();
                })
                .catch(function (error) {

                });
        }
    },
    mounted: function () {
        this.user = JSON.parse(localStorage.getItem('rideshare.user'));
        if(this.user === null || localStorage.getItem('rideshare.role') !== 'driver'){
            location.href = (window.location+'').replace('/driver', '/index');
        }else{
            this.getLocation();
            this.getRequests();
        }
    },
});