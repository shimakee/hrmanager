<template>
    <div>
        <h1>Settings</h1>
        <router-view></router-view>
        <router-view name="editPic"></router-view>
        <router-view name="changeUsername"></router-view>
        <router-view name="changePassword"></router-view>
        <router-view name="editProfile"></router-view>
        <router-view name="editRelatives"></router-view>
        <router-view name="editContacts"></router-view>
        <router-view name="editGov"></router-view>
        <!-- <router-view name="editAddress"></router-view> -->
    </div>
</template>
<script>
export default {
    //TODO on mount() or create()
    //TODO move to views
    //TODO properly separate and categorize these components
}
</script>
<style scoped>

</style>