<template>
    <div class="home">
        <!-- <div class="mobile"> -->
            <div class="menu">
                <span @click="infoShow">Info</span>
                <span @click="showContent">Content</span>
                <span @click="actionShow">Action</span>
            </div>
            <div class="view-container">
                <router-view class="content"></router-view>
                <transition name="slideLeft">
                    <!-- <router-view v-show="info"  name="info" class="tab info"></router-view> -->
                    <router-view v-bind:class="{slideLeft: info, return: !info}" name="info" class="tab info"></router-view>
                </transition>
                <transition name="slideRight">
                    <!-- <router-view v-show="action" name="actions" class="tab actions"></router-view> -->
                    <router-view v-bind:class="{slideRight: action, return: !action}" name="actions" class="tab actions"></router-view>
                </transition>
            </div>
        <!-- </div> -->
    </div>
</template>
<script>

export default {
    data(){
        return{
            info: true,
            action: true

        }
    },
    methods:{
        showContent(){
            this.info = true;
            this.action = true;

            console.log('show content');
        },
        infoShow(){
            this.info = !this.info;
            this.action = true;
        },
        actionShow(){
            this.info = true;
            this.action = !this.action;
        }
    }
    ,created(){
        this.$store.dispatch('geoLocate');

        this.$store.dispatch('maintainData')//maintain login status
            .then(res=>{
                console.log('maintained data.');
            }).catch(err=>{
                this.$store.dispatch('logout');
                console.log('there was an error.');
            });
    }
}
</script>
<style>
.home{
    display: grid;
    grid-template-rows: max-content;
    height: 100vh;
}
.menu{
    display: none;
    grid-template-columns: 1fr 2fr 1fr;
    position: sticky;
    top:0px;
    background-color: rgb(6, 11, 80);
    color: white;
}
.menu span{
    transition: display 1s 2s;
    transition: transform 1s  ease-in-out;
    text-align: center;
}
.noShow{
    display:none;
}
.slideLeft{
    transition: transform 1s  ease-in-out;
    transform:translateX(-100%);
}
.slideRight{
    transition: transform 1s ease-in-out;
    transform:translateX(100%);
}
.return{
    transition: 1s ease-in-out;
    transform: translateX(0%);
}
.view-container{
        position:relative;
        display: grid;
        grid-template-rows: max-content;
}

 /*mobile*/
@media (max-width: 480px) { /* mobiles */
    .menu{
        display: grid;
    }
    .menu span{
        /* padding: 10px 1em; */
    }
    .home{
        grid-template-columns: 1fr;
        text-align: center;
    }
    .view-container{
        grid-template-columns: 1fr;
    }
    .tab{
        position:absolute;
        top:0;
        width: 100%;
    }
    
    .view-container .tab.actions,.view-container .tab.info {
        padding: 10px 0px;
    }
}
@media (max-width: 1024px) and (orientation: portrait){/*tablets - portrait mode*/
    
    .home{
        grid-template-columns: 1fr;
        text-align: center;
        /* overflow-x: hidden; */
    }
    .menu{
        display: grid;
    }
    .menu span{
        padding: 15px 1em;
    }
    .view-container{
        grid-template-columns: 1fr;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .tab{
        position:absolute;
    }
}
@media (min-width: 480px) and (max-width: 1024px) and (orientation: portrait){ /*tablets*/
    .tab{
        position:absolute;
        width: 100%;
    }
}
@media (max-width: 1024px) and (orientation: landscape){/*tablets - landscape mode*/
    .menu{
        display: none;
    }
    .view-container{
        grid-template-columns: 1fr 4fr;
    }
    
    .slideRight,
    .slideLeft{
        transform: translateX(0%);
    }
    .content{
        grid-row: 1/span 2;
        grid-column: 2;
    }
}

/*tablet*/
/* @media (min-width:480px) and (max-width: 1024px){ 
    
    .view-container{
        display:grid;
        grid-template-columns: 1fr 3fr;
    }
    .view-container .dashboard.info,
    .view-container .dashboard.actions{
        display: grid;
    }
    .content{
        grid-row: 1/span 2;
        grid-column: 2;
    }
} */
@media (min-width: 1024px) { /*Laptop & tvs*/
    .view-container{
        display:grid;
        grid-template-columns: 1fr 4fr;
        font-size: 20px;
    }
    .content{
        grid-row: 1/span 2;
        grid-column: 2;
    }
    .slideRight,
    .slideLeft{
        transform: translateX(0%);
    }
    .tab{
        max-width: 400px;
    }
 }

 /*===========================transitions===========================*/
 .info,
 .content,
 .actions{
     padding: 10px 15px;
 }
 .info{ /*must have backgrounds*/
    background-color: rgb(6, 11, 80);
    color: white;
 }
 .actions{/*must have backgrounds*/
    background-color: rgb(6, 11, 80);
    color: white;
 }
 .content{
     /* background-color: palevioletred; */
 }


 /*slide-right*/
 .slideRight-enter{
     transform: translateX(100%);
 }
 .slideRight-enter-active,
 .slideRight-leave-active{
     transition: .5s ease-in-out;
 }
 .slideRight-enter-to{  
     transform: translateX(0%);
 }
 .slideRight-leave{
     transform: translateX(0%);
 }
 .slideRight-leave-to{
     transform: translateX(100%);
 }

 /*slide-left*/
 .slideLeft-enter{
     /* transition: .5s ease-in-out; */
     transform: translateX(-100%);
 }
 .slideLeft-enter-active,
 .slideLeft-leave-active{
     transition: .5s ease-in-out;
     /* transform: translateX(-50%); */
 }
 .slideLeft-enter-to{  
     transform: translateX(0%);
 }
 .slideLeft-leave{
     transform: translateX(0%);
 }
 .slideLeft-leave-to{
     transform: translateX(-100%);
 }
</style>
