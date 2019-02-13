<template>
    <div>
        <!-- <router-view name="addressAdd"
                    :showMap="true"
                    :autoLocate="autoLocate"/>
        <router-view name="addressShow"
                    v-if="address"
                    :autoLocate="autoLocate"
                    :autoAddress="true"
                    :editable="editable"
                    :showMap="true"
                    :address="address" /> -->
        <address-add    :showMap="true"
                        :autoLocate="autoLocate"/>
        <address-show v-if="address"
                        :autoLocate="autoLocate"
                        :autoAddress="true"
                        :editable="editable"
                        :showMap="true"
                        :address="address"/>

    </div>
</template>
<script>
import AddressShow from "./addressShow";
import AddressAdd from "./addressAdd";

export default {
    props:{
        editable:{type: Boolean, default: false},

    },
    components:{
        "address-show":AddressShow,
        "address-add":AddressAdd
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
