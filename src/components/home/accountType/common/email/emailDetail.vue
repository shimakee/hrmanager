<template>
    <div>
        <div class="contact-content">
            <span :class="{main: item.main, notMain: !item.main}"></span>
            <br>
            <p v-if="item.address">Address: {{item.address}}</p>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        item:{default: null, type: Object}, //address to show
    }
}
</script>
<style scoped>

.main:hover,.notMain:hover{
    cursor: pointer;
}
.main{
    position: absolute;
    background-color: green;
    border: blue solid 3px;
    padding: 10px;
    border-radius: 20px;
}
.notMain{
    position: absolute;
    background-color: red;
    border: blue solid 3px;
    padding: 10px;
    border-radius: 20px;
}

</style>
