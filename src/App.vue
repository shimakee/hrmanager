<template>
  <div>
    <navbar></navbar>
    <router-view></router-view>
  </div>
</template>

<script>
import Login from './components/login'
import Navbar from './components/parts/navbar'

export default {
  components:{
    "login": Login,
    "navbar": Navbar
  }
}
</script>

<style>
</style>
