<template>
    <div>
        <h2>Address</h2>
        <show-address v-if="address"   :editable="true"
                        :showMap="false"
                        :address="address" 
                        :editAddress="editAddress"/>
        <add-address :showMap="false"/>

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
            editAddress: {},
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
        address(){
            let results = this.$store.getters.getAddress;

            for (const key in results) {//assing key value pairs for editable
                if (results.hasOwnProperty(key)) {
                    const element = results[key];
                    this.$set(this.editAddress, key, false);//using this.$set so that it will be observable and component wil rerender
                }
            }

            return results;
        },
        accountType(){
            return this.$store.getters.getAccountType;
        }
    }
    // ,beforeMount(){
    //     let localAddress = JSON.parse(localStorage.getItem('address'));

    //     if(localAddress){
    //         this.$store.commit('setAddress', localAddress);
    //     }else{
    //         this.$store.dispatch('getAddress').then(res=>{
    //             localStorage.setItem('address', JSON.stringify(res));
    //             this.$store.commit('setAddress', res);
    //         });
    //     }
    // }
}
</script>
<style scoped>
#map, #map2, #map3{
    height:500px;
}
</style>
