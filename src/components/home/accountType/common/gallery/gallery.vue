<template>
    <div> 
        <h3>Upload</h3>
        <form>
            <input type="file" @change="fileSelected">
            <input type="text" v-model="form.imgName">
            <button @click.prevent="submit()">Upload</button>
        </form>

        <br>
        <span class="error" v-if="errorMessage">
            {{errorMessage}}
        </span>
        <span class="info" v-if="infoMessage">
            {{infoMessage}}
        </span>

        <!--GALLERY-->
        <show-gallery></show-gallery>
        
        <!--TODO: EDIT gallery - to be able to choose main profile picture-->
        
        
    </div>
</template>
<script>
import ShowGallery from "./showGallery";

export default {
    components:{
        "show-gallery": ShowGallery
    },
    data(){
        return{
            form:{
                imgField:null,
                imgName: 'Image name'
            }
        }
    },
    computed:{
        // pics(){ //TODO: make na new component for gallery
        //     let pics = this.$store.getters.getPics;

        //     if(!pics){
        //         pics = JSON.parse(localStorage.getItem("pics"));
        //     }
            
        //     return pics;
        // },
        errorMessage(){
            return this.$store.getters.getErrorMessage;
        },
        infoMessage(){
            return this.$store.getters.getInfoMessage;
        }
    },
    methods:{
        submit(){
            const data = this.form;
            
                if(!data){
                    this.$store.commit('setInfoMessage', 'Error: no file was attached.');
                }else{
                    this.$store.dispatch('uploadPic', {url:'/file/photo/me', file: data})
                        .then(res=>{
                            this.$store.commit('setInfoMessage', res.data.message);

                            this.$store.dispatch('maintainData'); //to update the computed pics array

                        }).catch(err=>{ 
                            this.$store.commit('setErrorMessage', err.response.statusText);
                        });
                }
        },
        fileSelected(e){//attach file to data
            const file = e.target.files[0];
            this.form.imgField = file;
        }
    },
    mounted(){
        this.$store.dispatch('clearDisplayMessages');
    }
}
</script>
<style scoped>

.error{
    color: red;
    text-align: center;
}
.info{
    color:white;
    text-align: center;
}

</style>
