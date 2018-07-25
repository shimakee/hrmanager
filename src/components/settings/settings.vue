<template>
    <div>
        <h1>Settings</h1>
        <router-view></router-view>
        <router-view name="changePassword"></router-view>
        <router-view name="deleteAccount"></router-view>
        <router-view name="editProfile"></router-view>
        <router-view name="editRelatives"></router-view>
        <router-view name="editContacts"></router-view>
        <router-view name="editAddress"></router-view>
        <router-view name="editGov"></router-view>
    </div>
</template>
<script>
export default {
    //TODO on mount() or create()
    //TODO move to views
}
</script>
<style scoped>

</style>