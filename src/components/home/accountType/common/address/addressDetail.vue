<template>
    <div>

        <!-- <div v-if="form" class="form-container">
            <div class="form-group">
                    <span class="label-group">
                        <input type="checkbox" v-model="item.main" value="true">
                        <label>Main address</label>
                    </span>
                    <span class="label-group">
                        <label>Description: </label>
                        <input type="text" v-model="item.description" placeholder="address description">
                    </span>
            </div>
            <div>
                <label class="label-group">
                    <label>Street: </label>
                    <input type="text" v-model="item.street" placeholder="street">
                </label>
            </div>
            <div class="form-group">
                <span class="label-group">
                    <label>City: </label>
                    <input type="text" v-model="item.city" placeholder="city">
                </span>
                <span class="label-group">
                    <label>Province: </label>
                    <input type="text" v-model="item.province" placeholder="province">
                </span>
            </div>
            
            <div class="input-group">
                <label class="label-group">
                    <label>Country: </label>
                    <input type="text" v-model="item.country" placeholder="country">
                </label>
                <label class="label-group">
                    <label>Zipcode: </label>
                    <input type="number" v-model="item.zipcode" placeholder="zipcode">
                </label>
            </div>

            <div class="input-group">
                <label class="label-group">
                    <label>Latitude: </label>
                    <input type="number" v-model="item.position.lat" placeholder="Latitude">
                </label>
                <label class="label-group">
                    <label>Longitude: </label>
                    <input type="number" v-model="item.position.lng" placeholder="Longitude">
                </label>
            </div>
        </div> -->
        <div>
             <h3>{{item.description}}</h3>
            <p> {{item.street}} , {{item.city}} </p>
            <p> {{item.zipcode}} {{item.province}} </p>
            <p> {{item.country}} </p>
            <p v-if="item.position && item.position.lat && item.position.lng"> lat: {{item.position.lat}}, lng: {{item.position.lng}}</p>
        </div>
    </div>
</template>
<script>
import Maps from "../../../../parts/googleMap";

export default {
    props:{
        item:{default: null, type: Object}, //address to show
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
