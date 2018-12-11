var app = new Vue({
    el: '#page-wrapper',
    data: {
        loggedIn: localStorage.getItem('rideshare.role') != null,
        user: JSON.parse(localStorage.getItem('rideshare.user')),
        requests: []
    },
    methods: {
        login: function () {
            var vm = this;
            axios.get('https://rideshareapi.herokuapp.com/api/client-requests?id='+user.id)
                .then(function(response){

                })
                .catch(function (error) {

                })
        },
        register: function(){
            var vm = this;
            axios.get('https://rideshareapi.herokuapp.com/api/register?first_name='+vm.sign_up_first_name+'&last_name='+vm.sign_up_last_name+'&email='+vm.sign_up_email+'&phone_number='+vm.sign_up_phone_number+'&password='+vm.sign_up_password+'&confirm_password='+vm.sign_up_password_confirm)
                .then(function(response){
                    console.log(response);
                })
                .catch(function (error) {

                })
        },
        logout: function(){
            localStorage.removeItem('rideshare.role');
            localStorage.removeItem('rideshare.user');
            this.loggedIn = false;
        }

    },
    mounted: function () {
        this.user = JSON.parse(localStorage.getItem('rideshare.user'));
        if(this.user === null){
            location.href = (window.location+'').replace('/client', '/index');
        }
    }
});