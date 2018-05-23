<template>
  <div>
    <navbar></navbar>
    <router-view></router-view>
    <button @click="methodWIthObjPayload({amount:2, time:500})">click</button>
    {{sampleState}}
    {{doubleSampleState}}
  </div>
</template>

<script>
import Login from './components/login'
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
  },
  methods:{
    ...mapMutations([ //sample mutation from store.js
        'increase'
    ]),
    clicker2(){ //sample local mutation
      this.$store.commit('increase');
    },
    ...mapActions([
      'inc'
    ]),
    newMethod(payload){//sample actions with payload
      this.$store.dispatch('inc', payload);
    },
    methodWIthObjPayload(payload){//sample actions with payload
      this.$store.dispatch('withPayloadObj', payload);
    }
  },
  computed:{
    ...mapGetters([ //sample getters from store.js
      'sampleState',
      'doubleSampleState'
    ]),
    sampleComputed(){ //sample localized computed
      return "sample Computed"
    }
  }
}
</script>

<style>
</style>
