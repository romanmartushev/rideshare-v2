var app = new Vue({
    el: '#page-wrapper',
    data: {
        message: '',
        user: JSON.parse(localStorage.getItem('rideshare.user')),
        requests: [],
        pick_up_address: '',
        destination_address: '',
        estimated_length: '',
        time: '',
        date: ''
    },
    methods: {
        getRequests: function () {
            var vm = this;
            axios.get('https://rideshareapi.herokuapp.com/api/client-requests?id='+vm.user.id)
                .then(function(response){
                    vm.requests = response.data;
                })
                .catch(function (error) {

                })
        },
        submitRequest: function(){
            var vm = this;
            axios.get('https://rideshareapi.herokuapp.com/api/create-request?client_id='+vm.user.id+'&destination_address='+vm.destination_address+'&pick_up_address='+vm.pick_up_address+'&estimated_length='+vm.estimated_length+'&time='+vm.time+'&date='+vm.date)
                .then(function(response){
                    if(response.data.hasOwnProperty('client_id')){
                        vm.message = 'Request successfully created';
                        vm.destination_address = '';
                        vm.estimated_length = '';
                        vm.time = '';
                        vm.date = '';
                        vm.getRequests();
                    }
                })
                .catch(function (error) {
                    vm.message = 'There was an issue creating the request';
                });
            setTimeout(function(){
                vm.message = '';
            },5000)
        },
    },
    mounted: function () {
        this.user = JSON.parse(localStorage.getItem('rideshare.user'));
        if(this.user === null || localStorage.getItem('rideshare.role') !== 'client'){
            location.href = (window.location+'').replace('/client', '/index');
        }else{
            this.getRequests();
        }
    },
});