<template>
    <div class="info">
                <profile-info v-if="accountType == 'profile'"></profile-info>
                <company-info v-if="accountType == 'company'"></company-info>
                <!-- <staff-info v-if="accountType == 'staff'"></staff-info> -->
    </div>
</template>
<script>
import CompanyInfo from "./company/companyInfo";
import ProfileInfo from "./profile/profileInfo";

export default {

    computed:{
        accountType(){
            return this.$store.getters.getAccountType;
        }
    },
    components:{
        "profile-info": ProfileInfo,
        "company-info": CompanyInfo
    }
}
</script>
<style>
</style>
