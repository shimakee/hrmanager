<template>
    <div>
        <h2>Government</h2>
        <form>
            <div class="formGroup">
                <label>government:</label>
                <input type="text" v-model="govModel.key" placeholder="key">
                <input type="number" v-model="govModel.number" placeholder="number">
                <button @click="addGovernment">Add</button>
            </div>

            <div v-for="(item, key) in government" v-bind:key="key">
                {{item}}
            </div>
        </form>
    </div>
</template>
<script>
export default {
    data(){
        return {
            govModel:{key:"",
                    number:""},
            government:[]
                    
        }
    },
    methods:{
        submit(event){
            event.preventDefault();

            //axios actions
        },
        addGovernment(event){
            event.preventDefault();

            this.government.push({
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
