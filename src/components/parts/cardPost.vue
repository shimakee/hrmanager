<template>
    <div class="card-post">
        <img class="img" src="https://picsum.photos/100/100/?random" alt="picture post">
        <div class="content">
            <slot name="title" class="title"></slot>
            <slot class="description"></slot>
        </div>
    </div>
</template>
<script>
export default {
}
</script>
<style scoped>
.cardd-post{
    margin:2px;
    padding:3px;
}
.img{
    float:left;
    margin:1em;
}
.content{
    margin: 1em;
    padding: 1em;
}
.content .title, .content .description{
    margin: 0;
}
</style>
