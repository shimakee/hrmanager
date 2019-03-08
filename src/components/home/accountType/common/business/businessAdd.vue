<template>
    <div>
        <h2>Business add</h2>

         <form class="form-container">
            <div class="form-group">
                    <span class="label-group">
                        <label>tradename: </label>
                        <input type="text" v-model="businessModel.tradename" placeholder="tradename">
                    </span>
            </div>
            <!-- <div> -->
                <label class="label-group">
                    <label>Address: </label>
                    <input type="text" v-model="businessModel.address.street" placeholder="street">
                </label>
            <!-- </div> -->
            <div class="form-group">
                <span class="label-group">
                    <label>City: </label>
                    <input type="text" v-model="businessModel.address.city" placeholder="city">
                </span>
                <span class="label-group">
                    <label>Province: </label>
                    <input type="text" v-model="businessModel.address.province" placeholder="province">
                </span>
            </div>
            
            <div class="form-group">
                <label class="label-group">
                    <label>Country: </label>
                    <input type="text" v-model="businessModel.address.country" placeholder="country">
                </label>
                <label class="label-group">
                    <label>Zipcode: </label>
                    <input type="number" v-model="businessModel.address.zipcode" placeholder="zipcode">
                </label>
            </div>
            


                <!-- <google-maps    class="addressMap"
                                :showMap="showMap"
                                :selector="'addresMap'"
                                :label="addressModel.description" 
                                :editable="true"
                                :autoLocate="autoLocate"
                                @update:position="addressModel.position = $event.position"
                                @update:address="setAddressModel"
                />
            <div class="input-group">
                <span class="form-group">
                    <label class="label-group">
                        <label>Latitude: </label>
                        <input type="text" v-model="addressModel.position.lat" placeholder="country">
                    </label>
                    <label class="label-group">
                        <label>Longitude: </label>
                        <input type="number" v-model="addressModel.position.lng" placeholder="zipcode">
                    </label>
                </span>
            </div> -->

            <button @click.prevent="submit">send</button>
        </form>
    </div>
</template>
<script>
// import Maps from "../../../../parts/googleMap";

export default {
    // props:{
    //     showMap: {default: true, type: Boolean},
    //     autoLocate: {default: false, type: Boolean}
    // },
    // components:{
    //     "google-maps":Maps
    // },
    data(){
        return {
            businessModel:{
                tradename: null,
                address:{
                    city: null,
                    country: null,
                    province: null,
                    street: null,
                    zipcode: null
                }
            }
        }
    },
    methods:{
        submit(){
            this.$store.dispatch("addBusiness", this.businessModel)
                .then(res=>{
                    console.log(res);
                }).catch(err=>{
                    console.log(err);
                });
        }
    }
}
</script>
<style scoped>

.addressMap{
    height: 300px;
}
#map, #map2, #map3{
    width: 100%;
    /* height:500px; */
}

.mapPosition{
    /* position: absolute; */
    /* bottom:  50px; */
    opacity: .5;
    max-width: 200px;
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
    position: relative;
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
