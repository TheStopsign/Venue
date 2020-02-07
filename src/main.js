import Vue from "vue";
import App from "./App.vue";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import routes from './routes.js'
import store from './vuex/store'

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueAxios from 'vue-axios';
import axios from 'axios';
Vue.use(VueAxios, axios);

const router = new VueRouter({mode: 'history', routes: routes});

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    created(){
    	// Automatic Login
    	const userString = localStorage.getItem('user')
    	if(userString) {
    		const userData = JSON.parse(userString)
    		this.$store.commit('SET_USER_DATA', userData)
    	}
    },
    render: h => h(App)
}).$mount('#app');
