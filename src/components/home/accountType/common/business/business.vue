<template>
    <div>
        <business-add />
        <business-show />

    </div>
</template>
<script>
import BusinessAdd from "./businessAdd";
import BusinessShow from "./businessShow";

export default {
    props:{
        editable:{type: Boolean, default: false},

    },
    components:{
        "business-add":BusinessAdd,
        "business-show":BusinessShow
    }
    ,computed:{
        accountType(){
            return this.$store.getters.getAccountType;
        }
    }
}
</script>
<style scoped>
</style>
