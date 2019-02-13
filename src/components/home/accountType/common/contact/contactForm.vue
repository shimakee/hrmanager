<template>
    <div  
            class="contact-form">
        <form class="form-container">
            <!-- <contact-detail
                :item="item"
                :form="true" 
                :submit="submit"
                /> -->
                <span :class="{main: item.main, notMain: !item.main}"
                        @click="item.main = !item.main"></span>
                <br>
            <div class="input-group">
                <!-- <label>Main contact: </label> -->
                <!-- <input type="checkbox" v-model="item.main" value="true"> -->

                <label>Description: </label>
                <input type="text" v-model="item.description" placeholder="contact description">
            </div>
            <div class="input-group">
                <label>Country code: </label>
                <input type="number" v-model="item.countryCode" placeholder="country code">

            </div>
            <div class="input-group">
                <label>Area code: </label>
                <input type="number" v-model="item.areaCode" placeholder="area code">

            </div>
            <div class="input-group">

                <label>Number: </label>
                <input type="number" v-model="item.number" placeholder="number">
            </div>

            <button @click.prevent="submit(item)">Update</button>  
        </form>
    </div>
</template>
<script>
export default {
    props:{
        item:{default: null, type: Object}, //address to show
        submit: {type: Function}
    }
}
</script>
<style scoped>

.chosen{
    outline: solid 3px blue;
}
.main:hover,.notMain:hover{
    cursor: pointer;
}
.main{
    position: absolute;
    background-color: green;
    border: blue solid 3px;
    padding: 10px;
    border-radius: 20px;
}
.notMain{
    position: absolute;
    background-color: red;
    border: blue solid 3px;
    padding: 10px;
    border-radius: 20px;
}
/* ul.contact-gallery{
    list-style: none;
    display: block;
} */
ul{
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, auto));
    grid-gap: 10px;
    padding: 0;
}
li.contact-card{
    background-color: grey;
    padding: 15px 20px 10px 20px;
    position: relative;
    /* margin: 10px; */
    max-width: fit-content;
    min-width: 250px;
}
li .edit{
    position:absolute;
    top: 10px;
    right: 15px;
    color: blue;
    font-weight: bolder;
}
li .delete{
    position: absolute;
    top: -15px;
    right: -10px;
    background-color: red;
    color: white;
    font-weight: bolder;
    border-radius: 15px;
    padding: 5px;
}
li input{
    max-width: fit-content;
}

/*=======FORM========*/


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

</style>
