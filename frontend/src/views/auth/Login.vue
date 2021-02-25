<template>
  <div class="container mx-auto px-4 h-full">
    <div class="flex content-center items-center justify-center h-full">
      <div class="w-full lg:w-4/12 px-4">
        <div
            class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0"
        >
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <div class="rounded-t mb-0 px-6 py-6">
              <div class="text-center mb-3">
                <h6 class="text-gray-600 text-sm font-bold">
                  Sign up with
                </h6>
              </div>
              <form>
                <div class="relative w-full mb-3">
                  <label
                      class="block uppercase text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                  >
                    Login
                  </label>
                  <input
                      v-model="loginField"
                      type="text"
                      class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                      placeholder="Login"
                  />
                </div>

                <div class="relative w-full mb-3">
                  <label
                      class="block uppercase text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                  >
                    Password
                  </label>
                  <input
                      v-model="passField"
                      type="password"
                      class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                      placeholder="Password"
                  />
                </div>
                <div>
                  <label class="inline-flex items-center cursor-pointer">
                    <input
                        id="customCheckLogin"
                        v-model="rememberMe"
                        type="checkbox"
                        class="form-checkbox text-gray-800 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                    />
                    <span class="ml-2 text-sm font-semibold text-gray-700">
                    Remember me
                  </span>
                  </label>
                </div>

                <div class="text-center mt-6">
                  <button
                      class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="button"
                      v-on:click="login($event)"
                  >
                    Se connecter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap mt-6 relative">
          <div class="w-1/2">
            <a href="javascript:void(0)" class="text-gray-300">
              <small>Mot de passe oublier?</small>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import axios from 'axios';

export default {
  data() {
    return {
      loginField:'',
      passField:'',
      rememberMe:false,
    }
  },
  methods:{
    login:function (event){
      event.preventDefault();
      axios.post('/api/login',[this.loginField,this.passField,this.rememberMe])
          .then(response => {
            let token = response.data.token;
            localStorage.setItem('user-token', token);
            this.$router.push('/admin/dashboard');
          })
          .catch(error => {
            console.log(error)
            this.errored = true
          })
          .finally(() => this.loading = false)
    }
  }
};
</script>
