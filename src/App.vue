<template>
  <div>
    <!-- <navbar></navbar> -->
    <router-view></router-view>
  </div>
</template>

<script>
import Login from './components/beforeAuth/login'
import Navbar from './components/parts/navbar'
import {mapGetters} from 'vuex'; //importing getters
import {mapMutations} from 'vuex'; //importing mutations
import {mapActions} from 'vuex'; //importing mutations

export default {
  data(){
    return{
      }
  },
  components:{
    "login": Login,
    "navbar": Navbar
  }
}
</script>

<style>
</style>
