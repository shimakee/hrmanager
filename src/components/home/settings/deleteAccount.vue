<template>
    <div>
        <form>
            <label for="password">Delete Account: </label>
            <button @click="submit">Send</button>
        </form>
    </div>
</template>
<script>
export default {
    methods:{
        submit(event){
            event.preventDefault();

            let confirm = window.confirm('Delete account?');
            if(confirm){
                this.$store.dispatch('deleteAccount')
                    .then(res=>{
                        this.$store.dispatch('logout');
                    }).catch(err=>{ 
                    
                    });
            }
        }
    }

}
</script>
<style scoped>

</style>
