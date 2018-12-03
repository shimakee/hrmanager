<template>
    <div>
        <!-- <form> -->
            <input type="file" @change="fileSelected">
            <input type="text" v-model="form.imgName">
            <button @click.prevent="submit()">Upload</button>
        <!-- </form> -->
    </div>
</template>
<script>
export default {
    data(){
        return{
            form:{
                imgField:null,
                imgName: 'Image name'
            }
        }
    },
    methods:{
        submit(){
            const data = this.form;
            console.log(data);
            // let confirm = window.confirm('Delete account?');
            // if(confirm){
                if(!data){
                    console.log('error, no file was attached');
                }else{
                    console.trace('file', data);
                    this.$store.dispatch('uploadPic', {url:'/file/photo/me', file: data})
                        .then(res=>{
                            console.log(res);
                        }).catch(err=>{ 
                            console.log(err);
                        });
                }
            // }
            console.log('submit');
        },
        fileSelected(e){//attach file to data
            const file = e.target.files[0];
            this.form.imgField = file;
            console.log('changed');
        }
    }

}
</script>
<style scoped>

</style>
