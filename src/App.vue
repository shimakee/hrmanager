<template>
  <div>
    <!-- <navbar></navbar> -->
    <router-view></router-view>
  </div>
</template>

<script>
// import {mapGetters} from 'vuex'; //importing getters
// import {mapMutations} from 'vuex'; //importing mutations
// import {mapActions} from 'vuex'; //importing mutations

export default {
  data(){
    return{
      }
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
