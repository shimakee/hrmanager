<template>
    <div>
        <accordion>
            <h3 slot="title">General information</h3>
            <div slot="content">
                <router-view name="editProfile"></router-view> <!--change name from edit profile to profilEDIT, also no need for router view rather just use components instead-->
                <!-- <router-view name="editGov"></router-view> TODO: not yet implemented -->
            </div>
        </accordion>
        <accordion>
            <h3 slot="title">Contact</h3>
            <div slot="content">
                <router-view name="contact" :editable="true"></router-view>
                <!-- <router-view name="editGov"></router-view> TODO: not yet implemented -->
            </div>
        </accordion>
        <!-- <accordion>
            <h3 slot="title">Relatives</h3>
            <div slot="content">
                <router-view name="editRelatives"></router-view>
            </div>
        </accordion> -->
    </div>
</template>
<script>
import Accordion from "../../../parts/accordion";

export default {
    components:{
        "accordion": Accordion
    }
}
</script>
<style scoped>
</style>
