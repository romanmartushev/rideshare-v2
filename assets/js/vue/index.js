var app = new Vue({
    el: '#page-wrapper',
    data: {
        loggedIn: localStorage.getItem('rideshare.role') != null,
        sign_in: false,
        sign_up: false,
        sign_in_email: '',
        sign_in_password: '',
        sign_up_first_name: '',
        sign_up_last_name: '',
        sign_up_phone_number: '',
        sign_up_email: '',
        sign_up_password: '',
        sign_up_password_confirm: '',
        user: JSON.parse(localStorage.getItem('rideshare.user')),
    },
    methods: {
        login: function () {
            var vm = this;
            axios.get('https://rideshareapi.herokuapp.com/api/login?email='+vm.sign_in_email+'&password='+vm.sign_in_password)
                .then(function(response){
                    if(response.data.authorized = true){
                        localStorage.setItem('rideshare.role',response.data.role);
                        localStorage.setItem('rideshare.user',JSON.stringify(response.data.user));
                        vm.loggedIn = localStorage.getItem('rideshare.role') != null;
                        vm.sign_up = false;
                        vm.sign_in = false;
                        vm.user = JSON.parse(localStorage.getItem('rideshare.user'));
                        vm.user.role = localStorage.getItem('rideshare.role');
                    }
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
            this.loggedIn = false;
            var vm = this;
            axios.get('https://rideshareapi.herokuapp.com/api/logout?email='+vm.user.email)
                .then(function(response){
                    console.log(response);
                    localStorage.removeItem('rideshare.role');
                    localStorage.removeItem('rideshare.user');
                    vm.user = JSON.parse(localStorage.getItem('rideshare.user'));
                })
                .catch(function (error) {

                })
        }
        
    },
    mounted: function () {
        this.user = JSON.parse(localStorage.getItem('rideshare.user'));
        if(this.user !== null){
            this.user.role = localStorage.getItem('rideshare.role');
        }
    }
});