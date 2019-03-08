<template>
    <ul>
        <li  @click="chosen=business.business._id" v-for="(business, key) in businesses" v-bind:key="key">
            <span @click="deleteBusiness(business.business)"
                v-if="editActive && chosen == business.business._id" class="delete">X</span>

            <business-detail v-if="!editActive || chosen != business.business._id" :business="business" />
            <business-form v-if="editActive && chosen == business.business._id" :business="business" :submit="editBusiness" :class={chosen:editActive} />

            <span  @click="editActive = !editActive" class="edit">
                <span v-if="editActive && chosen == business.business._id"  >Cancel</span>
                <span v-if="!editActive">Edit</span>
            </span>
        </li>
    </ul>
</template>
<script>
import BusinessDetail from "./businessDetail";
import BusinessForm from "./businessForm";

export default {
    components:{
       "business-detail": BusinessDetail, 
       "business-form": BusinessForm 
    },
    data(){
        return{
            editActive: false,
            chosen: null
        }
    },
    computed:{
        businesses(){
            return this.$store.getters.getBusinesses;
        }
    },
    methods:{
        editBusiness(business){
            this.$store.dispatch("editBusiness", business);
        },
        deleteBusiness(business){
            // console.log(business);
            this.$store.dispatch("deleteBusiness", business);
        }
    },
    mounted(){
        this.$store.dispatch("getBusinesses")
            .then(res=>{
                console.log(res);
            });
    }
}
</script>
<style scoped>
ul{
    list-style:  none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(700px, auto));
    grid-gap: 15px;
    margin: 25px 5px 5px 5px;
    padding: 0;
}
li{
    position: relative;
}
.chosen{
    outline: blue 1px solid;
}
.edit{
    position: absolute;
    top: 10px;
    right: 15px;
    color: blue;
    cursor: pointer;
    padding: 10px;
    max-width: fit-content;
}
.delete{
    position: absolute;
    top: -15px;
    right: -10px;
    font-weight: bolder;
    color: white;
    cursor: pointer;
    border-radius: 25px;
    background-color: red;
    padding: 3px;
}

@media (max-width: 1000px) {
    ul{
        grid-template-columns: repeat(auto-fit, minmax(500px, auto));
    }
}
@media (max-width: 700px) {
    ul{
        grid-template-columns: repeat(auto-fit, minmax(400px, auto));
    }
}
@media (max-width: 500px) {
    ul{
        grid-template-columns: repeat(auto-fit, minmax(300px, auto));
    }
}
</style>
