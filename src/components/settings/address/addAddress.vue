<template>
    <div>
        <h2>Address add</h2>
        <form>
            <input type="checkbox" v-model="addressModel.main" value="true">
            <input type="text" v-model="addressModel.description" placeholder="address description">
            <br>
            <input type="text" v-model="addressModel.street" placeholder="street">
            <input type="text" v-model="addressModel.city" placeholder="city">
            <input type="text" v-model="addressModel.province" placeholder="province">
            <input type="text" v-model="addressModel.country" placeholder="country">
            <input type="number" v-model="addressModel.zipcode" placeholder="zipcode">

            <google-maps    :showMap="showMap"
                            :selector="'mapForm'"
                            :label="addressModel.description" 
                            :editable="true" 
                            @update:position="addressModel.position = $event.position"
                            @update:address="setAddressModel"/>

            <button @click="submit">send</button>
        </form>
    </div>
</template>
<script>
import Maps from "../googleMap";

export default {
    props:{
        showMap: {default: true, type: Boolean}
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
                        country:"",
                        zipcode:"",//TODO add country
                        position:{
                            lat: null,
                            lng: null
                        }}
                    
        }
    },
    methods:{
        submit(event){
            event.preventDefault();

            this.$store.dispatch('addAddress', this.addressModel)
                .then(response=>{
                    this.$store.dispatch('getAddress').then(res=>{
                        localStorage.setItem('address', JSON.stringify(res));
                        this.$store.commit('setAddress', res);
                    });

                    this.addressModel.main = false;
                    this.addressModel.description = "";
                    this.addressModel.street = "";
                    this.addressModel.city = "";
                    this.addressModel.province = "";
                    this.addressModel.country = "";
                    this.addressModel.zipcode = "";
                });
        },
        setAddressModel(event){
                    this.addressModel.street = event.address.route.long_name;
                    this.addressModel.city = event.address.city.long_name;
                    this.addressModel.province = event.address.province.long_name;
                    this.addressModel.country = event.address.country.long_name;
                    if(event.address.zipcode){
                        this.addressModel.zipcode = event.address.zipcode.long_name;
                    }
        }
    }
}
</script>
<style scoped>
#map, #map2, #map3{
    height:500px;
}
</style>
