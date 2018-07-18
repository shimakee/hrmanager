<template>
    <div class="card-post">
        <img class="img" src="https://picsum.photos/100/100/?random" alt="picture post">
        <div class="content">
            <!-- <h3 class="title">Title</h3>
            <p class="description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam quam qui consequuntur iusto dolorem voluptate. Consectetur omnis asperiores nesciunt reprehenderit commodi voluptates amet perspiciatis deleniti id cupiditate, laudantium dicta exercitationem!</p> -->
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
