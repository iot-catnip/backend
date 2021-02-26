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
                <h1 class="text-sm font-bold">
                  Se connecter
                </h1>
              </div>
              <form>
                <div class="relative w-full mb-3">
                  <label
                      class="block uppercase text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                  >
                    Identifiant
                  </label>
                  <input
                      v-model="username"
                      type="text"
                      class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                      placeholder="Identifiant"
                  />
                </div>

                <div class="relative w-full mb-3">
                  <label
                      class="block uppercase text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                  >
                    Mot de passe
                  </label>
                  <input
                      v-model="password"
                      type="password"
                      class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                      placeholder="Mot de passe"
                  />
                </div>
                <div>
                  <label class="inline-flex items-center cursor-pointer">
                    <input
                        id="customCheckLogin"
                        v-model="remember"
                        type="checkbox"
                        class="form-checkbox text-gray-800 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                    />
                    <span class="ml-2 text-sm font-semibold text-gray-700">
                    Se souvenir de moi
                  </span>
                  </label>
                </div>
                <div v-if="error">
                  <label class="inline-flex items-center cursor-pointer">
                    <span class="ml-2 text-sm font-semibold text-red-500">
                      {{ errMessage }}
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
        <!--
        <div class="flex flex-wrap mt-6 relative">
          <div class="w-1/2">
            <a href="javascript:void(0)" class="text-gray-300">
              <small>Mot de passe oublier?</small>
            </a>
          </div>
        </div>-->
      </div>
    </div>
  </div>
</template>
<script>

import {loginRoutine} from '../../script/auth'

export default {
  data() {
    return {
      username:'',
      password:'',
      remember:false,
      error:false,
      errMessage:null,
    }
  },
  methods:{
    login: function () {
      const {username, password, remember} = this
      loginRoutine({username, password, remember}).then(() => {
        //Reset error values to avoid somme issus
        this.error=false;
        this.errMessage=null;
        //Redirect to main route
        this.$router.push('/');
      }).catch((err)=>{
        console.log(err);
        this.error=true;
        //Check if error is expected error or not
        if (err.data.success===false){
          this.errMessage="Votre identifiant ou votre mot de passe et incorrect"
        }else{
          this.errMessage="Une erreur inconnue c'est produite"
        }
      })
    }
  }
};
</script>
