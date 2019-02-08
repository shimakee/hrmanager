<template>
    <div>
        <h3>Gallery</h3>
        <ul>
            <li @click="choosePic(pic)" v-for="(pic, key) in pics" :key="key" class="card-pic" :class="{highlight: pic.filename == activePic}">
                <span class="delete" @click="deletePic(pic)" v-if="pic.filename == activePic">X</span>
                <img :src="'http://localhost/file/photo/me?name='+pic.filename" :alt="pic.filename" srcset="">
                
                <div class="description">
                    <p>
                        {{pic.filename}}
                    </p>
                </div>

                <span v-if="pic.filename == activePic && pic.main == false"
                    class="edit"
                    @click="setAsMain(pic)">Set as main</span>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data(){
        return {
            activePic: null
        }
    },
    computed:{
        pics(){ //TODO: make na new component for gallery
            let pics = this.$store.getters.getPics;
            return pics;
        }
    },
    methods:{
        setAsMain(pic){
            this.$store.dispatch('updatePic', pic._id)
                .then(res=>{
                    console.log("update pic", pic._id);
                    this.$store.commit('setInfoMessage', res.data.message);

                    this.$store.dispatch('maintainData'); //to update the computed pics array
                }).catch(err=>{
                    console.log(err);
                    this.$store.commit('setInfoMessage', err.response.statusText);
                });

        },
        deletePic(pic){
            const confirm = window.confirm(`Delete ${pic.filename}?`);

            if(confirm){
                this.$store.dispatch('deletePic', pic.filename)
                    .then(res=>{
                        console.log("deletePIc", pic.filename);
                        this.$store.commit('setInfoMessage', res.data.message);

                        this.$store.dispatch('maintainData'); //to update the computed pics array
                    }).catch(err=>{
                        console.log(err);
                        this.$store.commit('setInfoMessage', err.response.statusText);
                    });
            }else{
                console.log("cancelled");
            }
        },
        choosePic(pic){
            this.activePic = pic.filename;
        }
    },
    mounted(){
        this.$store.dispatch('clearDisplayMessages');
    }
}
</script>
<style scoped>
/*======INFO & ERROR message========*/
div{
    margin: 1em;
}
.edit{
    color: blue;
}
.edit:hover {
    font-weight: bolder;
}
/*======= Gallery format ====*/
.highlight{
    outline: 3px rgb(59, 71, 231) solid;
}
ul{
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, auto));
    grid-gap: 10px;
    padding: 0;
}
 ul li.card-pic{
     background-color: cornsilk;
     display: grid;
     grid-template-columns: 1fr;
     justify-items: center;
     align-items: center;
     position: relative;
     cursor: pointer;
     max-width: 500px;
 }
 /* ul li.card-pic.highlight{
     cursor: pointer;
 } */

li.card-pic img{
    width: 100%;
}
li.card-pic div p{
    margin:  0;
}
li.card-pic div{
    font-size: 1em;
    padding: 0;
    margin: 12px 0;
}
span.delete:hover{
    background-color: rgb(189, 14, 14);
    transform: scale(1.2);
}
span.delete:active{
    transform: scale(1);
}
span.delete{
    position: absolute;
    top: -10px;
    right: -10px;
    color: white;
    background-color: rgb(207, 74, 74);
    border-radius: 10px;
    padding: 3px;
    cursor:default;
}

</style>
