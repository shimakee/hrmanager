<template>
    <div>
        <router-view name="contactAdd"/>
        <router-view name="contactShow"/>
    </div>
</template>
<script>
export default {
    data(){
        return {
            contactModel:{main: "",
                        description:"",
                        countryCode:"",
                        areaCode:"",
                        number:""},
            contacts:[]
        }
    },
    methods:{
        submit(event){
            event.preventDefault();

            //axios store action
        },
        addContact(event){
            event.preventDefault();

            this.contacts.push({
                main:this.contactModel.main,
                description:this.contactModel.description,
                countryCode:this.contactModel.countryCode,
                areaCode:this.contactModel.areaCode,
                number:this.contactModel.number
            });

            this.contactModel.main = ""
            this.contactModel.description = ""
            this.contactModel.countryCode = ""
            this.contactModel.areaCode = ""
            this.contactModel.number = ""
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
