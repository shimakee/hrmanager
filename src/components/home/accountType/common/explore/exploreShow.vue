<template>
    <div> 
        <h3>Explore</h3>

        <ul><!--//iterate over array-->
            <li v-for="(value, key) in exploreResult" v-bind:key="key">

                <div v-for="(v, k) in value" v-bind:key="k"><!-- iterate over object-->
                    <h3 v-if="k =='tradename'">{{v}}</h3>
                    <p v-if="k =='ownershipType'">Ownership type: {{v}}</p>

                    <span v-if="k == 'authenticated'" :class="{authenticated: v, unauthenticated: !v}">

                    </span>

                    <accordion  v-if="k=='contact' && v.length > 0"
                        :inputType="'checkbox'">
                        <h3 slot="title">Contact</h3>
                        <div slot="content">
                            <router-view
                            name="contactShow" 
                            :editable="false"
                            :contacts="v" />
                        </div>
                    </accordion>
                
                    <accordion v-if="k == 'address' && v.length > 0"
                        :inputType="'checkbox'">
                        <h3 slot="title">Address</h3>
                        <div slot="content">
                            <router-view
                            name="addressShow"
                            :autoLocate="autoLocate"
                            :autoAddress="false"
                            :editable="false"
                            :showMap="false"
                            :address="v" />
                        </div>
                    </accordion>

                    <accordion v-if="k == 'email' && v.length > 0"
                        :inputType="'checkbox'">
                        <h3 slot="title">Email</h3>
                        <div slot="content">
                            <span v-for="(email, emailKey) in v" v-bind:key="emailKey">
                                {{email}}
                            </span>
                        </div>
                    </accordion>

                    <span v-if="k=='businesses' && v.length > 0">
                        <p> {{k}} : {{v}} </p>
                    </span>

                    <accordion v-if="k == 'pics' && v.length > 0"
                        :inputType="'checkbox'">
                        <h3 slot="title">Pictures</h3>
                        <div slot="content">
                            <router-view
                            name="galleryShow"
                            :pics="v"
                            :editable="false"/>
                        </div>
                    </accordion>

                </div>
                <Button>Apply</Button>
            </li>
        </ul>
        
    </div>
</template>
<script>

import Accordion from "../../../../parts/accordion";

export default {
    components:{
        "accordion": Accordion
    },
    computed:{
        exploreResult(){
            return this.$store.getters.getExploreResult;
        },
        autoLocate(){
            const AUTO_LOCATE = this.$store.getters.getAllowAutoLocate;
            return AUTO_LOCATE;
        }
    }
}
</script>
<style scoped>
.authenticated, .unauthenticated{
    border-radius: 50px;
    padding:10px;
    font-size: 5px;
}
.unauthenticated{
    background-color: red;
}
.authenticated{
    background-color: green;
}
ul{
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, auto));
    grid-gap: 20px;
}
/* ul li{
    margin
} */
</style>
