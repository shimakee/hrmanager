<template>
    <div>
        <h2>Address</h2>
        <add-address :showMap="true"
                        :autoLocate="autoLocate"/>
        <show-address v-if="address"
                        :autoLocate="autoLocate"
                        :autoAddress="true"
                        :editable="true"
                        :showMap="true"
                        :address="address"/>

    </div>
</template>
<script>
import ShowAddress from "./showAddress";
import AddAddress from "./addAddress";

export default {
    components:{
        "show-address":ShowAddress,
        "add-address":AddAddress
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
    }
    ,computed:{
        autoLocate(){
            const AUTO_LOCATE = this.$store.getters.getAllowAutoLocate;
            return AUTO_LOCATE;
        },
        address(){
            let results = this.$store.getters.getAddress;
            return results;
        },
        accountType(){
            return this.$store.getters.getAccountType;
        }
    }
}
</script>
<style scoped>
#map, #map2, #map3{
    height:500px;
}
</style>
