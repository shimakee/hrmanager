<template>
    <div>
        <h1>Settings</h1>
        <accordion>
            <h3 slot="title">Account</h3>
            <div slot="content">
                <router-view></router-view>
                <router-view name="changeUsername"></router-view>
                <router-view name="changePassword"></router-view>

                <span class="error">{{errorMessage}}</span>
                <span class="infoMessage">{{infoMessage}}</span>

            </div>
        </accordion>
        <!-- <accordion>
            <h3 slot="title">Gallery</h3>
            <div slot="content">
                <router-view name="editPic"></router-view>
            </div>
        </accordion> -->
        <!-- <accordion>
            <h3 slot="title">Profile information</h3>
            <div slot="content">
                <router-view name="editProfile"></router-view>
                <router-view name="editContacts"></router-view>
                <router-view name="editGov"></router-view>
            </div>
        </accordion> -->
        <!-- <accordion>
            <h3 slot="title">Relatives</h3>
            <div slot="content">
                <router-view name="editRelatives"></router-view>
            </div>
        </accordion> -->
        <!-- <router-view name="editAddress"></router-view> -->
    </div>
</template>
<script>
import Accordion from "../parts/accordion";

export default {
    
    //TODO on mount() or create()
    //TODO move to views
    //TODO properly separate and categorize these components
    
    components:{
        "accordion": Accordion
    },
    computed:{
        errorMessage(){
            return this.$store.getters.getErrorMessage;
        },
        infoMessage(){
            return this.$store.getters.getInfoMessage;
        }
    }
}
</script>
<style scoped>
.error{
    color:red;
    font-weight: bolder;
}
.infoMessage{
    color:green;
    font-weight: bolder;
}
</style>