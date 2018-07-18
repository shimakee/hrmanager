<template>
    <div>
        <h2>Profile</h2>
        <form>
            <div class="formGroup">
                <select v-model="formProfile.civilStatus" id="">
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="annulled">Annuled</option>
                    <option value="widowed">Widowed</option>
                </select>
            </div>

            <div class="formGroup">
                <label>male</label>
                <input type="radio" v-model="formProfile.gender" value="male">
                <label>female</label>
                <input type="radio" v-model="formProfile.gender" value="female">
            </div>
            
            <div class="formGroup">
                <label>name:</label>
                <input type="text" v-model="formProfile.name.first" placeholder="first">
                <input type="text" v-model="formProfile.name.middle" placeholder="middle">
                <input v-if="formProfile.gender === 'female' && formProfile.civilStatus !== 'single'"
                    type="text" v-model="formProfile.name.maiden" placeholder="maiden">
                <input type="text" v-model="formProfile.name.last" placeholder="last">
                <input type="text" v-model="formProfile.name.suffix" placeholder="suffix">
            </div>

            <div class="formGroup">
                <input type="date" v-model="formProfile.birthdate">
            </div>

            <div class="formGroup">
                <h2>Add parents and spouse here</h2>
            </div>

            <div class="formGroup">
                <label>email:</label>
                <input type="checkbox" v-model="emailModel.main" value="true">
                <input type="text" v-model="emailModel.address" placeholder="email@sample.com">
                <button @click="addEmail">Add</button>
            </div>

            <div v-for="item in formProfile.email">
                {{item}}
            </div>

            <div class="formGroup">
                <label>contact:</label>
                <input type="checkbox" v-model="contactModel.main" value="true">
                <input type="text" v-model="contactModel.description" placeholder="description">
                <input type="number" v-model="contactModel.countryCode" placeholder="country code">
                <input type="number" v-model="contactModel.areaCode" placeholder="area code">
                <input type="number" v-model="contactModel.number" placeholder="number">
                <button @click="addContact">Add</button>
            </div>

            <div v-for="item in formProfile.contact">
                {{item}}
            </div>

            <div class="formGroup">
                <label>address:</label>
                <input type="checkbox" v-model="addressModel.main" value="true">
                <input type="text" v-model="addressModel.description" placeholder="email@sample.com">
                <input type="text" v-model="addressModel.street" placeholder="main">
                <input type="text" v-model="addressModel.city" placeholder="email@sample.com">
                <input type="text" v-model="addressModel.province" placeholder="main">
                <input type="text" v-model="addressModel.zipcode" placeholder="main">
                <button @click="addAddress">Add</button>
            </div>

            <div v-for="item in formProfile.address">
                {{item}}
            </div>

            <div class="formGroup">
                <label>government:</label>
                <input type="text" v-model="govModel.key" placeholder="key">
                <input type="number" v-model="govModel.number" placeholder="number">
                <button @click="addGovernment">Add</button>
            </div>

            <div v-for="item in formProfile.government">
                {{item}}
            </div>

            <button @click="submit">Send</button>
        </form>
    </div>
</template>
<script>
export default {
    data(){
        return {
            edit: false,
            formProfile:{ name:{first: "",
                                middle: "",
                                maiden:"",
                                last: "",
                                suffix: "" },
                        civilStatus: "single",
                        gender: "male",
                        birthdate:"",
                        email: [],
                        contact: [],
                        address: [],
                        government: [] },
            emailModel:{main: "",
                    address: "" },
            contactModel:{main: "",
                        description:"",
                        countryCode:"",
                        areaCode:"",
                        number:""},
            addressModel:{main: "",
                        description:"",
                        street:"",
                        city:"",
                        province:"",
                        zipcode:""},
            govModel:{key:"",
                    number:""}
                    
        }
    },
    methods:{
        submit(event){
            event.preventDefault();

            this.edit = false;
            console.log(this.formProfile);
        },
        addEmail(event){
            event.preventDefault();

            this.formProfile.email.push({
                main:this.emailModel.main,
                address:this.emailModel.address
            });
            this.emailModel.main="";
            this.emailModel.address="";
        },
        addContact(event){
            event.preventDefault();

            this.formProfile.contact.push({
                main:this.contactModel.main,
                description:this.contactModel.description,
                countryCode:this.contactModel.countryCode,
                areaCode:this.contactModel.areaCode,
                number:this.contactModel.number
            });

            this.contactModel.main = ""
            this.contactModel.description = ""
            this.contactModel.countryCode = ""
            this.contactModel.areaCode = ""
            this.contactModel.number = ""
        },
        addAddress(event){
            event.preventDefault();

            this.formProfile.address.push({
                main:this.addressModel.main,
                description:this.addressModel.description,
                street:this.addressModel.street,
                city:this.addressModel.city,
                province:this.addressModel.province,
                zipcode:this.addressModel.zipcode
            });

            this.addressModel.main = "",
            this.addressModel.description = "",
            this.addressModel.street = "",
            this.addressModel.city = "",
            this.addressModel.province = "",
            this.addressModel.zipcode = ""
        },
        addGovernment(event){
            event.preventDefault();

            this.formProfile.government.push({
                key:this.govModel.key,
                number:this.govModel.number
            });
            this.govModel.key="";
            this.govModel.number="";
        }
    },
    computed:{
        profile(){
            return this.$store.getters.getProfile;
        }
    },
}
</script>
<style scoped>
.profile{
    display: grid; 
    grid-template-columns: 1fr 4fr;
}
.avatar-container{
    /* position:relative; */
    padding:.5em;
    margin:1.5em;
    text-align: center;
    float: left;
    /* width:20vw; */
}
.avatar{
    border-radius: 20em;
}
.info{
    list-style: none;
    text-align: center;
}
.posts{
    position:relative;
    display:block;
}
</style>
