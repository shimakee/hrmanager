<template>
    <div>
        <h1>Settings</h1>
        <router-view></router-view>
        <router-view name="changePassword"></router-view>
        <router-view name="deleteAccount"></router-view>
        <router-view name="editProfile"></router-view>
    </div>
</template>
<script>
export default {
    //TODO on mount() or create()
}
</script>
<style scoped>

</style>
