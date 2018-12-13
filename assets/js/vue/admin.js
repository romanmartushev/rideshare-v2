var app = new Vue({
    el: '#page-wrapper',
    data: {
        message: '',
        user: JSON.parse(localStorage.getItem('rideshare.user')),
        requests: [],
        histories: [],
        drivers: [],
        clients: [],
        pick_up_address: '',
        destination_address: '',
        estimated_length: '',
        time: '',
        date: '',
        active_client: {},
        online_drivers: [],
        sign_up_first_name: '',
        sign_up_last_name: '',
        sign_up_phone_number: '',
        sign_up_email: '',
        sign_up_password: '',
        sign_up_password_confirm: '',
    },
    methods: {
        authorizeClient: function(client,auth){
            var vm = this;
            axios.get('https://rideshareapi.herokuapp.com/api/authorize-client?client_id='+client.id+'&authorize='+auth)
                .then(function(response){
                    vm.getClients();
                })
                .catch(function (error) {

                });
        },
        registerDriver: function(){
            var vm = this;
            axios.get('https://rideshareapi.herokuapp.com/api/register-driver?first_name='+vm.sign_up_first_name+'&last_name='+vm.sign_up_last_name+'&email='+vm.sign_up_email+'&phone_number='+vm.sign_up_phone_number+'&password='+vm.sign_up_password+'&confirm_password='+vm.sign_up_password_confirm)
                .then(function(response){
                    if(response.data.hasOwnProperty('success')){
                        vm.message = response.data.success;
                        vm.getDrivers();
                    }else{
                        vm.message = response.data.error
                    }
                })
                .catch(function (error) {

                });
            setTimeout(function(){
                vm.message = '';
            },5000)
        },
        getRequests: function () {
            var vm = this;
            axios.get('https://rideshareapi.herokuapp.com/api/serviceable-requests')
                .then(function(response){
                    vm.requests = response.data;
                })
                .catch(function (error) {

                })
        },
        getHistory: function(){
            var vm = this;
            axios.get('https://rideshareapi.herokuapp.com/api/history')
                .then(function(response){
                    vm.histories = response.data;
                })
                .catch(function (error) {

                })
        },
        getDrivers: function() {
            var vm = this;
            axios.get('https://rideshareapi.herokuapp.com/api/drivers')
                .then(function(response){
                    vm.drivers = response.data;
                    vm.getOnlineDrivers()
                })
                .catch(function (error) {

                })
        },
        getOnlineDrivers: function() {
            var vm = this;
            this.drivers.forEach(function(driver){
                if(parseInt(driver.online) === 1){
                    vm.online_drivers.push(driver);
                }
            });
        },
        getClients:function(){
            var vm = this;
            axios.get('https://rideshareapi.herokuapp.com/api/clients')
                .then(function(response){
                    vm.clients = response.data;
                })
                .catch(function (error) {

                })
        },
        submitRequest: function(){
            var vm = this;
            axios.get('https://rideshareapi.herokuapp.com/api/create-request?client_id='+vm.active_client.id+'&destination_address='+vm.destination_address+'&pick_up_address='+vm.pick_up_address+'&estimated_length='+vm.estimated_length+'&time='+vm.time+'&date='+vm.date)
                .then(function(response){
                    if(response.data.hasOwnProperty('client_id')){
                        vm.message = 'Request successfully created';
                        vm.destination_address = '';
                        vm.estimated_length = '';
                        vm.time = '';
                        vm.date = '';
                        vm.getRequests();
                    }
                    vm.active_client = {};
                })
                .catch(function (error) {
                    vm.message = 'There was an issue creating the request';
                });
            setTimeout(function(){
                vm.message = '';
            },5000)
        },
        createARide: function(client){
          this.active_client = client;
          $('#pills-tab a[href="#pills-create-a-ride"]').tab('show');
        },
        getData: function(){
            this.getDrivers();
            this.getClients();
            this.getHistory();
            this.getRequests();
        }
    },
    mounted: function () {
        this.user = JSON.parse(localStorage.getItem('rideshare.user'));
        if(this.user === null || localStorage.getItem('rideshare.role') !== 'admin'){
            location.href = (window.location+'').replace('/admin', '/index');
        }else{
            this.getData();
        }
    },
});