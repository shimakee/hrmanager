<template>
    <div>
        <ul>
            <li v-for="(item, key) in emails" v-bind:key="key"
            class="email-card"
                :class="{chosen: itemActive == item._id}"
                @click="itemActive = item._id">

                <email-detail
                    :item="item"
                        />
            </li>
        </ul>
    </div>
</template>
<script>
import EmailDetail from './emailDetail';

export default {
    props:{
        emails: {type: Array}
    },
    components:{
        "email-detail": EmailDetail
    },
    data(){
        return{
            itemActive: null
        }
    },
}
</script>
<style scoped>
.chosen{
    outline: solid 3px blue;
}

ul{
    list-style: none;
}
ul{
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, auto));
    grid-gap: 10px;
    padding: 0;
    justify-content: center;
}

li.email-card{
    padding: 10px;
    margin: 5px;
    max-width: fit-content;
    min-width: 250px;
    justify-items: center;
}
</style>



