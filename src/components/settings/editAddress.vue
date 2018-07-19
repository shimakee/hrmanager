<template>
    <div>
        <h2>Address</h2>
        <form>
            <input type="checkbox" v-model="addressModel.main" value="true">
            <input type="text" v-model="addressModel.description" placeholder="address description">
            <br>
            <input type="text" v-model="addressModel.street" placeholder="street">
            <input type="text" v-model="addressModel.city" placeholder="city">
            <input type="text" v-model="addressModel.province" placeholder="province">
            <input type="number" v-model="addressModel.zipcode" placeholder="zipcode">
            <button @click="submit">send</button>
        </form>

        
        <ul>
            <li v-for="(item, key) in addresss" v-bind:key="key" class="card-address">
                <div v-if="!edit[key]">
                    {{item.main}} {{key}}
                    <h3>{{item.description}}</h3>
                    <p> {{item.street}} , {{item.city}} </p>
                    <p> {{item.zipcode}}, {{item.province}} </p>
                    <button @click="edit[key] = true">Edit</button>
                </div>
                <div v-else>
                    <form>
                        <input type="checkbox" v-model="item.main" value="true">
                        <input type="text" v-model="item.description" placeholder="address description">
                        <input type="text" v-model="item.street" placeholder="street">
                        <input type="text" v-model="item.city" placeholder="city">
                        <input type="text" v-model="item.province" placeholder="province">
                        <input type="number" v-model="item.zipcode" placeholder="zipcode">
                        <button @click.prevent="updateAddress(item), edit[key] = false">send</button>
                    </form>
                </div>
            </li>
        </ul>
        
    </div>
</template>
<script>
export default {
    data(){
        return {
            edit: {},
            addressModel:{main: false,
                        description:"",
                        street:"",
                        city:"",
                        province:"",
                        zipcode:""}
                    
        }
    },
    computed:{
        addresss(){
            let results = this.$store.getters.getAddress;
            for (const key in results) {
                if (results.hasOwnProperty(key)) {
                    const element = results[key];
                    this.$set(this.edit, key, false);//using this.$set so that it will be observable and component wil rerender
                }
            }

            return this.$store.getters.getAddress;
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
                });
        },
        updateAddress(data){

            this.$store.dispatch('sendCommit', {url:`/profile/me/address?id=${data._id}`, method: 'put', data: data})//TODO move to store as dispatch action
                .then(response=>{
                    this.$store.dispatch('getAddress').then(res=>{
                        localStorage.setItem('address', JSON.stringify(res));
                        this.$store.commit('setAddress', res);
                    });
                }).catch(err=>{
                    console.log('err', err);
                });
        }
    },
    beforeMount(){
        let localAddress = JSON.parse(localStorage.getItem('address'));

        if(localAddress){
            this.$store.commit('setAddress', localAddress);
        }else{
            this.$store.dispatch('getAddress').then(res=>{
                localStorage.setItem('address', JSON.stringify(res));
                this.$store.commit('setAddress', res);
            });
        }
    }
}
</script>
<style scoped>
</style>
