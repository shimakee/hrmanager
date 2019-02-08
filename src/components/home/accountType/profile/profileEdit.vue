<template>

    <div>
        <div class="editButton" @click="editChange()">
            <span v-if="edit">
                Cancel
            </span>
            <span v-else>
                Edit
            </span>
        </div>
        <form class="form-container">
            <div class="form-group">
                <div class="label-group">
                    <label class="input">Gender: </label>
                    <select v-if="edit" v-model="formProfile.civilStatus" id="">
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="annulled">Annuled</option>
                        <option value="widowed">Widowed</option>
                    </select>
                    <span v-if="!edit">
                        {{formProfile.civilStatus }} 
                    </span>
                </div>
                
                <div class="label-group">
                    <label>Birthdate: </label>
                    <input v-if="edit" type="date" v-model="formProfile.birthdate">
                    <span v-if="!edit">
                        {{parseBirthdate(formProfile.birthdate)}}
                    </span>
                </div>
            </div>

            <div class="form-group">
                <div class="form-group">
                    <div v-if="!edit">
                        <label>Gender: </label>
                        {{formProfile.gender}}
                    </div>
                    <div v-if="edit">
                        <label>Male</label>
                        <input type="radio" v-model="formProfile.gender" value="male">
                    </div>
                    <div v-if="edit">
                        <label>Female</label>
                        <input type="radio" v-model="formProfile.gender" value="female">
                    </div>
                </div>
                <div class="label-group">
                    <label>Nationality: </label>
                    <input v-if="edit" type="text" v-model="formProfile.nationality" placeholder="nationality">
                    <span v-if="!edit">
                        {{ formProfile.nationality}}
                    </span>
                </div>
            </div>

            <div v-if="edit" class="input-group">
                <input type="text" v-model="formProfile.name.first" placeholder="first">
                <input type="text" v-model="formProfile.name.middle" placeholder="middle">
                <input type="text" v-model="formProfile.name.last" placeholder="last">
                <input type="text" v-model="formProfile.name.suffix" placeholder="suffix">
                <input v-if="formProfile.gender === 'female' && formProfile.civilStatus !== 'single'"
                    type="text" v-model="formProfile.name.maiden" placeholder="maiden">
            </div>
            <div v-if="!edit" class="input-group">
                <span>{{formProfile.name.first}}</span>
                <span>{{formProfile.name.middle}}</span>
                <span>{{formProfile.name.last}}</span>
                <span>{{formProfile.name.suffix}}</span>
                <span v-if="formProfile.gender === 'female' && formProfile.civilStatus !== 'single'">{{formProfile.name.maiden}}</span>
            </div>

            <button v-if="edit" @click.prevent="submit">Send</button>

            <br>
            <span class="error" v-if="errorMessage">
                {{errorMessage}}
            </span>
            <span class="info" v-if="infoMessage">
                {{infoMessage}}
            </span>
        </form>
    </div>
</template>
<script>
export default {
    data(){
        return {
            formProfile:{ name:{first: "",
                                middle: "",
                                maiden:"",
                                last: "",
                                suffix: "" },
                        civilStatus: "single",
                        nationality:"",
                        gender: "male",
                        birthdate: "1989/10/18"},
            edit: false
        }
    },
    methods:{
        submit(){

            //TODO: validation

            this.$store.dispatch('updateProfile', this.formProfile) //TODO: unit by account type - updateAccount information
                .then(response=>{
                    this.$store.dispatch('getProfile')
                        .then(res=>{
                            this.edit = false;
                            //clear info and error messages
                            // this.$store.dispatch('clearDisplayMessages');
                            this.$store.commit('setInfoMessage', res.data.message);
                    });
                    
                }).catch(err=>{
                    this.$store.commit('setErrorMessage', err.response.statusText);
                });
        },
        giveFormValue(data){
            
                    this.formProfile.civilStatus = data.civilStatus;
                    let name = this.formProfile.name;

                    for (const key in this.formProfile.name) {
                        if (this.formProfile.name.hasOwnProperty(key)) {
                            const element = this.formProfile.name[key];
                            
                            name[key] = data.name[key];
                        }
                    }

                    this.formProfile.nationality = data.nationality;
                    this.formProfile.gender = data.gender;
                    this.formProfile.birthdate = this.parseBirthdate(data.birthdate);
        },
        parseBirthdate(birthdate){
            let date = new Date(birthdate);

            const month = date.getMonth()+1; //zero based
            const day = date.getDate();
            const year = date.getFullYear();

            return `${year}-${month}-${day}`; //use this format to be compatible with input format
        },
        editChange(){
            this.edit = !this.edit;
        }
    },
    computed:{
        profile(){
            return this.$store.getters.getProfile;
        },
        errorMessage(){
            return this.$store.getters.getErrorMessage;
        },
        infoMessage(){
            return this.$store.getters.getInfoMessage;
        }
    },
    mounted(){
        let profile = this.$store.getters.getProfile; //get information

        if(!profile){
            this.$store.dispatch('getProfile') 
                .then(res=>{
                    // localStorage.setItem('profile', JSON.stringify(res));
                    // this.$store.commit('setProfile', res);

                    //assign value to form
                    this.giveFormValue(res);
            });
        }else{
            //assign value to form
            this.giveFormValue(profile);
        }

        this.$store.dispatch('clearDisplayMessages');
    }
}
</script>
<style scoped>
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
