<template>
    <div class="actions">
        <profile-actions v-if="accountType == 'profile'"></profile-actions>
        <profile-actions v-if="accountType == 'company'"></profile-actions>
        <!-- <profile-actions v-if="accountType == 'staff'"></profile-actions> -->

    </div>
</template>
<script>
import ProfileActions from "./profile/profileActions";
import companyActions from "./company/companyActions";

export default {
    components:{
        "profile-actions": ProfileActions,
        "company-actions": companyActions
    },
    computed:{
        accountType(){
            return this.$store.getters.getAccountType;
        }
    }
}
</script>
<style scoped>
</style>
