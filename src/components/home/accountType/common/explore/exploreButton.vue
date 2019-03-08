<template>
    <!-- <div> -->
        <button v-if="display"
            @click.prevent="action(arg)">
            {{name}}
        </button>
    <!-- </div> -->
</template>
<script>
export default {
    props:{
        name:{type: String, default: "Button"},
        display:{type: Boolean, default: false},
        action:{type: Function},
        arg:{type:String}
    }
}
</script>
<style>

</style>
