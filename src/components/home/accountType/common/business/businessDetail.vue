<template>
    <div>
            <span class="tradename">
                <b>Tradename:</b> {{business.business.tradename}}
            </span>
            <div class="address">
                <span >
                    <div >
                        <b>Street:</b> {{business.business.address.street}}
                    </div>
                    <div>
                        <b>City:</b> {{business.business.address.city}}
                    </div>
                    <div>
                        <b>Country:</b> {{business.business.address.country}}
                    </div>
                    <div>
                        <b>Province:</b> {{business.business.address.province}}
                    </div>
                    <div>
                        <b>Zipcode:</b> {{business.business.address.zipcode}}
                    </div>
                </span>
            </div>
    </div>
</template>
<script>

export default {
    props:{
        business: {type: Object}
    }
}
</script>
<style scoped>
    /* .business{
        display: grid;
        grid-template-columns: 1fr;
    } */
</style>
