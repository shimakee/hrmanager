<template>
  <div>
    <navbar></navbar>
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
  mounted(){
    this.$store.dispatch('autoLogin');
    this.$store.dispatch('autoSetData');
    this.$store.dispatch('autoLogout');
  }
}
</script>

<style>
body{
  margin:0;
  padding:0;
}
</style>
