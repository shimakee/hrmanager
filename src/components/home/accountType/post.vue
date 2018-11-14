<template>
    <div>
        <h2>Post</h2>
        <!-- <div class="card-post">
            <img class="img" src="https://picsum.photos/100/100/?random" alt="picture post">
            <div class="content">
                <h3 class="title">Title</h3>
                <p class="description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam quam qui consequuntur iusto dolorem voluptate. Consectetur omnis asperiores nesciunt reprehenderit commodi voluptates amet perspiciatis deleniti id cupiditate, laudantium dicta exercitationem!</p>
            </div>
        </div> -->
        <card-post v-for="(post, key) in posts" v-bind:key="key">
            <h3 slot="title">{{post.title}}</h3>
            <p>{{post.description}}</p>
        </card-post>
    </div>
</template>
<script>
    import post from '../../parts/cardPost';

export default {
    components:{
        "card-post": post
    },
    data(){
        return {
            posts:[
                {title:"Sample",
                description:"Some description"},
                {title:"Sample2",
                description:"Some description2"},
                {title:"Sample3",
                description:"Some description3"},
                {title:"Sample3",
                description:"Some description3"},
                {title:"Sample3",
                description:"Some description3"},
                {title:"Sample3",
                description:"Some description3"},
                {title:"Sample4",
                description:"Some description4"}
            ]
        }
    }
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
