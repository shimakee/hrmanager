<template>
    <div>
        <ul class="contact-gallery">
            <li v-for="(item, key) in contacts" v-bind:key="key"
                class="contact-card"
                :class="{chosen: itemActive == item._id}"
                @click="itemActive = item._id">


                
                <contact-form  v-if="itemEdit && itemActive == item._id  && editable"
                        :item="item" 
                        :submit="submit"
                        />

                <contact-detail v-else :item="item" 
                        />

                <span class="delete"
                        v-if="itemActive == item._id && editable"
                        @click="deleteContact(item)">X</span>

                <span class="edit"
                        v-if="!itemEdit && itemActive == item._id && editable"
                        @click="itemEdit = true">Edit</span>
                <span class="edit"
                        v-if="itemEdit && itemActive == item._id  && editable"
                        @click="itemEdit = false">Cancel</span>
            </li>
        </ul>
    </div>
</template>
<script>
import ContactDetail from './contactDetail';
import ContactForm from './contactForm';

export default {
    props:{
        editable: {type: Boolean, default: false},
        contacts: {type: Array}
    },
    components:{
        "contact-detail": ContactDetail,
        "contact-form": ContactForm
    },
    data(){
        return{
            itemActive: null,
            itemEdit: false
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
        submit(item){
            // //axios store action
            this.$store.dispatch('updateContact', item)
                .then(res=>{
                    this.$store.commit('setInfoMessage', "Success");
                    this.$store.commit('setErrorMessage', null);

                    this.$store.dispatch('getContact');
                    this.itemEdit = false;

                }).catch(err=>{
                    this.$store.commit('setInfoMessage', null);
                    this.$store.commit('setErrorMessage', err.response.statusText);
                });
        },
        deleteContact(item){
            // //axios store action
            this.$store.dispatch('deleteContact', item._id)
                .then(res=>{
                    this.$store.commit('setInfoMessage', "Success");
                    this.$store.commit('setErrorMessage', null);

                    this.$store.dispatch('getContact');

                }).catch(err=>{
                    this.$store.commit('setInfoMessage', null);
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
.chosen{
    outline: solid 3px blue;
}
.main:hover,.notMain:hover{
    cursor: pointer;
}
.main{
    position: absolute;
    background-color: green;
    border: blue solid 3px;
    padding: 10px;
    border-radius: 20px;
}
.notMain{
    position: absolute;
    background-color: red;
    border: blue solid 3px;
    padding: 10px;
    border-radius: 20px;
}
/* ul.contact-gallery{
    list-style: none;
    display: block;
} */
ul{
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, auto));
    grid-gap: 10px;
    padding: 0;
    justify-content: center;
}
li.contact-card{
    background-color: grey;
    padding: 5px 0px 5px 15px;
    position: relative;
    /* margin: 10px; */
    max-width: fit-content;
    min-width: 250px;
    justify-items: center;
}
li .edit{
    position:absolute;
    top: 10px;
    right: 15px;
    color: blue;
    font-weight: bolder;
}
li .delete{
    position: absolute;
    top: -15px;
    right: -10px;
    background-color: red;
    color: white;
    font-weight: bolder;
    border-radius: 15px;
    padding: 5px;
}
li input{
    max-width: fit-content;
}

/*=======FORM========*/


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
    padding: 0px;
    margin:0px;
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
    grid-template-columns: repeat(auto-fit, minmax(100px, auto));
    grid-gap: 10px;
    /* margin: 5px 0; */
}
.label-group{
    display: grid;
    grid-template-columns: 1fr 4fr;
    /* align-content: center;
    justify-content: center; */
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
    text-align: center;
}

</style>



