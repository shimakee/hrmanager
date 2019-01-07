<template>
    <div>
        <ul>
            <li v-for="pic in pics" v-bind:key="pic" class="card-pic">
                <img :src="'/file/photo/me?name='+pic.filename" :alt="pic.filename" srcset="">
                <p class="description">
                        {{pic.filename}}
                </p>
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
ul{
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, auto));
    grid-gap: 10px;
    padding: 0;
}
 ul li.card-pic{
     background-color: cornsilk;
     display: grid;
     grid-template-columns: 1fr;
     justify-items: center;
     align-items: center;
 }

li.card-pic img{
    width: 100%;
}
li.card-pic p{
    font-size: 1em;
    padding: 0;
    margin: 12px 0;
}
</style>
