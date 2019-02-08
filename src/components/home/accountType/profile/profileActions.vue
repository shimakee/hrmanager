<template>
    <div class="profile-actions">
        <!-- <p>{{accountType}} - Actions</p> -->

        <!-- accordion using css -->
        <ul class="accordion-container">
            <accordion>
                <h3 slot="title">{{accountType}}</h3>
                <ul slot="content">
                    <li><router-link to="account">information</router-link></li>
                    <li><router-link to="gallery">Photos</router-link></li> <!--this is currently used as the default content-->
                    <li><router-link to="address">Address</router-link></li>
                    <!-- <li><router-link to="contact">Contact</router-link></li> -->
                </ul>
            </accordion>
            <!-- <accordion>
                <h3 slot="title">Settings</h3>
                <ul slot="content">
                    <li><router-link to="account">{{accountType}} account</router-link></li>
                    <li><router-link to="settings">General</router-link></li>
                    <li><router-link to="privacy">Privacy</router-link></li>
                    <li><router-link to="marketing">Marketing</router-link></li>
                </ul>
            </accordion> -->
            <accordion>
                <h3 slot="title">Account</h3>
                <ul slot="content">
                    <!-- <li><router-link to="account">General</router-link></li> -->
                    <li><router-link to="settings">Settings</router-link></li>
                    <li><a href="#" @click.prevent="logout()">Logout</a></li>
                </ul>
                
                <!-- <button @click="logout()" slot="content">logout</button> -->
            </accordion>
        </ul>

    </div>
</template>
<script>
import Accordion from "../../../parts/accordion";

export default {

    components:{
        "accordion": Accordion
    },
    computed:{
        accountType(){
            return this.$store.getters.getAccountType;

        }
    },
    methods:{
        logout(){
            this.$store.dispatch('logout');
        }
    }
}
</script>
<style scoped>
.links a, a:active, a:hover, a:visited{
    /* color: black; */
    font-size: 1.5em;
}
.show{
    display: grid;
}
.accordion-container{
    display: grid;
    grid-template-columns: 1fr;
    padding: 0;
}
</style>
