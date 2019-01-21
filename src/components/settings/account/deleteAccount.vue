<template>
    <div>
        <form>
            <!-- <label for="password">Delete Account: </label> -->
            <span>Delete Account:</span>
            <button @click.prevent="submit">Delete Account</button>
        </form>
    </div>
</template>
<script>
export default {
    methods:{
        submit(){
            let confirm = window.prompt('Delete account?');
            if(confirm == "delete"){
                this.$store.dispatch('deleteAccount')
                    .then(res=>{
                        this.$store.dispatch('logout');
                    }).catch(err=>{ 
                    
                    });
            }else{
                console.log("delete canceled.");
            }
        }
    }

}
</script>
<style scoped>
div{
    margin: 1em;
}
</style>
