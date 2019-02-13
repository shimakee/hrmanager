<template>
    <div>
        <h1>Main Contact</h1>
        <!-- <router-view name="contactAdd"/>
        <router-view name="contactShow" 
            :editable="editable"
            :contacts="contacts"/> -->

            <contact-add />
            <contact-show :editable="editable" 
                :contacts="contacts" />
    </div>
</template>
<script>
import ContactAdd from './contactAdd';
import ContactShow from './contactShow';

export default {
    props:{
        editable:{type: Boolean, default: false}
    },
    components:{
        "contact-show": ContactShow,
        "contact-add": ContactAdd
    },
    data(){
        return {
            contactModel:{main: "",
                        description:"",
                        countryCode:"",
                        areaCode:"",
                        number:""}
        }
    },
    computed:{
        contacts(){
            return this.$store.getters.getContact;
        }
    },
    methods:{
        submit(event){
            event.preventDefault();

            //axios store action
        }
    }
}
</script>
<style scoped>
.profile{
    display: grid; 
    grid-template-columns: 1fr 4fr;
}
.avatar-container{
    /* position:relative; */
    padding:.5em;
    margin:1.5em;
    text-align: center;
    float: left;
    /* width:20vw; */
}
.avatar{
    border-radius: 20em;
}
.info{
    list-style: none;
    text-align: center;
}
.posts{
    position:relative;
    display:block;
}
</style>
