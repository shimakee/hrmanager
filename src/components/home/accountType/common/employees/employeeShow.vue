<template>
    <ul>
        <li v-for="(value, key) in employees" v-bind:key="key"
                class="explore-card">
            <div v-for="(employee,k) in value.employee" v-bind:key="k">
                <span v-if="k == 'status'">
                    Status: {{employee.Status}}
                </span>
                <span v-if="k == 'assignment'">
                    Assignment: {{employee.assignment}}
                </span>
                <span v-if="k == 'salary'">
                    Salary: {{employee.salary}}
                </span>
                <div v-if="k == 'infoDate'">
                    <li  v-for="(info, j) in employee" v-bind:key="j">
                        Info date: {{info.date}}
                        <br>
                        Info action: {{info.class}}
                    </li>
                </div>
            </div>
        </li>
    </ul>
</template>
<script>
import Accordion from "../../../../parts/accordion";

export default {
    computed:{
        employees(){
            return this.$store.getters.getEmployees;
        },
        accountType(){
            return this.$store.getters.getAccountType;
        }
    },
    mounted(){
        this.$store.dispatch("getEmployees")
            .then(res=>{
                console.log(res);
            });
    }
}
</script>
<style scoped>
ul{
    list-style:  none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(700px, auto));
    grid-gap: 15px;
    margin: 25px 5px 5px 5px;
    padding: 0;
}
li{
    position: relative;
}
.chosen{
    outline: blue 1px solid;
}
.edit{
    position: absolute;
    top: 10px;
    right: 15px;
    color: blue;
    cursor: pointer;
    padding: 10px;
    max-width: fit-content;
}
.delete{
    position: absolute;
    top: -15px;
    right: -10px;
    font-weight: bolder;
    color: white;
    cursor: pointer;
    border-radius: 25px;
    background-color: red;
    padding: 3px;
}

@media (max-width: 1000px) {
    ul{
        grid-template-columns: repeat(auto-fit, minmax(500px, auto));
    }
}
@media (max-width: 700px) {
    ul{
        grid-template-columns: repeat(auto-fit, minmax(400px, auto));
    }
}
@media (max-width: 500px) {
    ul{
        grid-template-columns: repeat(auto-fit, minmax(300px, auto));
    }
}
</style>
