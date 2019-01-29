<template>
    <div class="account">
                <profile-account v-if="accountType == 'profile'"></profile-account>
                <!-- <company-account v-if="accountType == 'company'"></company-account> -->
                <!-- <staff-account v-if="accountType == 'staff'"></staff-account> -->
    </div>
</template>
<script>
// import CompanyAccount from "./company/companyAccount";
import ProfileAccount from "./profile/profileAccount";

export default {

    computed:{
        accountType(){
            return this.$store.getters.getAccountType;
        }
    },
    components:{
        "profile-account": ProfileAccount,
        // "company-account": CompanyAccount
    }
}
</script>
<style>
</style>
