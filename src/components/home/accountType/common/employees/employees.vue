<template>
    <div>
        <employee-show />
    </div>
</template>
<script>
import EmployeeShow from "./employeeShow";

export default {
    components:{
        "employee-show":EmployeeShow
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
