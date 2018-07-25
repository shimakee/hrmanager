<template>
    <div>
            <h2>Google Maps</h2>

            <div v-if="showMap" class="mapComponent" :id="selector"></div>

            <!-- <h2>Markers</h2>
            <ul>
                <li v-for="(marker, key) in markers" v-bind:key="key">
                    {{key}}: {{marker.getPosition()}}
                </li>
            </ul> -->
    </div>
</template>
<script>
export default {
    props:{
        showMap:{default: true, type: Boolean},
        selector: String,
        position: Object,
        label:{default: 'Location', type: String}, //label on the marker
        editable: {default: false, type: Boolean}, //be able to add/remove markers
        markerLimit: {default: 1, type: Number}
    },
    data(){
        return {
            map:null,
            markers:[]
        }
    }
    ,methods:{
        setMarker(data){
            let vm = this;
            let label = data.label || this.label;

            if(vm.markers.length < vm.markerLimit){//limit the number of markers to add
                let marker = new google.maps.Marker({position: data.position, map: data.map, label: label});
    
            if(vm.editable){//only available if edit is true
                marker.addListener('click', function(){//to individually remove marker
                    this.setMap(null);
                    let index = vm.markers.indexOf(this);
                    vm.markers.splice(index, 1);
                });
            }

            //emit event to pass position value on click to parent 
            vm.setPosition({lat: marker.getPosition().lat(),   
                        lng: marker.getPosition().lng()});

            this.markers.push(marker);
            }
        },
        setPosition(data){
            this.$emit('update:position', {position: data});
        },
        getCurrentPosition(){
            return new Promise((resolve, reject)=>{

                if(navigator.geolocation){//check if available
                    navigator.geolocation.getCurrentPosition(res=>{
                        resolve(res);
                    }, err=>{
                        reject(err);
                    });
                }else{
                    reject({Error: "GeoLocation disabled or unavailable."});
                }
            });
        }
    }
    ,mounted(){
        let vm = this;

        if(vm.showMap){//only execute if showmap is enabled
            let defaulPosition = {lat: 37, lng: 125}; //fallback value

            vm.map = new google.maps.Map(
                        document.querySelector('#'+vm.selector), {
                            center: vm.position || defaulPosition, //prop position takes priority over default and current position
                            scrollwheel: true,
                            zoom: 8
                            ,scaleControl: true
                            ,mapTypeControl: true,
                            mapTypeControlOptions:{
                                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                            }
                    });

            //setting position marker if available
            if(vm.position){
                vm.setMarker({position: vm.position, map: vm.map});
            }else{//prop position takes priority over geolocation
                vm.getCurrentPosition() //getting geolocation
                    .then(position=>{
                                vm.map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});//set default center on current location
                                vm.setMarker({position: {lat: position.coords.latitude, lng: position.coords.longitude}, map: vm.map});
                    }).catch(err=>{
                        console.log(err); 
                    });
            }

            if(vm.editable){ //adding markers option
                vm.map.addListener('click', function(event){
                    vm.setMarker({position: event.latLng, map: vm.map});
                });
            }
        }
    }
}
</script>
<style scoped>
.mapComponent{
    height:300px;
    width: 600px;
}
</style>
