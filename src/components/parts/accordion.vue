<template>
    <div >
        <!-- <ul class="accordion-container" > -->
            <li class="accordion-tab">
                <span class="tab-title"><slot name="title"></slot></span>
                <input type="radio" name="tab-input" class="tab-input">
                
                <span class="tab-content"><slot name="content"></slot></span>
            </li>
        <!-- </ul> -->
    </div>
</template>

<script>
export default {
    props:{
        items: Object
    }
}
</script>
<style scoped>
/*accordion*/
/* .accordion-container{
    display: grid;
    grid-template-columns: 1fr;
} */
.accordion-tab{
    display: grid;
    grid-template-columns: 1fr;
    overflow: hidden;
    position: relative;
}
.tab-title{
    /* padding: 5px 10px; */
    margin: 0;
    grid-row: 1/2;
    grid-column: 1/-1;
}
.tab-input{
    grid-row: 1/2;
    opacity: 0;
    grid-column: 1/-1;
    width: 100%;
    height: 100%;
}
.tab-content{
    max-height: 0;
    overflow: hidden;
    /* margin: 5px 10px; */
}
.tab-content a,
.tab-content a:visited,
.tab-content a:hover{
    color: inherit;
    text-decoration: none;
}
.tab-content ul{
    list-style: none;
    margin-right: 0;
    padding: 0;
}
.tab-content p{
    margin: 0;
}
.accordion-tab input:checked~ .tab-content{
    max-height: 300px;
    /* overflow-y: scroll; */
}
</style>
