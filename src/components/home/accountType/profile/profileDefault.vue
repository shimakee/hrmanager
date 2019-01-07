<template>
    <div>
        <h1>HuReOn Default</h1>
        <ul>
            <li>
                <img src="https://picsum.photos/100/100/?random" alt="">
            </li>
            <li v-for="pic in pics" v-bind:key="pic">
                <!-- <img :src="'/file/photo/me?name='+pic.filename" :alt="pic.filename" srcset=""> -->
            </li>
        </ul>
        
    </div>
</template>
<script>
export default {
    computed:{
        pics(){
            //get array pics info
            const cachedProfile = JSON.parse(localStorage.getItem('profile'));
            const stateProfile = this.$store.getters.getProfile
            let profile = stateProfile || cachedProfile;
            let pics;

            if(!profile || !profile.pics){
                //return empty array if no pics found
                pics = [];
            }else{
                pics = profile.pics;
            }

            return pics;
        }
    }
}
</script>
<style scoped>
</style>
