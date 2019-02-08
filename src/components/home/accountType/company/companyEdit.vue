<template>

    <div>
        <div class="editButton" @click="edit = !edit">
            <span v-if="edit">
                Cancel
            </span>
            <span v-else>
                Edit
            </span>
        </div>
        <form v-if="edit" class="form-container">

            <input type="text" v-model="formCompany.tradename">
            <input type="text" v-model="formCompany.ownershipType">
            <button v-if="edit" @click.prevent="submit">Send</button>

        </form>
        <div v-if="!edit">
            <li class="card"
                v-if="key == 'tradename' || key == 'ownershipType'" 
                v-for="(value, key) in company" v-bind:key="key">
                <p v-if="key == 'tradename' || key == 'ownershipType'">{{key}}: {{value}}</p>

            </li>
            <!-- <p>Tradename: {{tradename}}</p>
            <p>Owenership type: {{ownershipType}}</p> -->
        </div>
            <br>
            <span class="error" v-if="errorMessage">
                {{errorMessage}}
            </span>
            <span class="info" v-if="infoMessage">
                {{infoMessage}}
            </span>
    </div>
</template>
<script>
export default {
    data(){
        return {
            formCompany:{ tradename: "",
                        ownershipType: ""},
            edit: false
        }
    },
    methods:{
        submit(){

            //TODO: validation

            this.$store.dispatch('updateCompany', this.formCompany) //TODO: unit by account type - updateAccount information
                .then(response=>{
                    this.$store.dispatch('getCompany')
                        .then(res=>{
                            // localStorage.setItem('profile', JSON.stringify(res));
                            // this.$store.commit('setProfile', res);
                            
                            this.edit = false;
                            //clear info and error messages
                            // this.$store.dispatch('clearDisplayMessages');
                            this.$store.commit('setInfoMessage',"Success");
                            this.$store.commit('setErrorMessage', null);
                    });
                    
                }).catch(err=>{
                    // this.$store.commit('setErrorMessage', 'Account update failed. Invalid input.');
                    this.$store.commit('setInfoMessage',null);
                    this.$store.commit('setErrorMessage', err.response.statusText);
                });
        },
        giveFormValue(data){

                    this.formCompany.tradename = data.tradename;
                    this.formCompany.ownershipType = data.ownershipType;
        }
    },
    computed:{
        company(){
            return this.$store.getters.getCompany;
        },
        errorMessage(){
            return this.$store.getters.getErrorMessage;
        },
        infoMessage(){
            return this.$store.getters.getInfoMessage;
        }
    },
    mounted(){
        let company = this.$store.getters.getCompany; //get information

        if(!company){
            this.$store.dispatch('getCompany') 
                .then(res=>{
                    // localStorage.setItem('profile', JSON.stringify(res));
                    // this.$store.commit('setProfile', res);

                    //assign value to form
                    this.giveFormValue(res);
            });
        }else{
            //assign value to form
            this.giveFormValue(company);
        }

        this.$store.dispatch('clearDisplayMessages');
    }
}
</script>
<style scoped>
.card{
    list-style: none;
}
/*======INFO & ERROR message========*/
.error{
    color: red;
    text-align: center;
}
.info{
    color:blue;
    text-align: center;
}



/*==========================FORM===================================*/
.editButton span{
    float: right;
    color: blue;
    cursor: pointer;
    padding: 0 10px;
}
.form-container{
    display:grid;
    grid-template-columns: 1fr;
    /* justify-content: center;
    align-content: center; */
    grid-row-gap: 10px;
}
.form-container button{
    align-self: center;
    justify-self: center;
}
.form-group{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1em;
    /* margin: 5px 0; */
}
.input-group{   
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, auto));
    grid-gap: 10px;
    /* margin: 5px 0; */
}
.label-group{
    display: grid;
    grid-template-columns: 1fr 4fr;
}
.form-group .input-group{
    display: grid;
    grid-template-columns: 1fr;
}
.input{
    max-width: fit-content;
}
form input, form select {
    font-size: 20px;
}


@media (max-width: 480px) { /*mobile*/
    .label-group{
        grid-template-columns: 1fr;
    }
}
</style>
