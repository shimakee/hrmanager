<template>
    <div>
        <h2>Address edit</h2>

        <ul>
            <li v-for="(item, key) in address" v-bind:key="key" class="card-address">
                
                <!--only show form if allowed as editable & in edit mode-->
                <!--TODO create slotable form card-->
                <div v-if="editAddress[key] && editable">
                    <form>
                        <input type="checkbox" v-model="item.main" value="true">
                        <input type="text" v-model="item.description" placeholder="address description">
                        <input type="text" v-model="item.street" placeholder="street">
                        <input type="text" v-model="item.city" placeholder="city">
                        <input type="text" v-model="item.province" placeholder="province">
                        <input type="number" v-model="item.zipcode" placeholder="zipcode">

                        
                        <google-maps    :selector="'map'+key"
                                        :showMap="showMap"
                                        :label="item.description" 
                                        :editable="true" 
                                        :position="item.position" 
                                        @update:position="item.position = $event.position"/>
                        <button @click.prevent="updateAddress(item), editAddress[key] = false">send</button>
                    </form>
                </div>

                <!--show address cards-->
                <!--TODO create slotable address card-->
                <div v-else>
                    {{item.main}} {{key}}
                    <h3>{{item.description}}</h3>
                    <p> {{item.street}} , {{item.city}} </p>
                    <p> {{item.zipcode}}, {{item.province}} </p>

                     <!--only show edit button if editable-->
                    <button v-if="editable"
                            @click="editAddress[key] = true">Edit</button>

                    <button @click="deleteAddress(item._id)">Delete</button>
                    
                     <google-maps   :selector="'map'+key"
                                    :showMap="showMap"
                                    :label="item.description" 
                                    :editable="false" 
                                    :position="item.position"/>
                    
                </div>
            </li>
        </ul>

    </div>
</template>
<script>
import Maps from "../googleMap";

export default {
    props:{
        showMap:{default: true, type:Boolean},
        editable:{default: false, type: Boolean}, //determines if you are able to edit the address here
        address:{type: Array}, //address to show
        editAddress:{type:Object} //on edit boolean pair for each address
    }
    ,components:{
        "google-maps":Maps
    },
    data(){
        return {
            addressModel:{main: false,
                        description:"",
                        street:"",
                        city:"",
                        province:"",
                        zipcode:"",
                        position:{
                            lat: null,
                            lng: null
                        }}
        }
    },
    methods:{
        updateAddress(data){ //TODO move this in store dispatch action
            this.$store.dispatch('sendCommit', {url:`/profile/me/address?id=${data._id}`, method: 'put', data: data})//TODO move to store as dispatch action
                .then(response=>{
                    this.$store.dispatch('getAddress').then(res=>{
                        localStorage.setItem('address', JSON.stringify(res));
                        this.$store.commit('setAddress', res);
                    });
                }).catch(err=>{
                    console.log('err', err);
                });
        },
        deleteAddress(data){//move this in store dispatch action
            this.$store.dispatch('sendCommit', {url:`/profile/me/address?id=${data}`, method:'delete', data:null} )
            .then(response=>{
                this.$store.dispatch('getAddress').then(res=>{
                        localStorage.setItem('address', JSON.stringify(res));
                        this.$store.commit('setAddress', res);
                    });
            }).catch(err=>{
                console.log('err', err);
            });
        }
    }
}
</script>
<style scoped>
#map, #map2, #map3{
    height:500px;
}
</style>
