<template>
  <div>
    <!-- <navbar></navbar> -->
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from './components/parts/navbar'
// import {mapGetters} from 'vuex'; //importing getters
// import {mapMutations} from 'vuex'; //importing mutations
// import {mapActions} from 'vuex'; //importing mutations

export default {
  data(){
    return{
      }
  },
  components:{
    "navbar": Navbar
  },
  created(){
      this.$store.dispatch('autoLogin');
  }
}
</script>

<style>
body{
  margin:0;
  padding:0;
}
</style>
