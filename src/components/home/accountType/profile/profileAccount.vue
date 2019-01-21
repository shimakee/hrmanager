<template>
    <div>
        <accordion>
            <h3 slot="title">General information</h3>
            <div slot="content">
                <router-view name="editProfile"></router-view>
                <router-view name="editContacts"></router-view>
                <router-view name="editGov"></router-view>
            </div>
        </accordion>
        <accordion>
            <h3 slot="title">Relatives</h3>
            <div slot="content">
                <router-view name="editRelatives"></router-view>
            </div>
        </accordion>
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
