<template>
    <div>
        <h2>Address add</h2>
        <!-- <form>
            <input type="checkbox" v-model="addressModel.main" value="true">
            <input type="text" v-model="addressModel.description" placeholder="address description">
            <br>
            <input type="text" v-model="addressModel.street" placeholder="street">
            <input type="text" v-model="addressModel.city" placeholder="city">
            <input type="text" v-model="addressModel.province" placeholder="province">
            <input type="text" v-model="addressModel.country" placeholder="country">
            <input type="number" v-model="addressModel.zipcode" placeholder="zipcode">

            <button @click.prevent="submit">send</button>
        </form> -->

         <form class="form-container">
            <div class="form-group">
                    <span class="label-group">
                        <input type="checkbox" v-model="addressModel.main" value="true">
                        <label>Main address</label>
                    </span>
                    <span class="label-group">
                        <label>Description: </label>
                        <input type="text" v-model="addressModel.description" placeholder="address description">
                    </span>
            </div>
            <div>
                <label class="label-group">
                    <label>Street: </label>
                    <input type="text" v-model="addressModel.street" placeholder="street">
                </label>
            </div>
            <div class="form-group">
                <span class="label-group">
                    <label>City: </label>
                    <input type="text" v-model="addressModel.city" placeholder="city">
                </span>
                <span class="label-group">
                    <label>Province: </label>
                    <input type="text" v-model="addressModel.province" placeholder="province">
                </span>
            </div>
            
            <div class="input-group">
                <label class="label-group">
                    <label>Country: </label>
                    <input type="text" v-model="addressModel.country" placeholder="country">
                </label>
                <label class="label-group">
                    <label>Zipcode: </label>
                    <input type="number" v-model="addressModel.zipcode" placeholder="zipcode">
                </label>
            </div>

            <!-- <google-maps    :showMap="showMap"
                            :selector="'mapForm'"
                            :label="addressModel.description" 
                            :editable="true" 
                            @update:position="addressModel.position = $event.position"
                            @update:address="setAddressModel"/> -->

            <button @click.prevent="submit">send</button>
        </form>
    </div>
</template>
<script>
import Maps from "../../../../parts/googleMap";

export default {
    // props:{
    //     showMap: {default: true, type: Boolean}
    // },
    // components:{
    //     "google-maps":Maps
    // },
    data(){
        return {
            addressModel:{main: false,
                        description:"",
                        street:"",
                        city:"",
                        province:"",
                        country:"",
                        zipcode:"",
                        position:{
                            lat: null,
                            lng: null
                        }}
                    
        }
    },
    methods:{
        clearAddressModel(){
            this.addressModel.main = false;
            this.addressModel.description = "";
            this.addressModel.street = "";
            this.addressModel.city = "";
            this.addressModel.province = "";
            this.addressModel.country = "";
            this.addressModel.zipcode = "";
        }
        ,submit(){

            this.$store.dispatch('addAddress', this.addressModel)//submit to backend
                .then(response=>{
                    this.$store.dispatch('getProfile'); //to update the computed pics array

                    this.clearAddressModel();//empty form
                });
        },
        setAddressModel(event){//autofill form based on googlemap marker
            if(event.address.route.long_name){ this.addressModel.street = event.address.route.long_name;}
            if(event.address.city.long_name){ this.addressModel.city = event.address.city.long_name;}
            if(event.address.province.long_name){ this.addressModel.province = event.address.province.long_name;}
            if(event.address.country.long_name){ this.addressModel.country = event.address.country.long_name;}
            if(event.address.zipcode.long_name){ this.addressModel.zipcode = event.address.zipcode.long_name;}
        }
    }
}
</script>
<style scoped>
#map, #map2, #map3{
    height:500px;
}

/*==========================FORM===================================*/
ul{
    max-width: 1000px;
}
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
