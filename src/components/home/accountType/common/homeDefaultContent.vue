<template>
    <div> 
        <h3>Carder Post, news and announcement</h3>
        
    </div>
</template>
<script>
export default {
}
</script>
<style scoped>
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
 }

li.card-pic img{
    width: 100%;
}
li.card-pic p{
    font-size: 1em;
    padding: 0;
    margin: 12px 0;
}
</style>
