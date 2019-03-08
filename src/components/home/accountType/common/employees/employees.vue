<template>
    <div>
        <employees-add />
        <employees-show />

    </div>
</template>
<script>
import EmployeesAdd from "./employeesDetail";
import EmployeesShow from "./employeesShow";

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
