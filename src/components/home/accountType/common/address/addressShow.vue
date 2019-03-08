<template>
    <div>
        <ul>
            <li v-for="(item, key) in address" v-bind:key="key" class="card-address"
                @click="chooseItem(item._id)" :class="{highlight: item._id == itemActive}">
                
                <!--only show form if allowed as editable & in edit mode-->
                <!--TODO create slotable form card-->
                <div v-if="item._id == itemActive && itemEdit && editable" class="card-content">

                        <address-form :item="item"
                            :updateAddress="updateAddress"/>

                        <span class="edit"
                            v-if="editable && itemEdit && itemActive == item._id && editable"
                            @click="cancelEdit">Cancel</span>
                </div>

                <!--show address cards-->
                <!--TODO create slotable address card-->
                <div v-else :class="{mainAddress: item.main == true}" class="card-content center">
                        <address-detail :item="item" />

                    <span class="edit"
                    v-if="editable && !itemEdit && itemActive == item._id && editable"
                    @click="itemEdit = true">Edit</span>

                </div>

                <google-maps   class="showMap"
                            :selector="'mapShow'+item._id"
                            :showMap="showMap"
                            :label="item.description" 
                            :editable="allowEdit" 
                            :position="item.position"
                            :autoLocate="autoLocate"
                            @update:position="item.position = (itemEdit ? $event.position: addressModel.position)"
                            @update:address="setItem(item, $event)"
                        />

                <!--only show edit button if editable-->
                <span class="delete"
                    v-if="!itemEdit && itemActive == item._id && editable"
                    @click="deleteAddress(item._id)">X</span>
            </li>
        </ul>

    </div>
</template>
<script>
import Maps from "../../../../parts/googleMap";
import AddressDetail from "./addressDetail";
import AddressForm from "./addressForm";

export default {
    props:{
        showMap:{default: false, type:Boolean},
        editable:{default: false, type: Boolean}, //determines if you are able to edit the address here
        address:{type: Array}, //array of address to show
        autoLocate:{default: false, type: Boolean}, //activate geolocation
        autoAddress:{default: false, type: Boolean} //allow change input value on address based on googlemap marker
    },
    components:{
        "google-maps":Maps,
        "address-detail": AddressDetail,
        "address-form": AddressForm
    },
    computed:{
        allowEdit(){
            if(this.editable && this.itemEdit){//only set markers if editable is true and component is on edit mode
                return true
            }else{
                return false
            }
        }
    },
    data(){
        return {
            addressModel:{
                        // main: false,
                        // description:"",
                        // street:"",
                        // city:"",
                        // country: "",
                        // province:"",
                        // zipcode:"",
                        position:{
                            lat: null,
                            lng: null
                        }},
            itemActive: null,
            itemEdit: false
        }
    },
    methods:{
        updateAddress(data){
            this.$store.dispatch('updateAddress', data)
                .then(res=>{
                    this.itemEdit = false;

                    this.$store.dispatch('getAddress').then(res=>{
                        this.$store.commit('setInfoMessage', res.data.message);
                    });
                }).catch(err=>{
                    console.log(err);

                    this.$store.commit('setErrorMessage', err.response.statusText);
                });
        },
        deleteAddress(data){
            this.$store.dispatch('deleteAddress', data)
                .then(res=>{
                    this.$store.dispatch('getAddress').then(res=>{
                        this.$store.commit('setInfoMessage', "Success");
                    });
                }).catch(err=>{
                    
                    this.$store.commit('setErrorMessage', err.response.statusText);
                });
        },
        setItem(item, event){//set new values for auto address from googlemaps
            if(this.itemEdit && this.autoAddress){
                if(event.address.route){item.street = event.address.route.long_name;}
                if(event.address.city){item.city = event.address.city.long_name;}
                if(event.address.province){item.province = event.address.province.long_name;}
                if(event.address.country){item.country = event.address.country.long_name;}
                if(event.address.zipcode){item.zipcode = event.address.zipcode.long_name;}
                else{item.zipcode = "";}
            }
        },
        chooseItem(item){
            // this.itemEdit = false;
            this.itemActive = item;
        },
        cancelEdit(){
            this.itemEdit = false;
            this.$store.dispatch('getProfile'); //to update the computed address array -TODO: base it on account type
        }
    }
}
</script>
<style scoped>
.showMap{
    height: 300px;

}

/*====highlight======*/

.highlight{
    outline: 3px rgb(59, 71, 231) solid;
}
.edit{
    color: blue;
    text-shadow: 0 0 3px white;
    /* float: right; */
    /* bottom: 10px; */
    /* right: 30px; */
    /* position:absolute; */
    cursor: pointer;
    /* background: white; */
    padding: 5px;
    /* font-weight: bolder; */
    text-align: center;
}
.delete{
    color: white;
    text-shadow: 0 0 3px white;
    /* float: right; */
    top: -15px;
    right: -10px;
    position:absolute;
    background-color: rgb(224, 68, 68);
    padding: 5px 5px;
    border-radius: 30px;
    cursor: pointer;
}

/*=====card======*/
li.card-address{
    list-style: none;
    position: relative;
    margin: 20px;
}
.card-content{
    padding: 10px;
    /* text-align: center; */
}
/*=====main address=====*/
.mainAddress h3, .mainAddress p,
.card-content h3, .card-content p{
    margin: 10px;
}
.mainAddress{
    background-color: lightgrey;
    color: white;
    text-shadow: 0 0 3px black;
}
#map, #map2, #map3{
    height:500px;
}
.center{
    text-align: center;
}

/*==========================FORM===================================*/
ul{
    max-width: 1000px;
}
/* ul{
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, auto));
    grid-gap: 10px;
    padding: 0;
} */
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


@media (max-width: 700px) { /*mobile*/
    .label-group,
    .form-group{
        grid-template-columns: 1fr;
    }
    ul{
        padding: 0px;
        margin: 0px;
    }
    .input-group{   
        grid-template-columns: 1fr;
    }
}
</style>
