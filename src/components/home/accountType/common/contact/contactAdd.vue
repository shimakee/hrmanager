<template>
    <div>
        <h2>Contacts</h2>
        <form>
            <div class="formGroup">
                <label>name:</label>
                <input type="checkbox" v-model="contactModel.main" value="true">
                <input type="text" v-model="contactModel.description" placeholder="contact description">
                <input type="number" v-model="contactModel.countryCode" placeholder="country code">
                <input type="number" v-model="contactModel.areaCode" placeholder="area code">
                <input type="number" v-model="contactModel.number" placeholder="number">
            </div>
            
            <button @click.prevent="submit">Add Contact</button>  
            <span v-if="infoMessage" class="infoMessage">{{infoMessage}}</span>  
            <span v-if="errorMessage" class="errorMessage">{{errorMessage}}</span>  
        </form>
    </div>
</template>
<script>
export default {
    data(){
        return {
            contactModel:{main: false,
                        description:"",
                        countryCode:"",
                        areaCode:"",
                        number:""}
        }
    },
    computed:{
        infoMessage(){
            return this.$store.getters.getInfoMessage;
        },
        errorMessage(){
            return this.$store.getters.getErrorMessage;
        }
    },
    methods:{
        submit(){

            //axios store action
            this.$store.dispatch('addContact', this.contactModel)
                .then(res=>{
                    
                    this.$store.dispatch('getContact');
                    this.$store.commit('setInfoMessage', "Success");
                    
                }).catch(err=>{
                    this.$store.commit('setErrorMessage', err.response.statusText);
                });
        }
    },
    beforeMount(){
        this.$store.commit('clearAuthData');
    }
}
</script>
<style scoped>
.infoMessage, .errorMessage{
    font-weight: bolder;
    padding: 5px;
    margin: 5px;
}
.infoMessage{
    color: green;
}
.errorMessage{
    color:red;
}
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
