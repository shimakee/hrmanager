<template>
    <div class="info">
                <span class="activity" v-if="!activity">Account is not yet activated</span>
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
        },
        activity(){
            return this.$store.getters.getActivity;
        }
    },
    components:{
        "profile-info": ProfileInfo,
        "company-info": CompanyInfo
    }
}
</script>
<style>
    .activity{
        color: red;
        font-weight: bolder;
        background-color:blanchedalmond;
        padding: 5px;
        margin: 5px;
    }
</style>
