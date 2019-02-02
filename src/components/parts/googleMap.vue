<template>
    <!-- <div> -->
        <div v-if="showMap" class="mapComponent" :id="selector"></div>
    <!-- </div> -->
</template>
<script>
import axios from "axios";
import Axios from 'axios';

export default {
    props:{
        showMap:{default: true, type: Boolean},
        autoLocate:{default: true, type: Boolean},//perform location detection via geolocate
        autoAddress:{default: true, type: Boolean},//emit to parent address object
        selector: {default: 'googleMap', type: String}, //unique tag for the map - to make each map component unique or the same
        position: Object, //lat lng object to be used by default
        editable: {default: false, type: Boolean}, //be able to add/remove markers
        label:{default: 'Location', type: String}, //label on the marker
        markerLimit: {default: 1, type: Number} //total number of markers to place
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
    
                marker.addListener('click', function(){//to individually remove marker upon click
                    if(vm.editable){//only available if edit is true
                        this.setMap(null);
                        let index = vm.markers.indexOf(this);
                        vm.markers.splice(index, 1);

                        vm.emitPosition({lat: null, //emit null position upon marker removal
                            lng: null});
                    }
                });

                this.markers.push(marker);//add marker to markers array
                


                let lat = marker.getPosition().lat();
                let lng = marker.getPosition().lng();
                //emit event to pass position value on click to parent 
                vm.emitPosition({lat: lat,   
                            lng: lng});

                if(vm.autoAddress){//if enabled generate address from latlng upon setting marker
                    vm.getLatLngAddress(lat , lng)
                        .then(res=>{
                            let emitData = vm.formatLatLngAddressResponse(res);

                            vm.emitAddress(emitData);//emit data for parent component to use
                        }).catch(err=>{
                            console.log('err', err);
                        });
                }
            }
        }
        ,emitPosition(data){
            this.$emit('update:position', {position: data});
        }
        ,emitAddress(data){
            this.$emit('update:address', {address: data});
        }
        ,formatLatLngAddressResponse(res){

            function findAddress(array, word){
                return array.find(element=>{ return element.types.find(el=>{return el == word;}) == word;});
            }
            //getting the best address component from google geocode api
            let result = res.data.results[0].address_components;
            //assigning whatever possible and available
            let route = findAddress(result, 'route') ;
            let street = findAddress(result, 'street_address');
            let locality = findAddress(result, 'locality') ;
            let adminLv2 = findAddress(result, 'administrative_area_level_2') ;
            let postalCode = findAddress(result, 'postal_code') ;
            let country = findAddress(result, 'country') ;

            return {
                //assign the specific returned values
                route: route || street, //street level
                city: locality,
                province: adminLv2,
                country: country,
                zipcode: postalCode
            };
        }
        ,geolocatePosition(){
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
        ,getLatLngAddress(lat, lng){//api key should also be passed as arguement
            return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyD8IY5hiVuFmdcHC0EeMWQYord5ONIZkos`);
        }
    }
    ,mounted(){
        let vm = this;
        const DEFAULT_POSIION = {lat: 7, lng: 125}; //fallback value (mindanao philippines)

        if(vm.showMap){//only execute if showmap is enabled
            let position = DEFAULT_POSIION;
            if(vm.position){
                if(vm.position.lat && vm.position.lng){
                    position = vm.position;
                }
            }

            vm.map = new google.maps.Map(
                        document.querySelector('#'+vm.selector), {
                            center: position, //prop position takes priority over default and current position
                            scrollwheel: true,
                            zoom: 8
                            ,scaleControl: true
                            ,mapTypeControl: true,
                            mapTypeControlOptions:{
                                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                            }
                    });

            //setting position marker if available
            if(vm.position && vm.position.lat && vm.position.lng){
                vm.setMarker({position: vm.position, map: vm.map});
            }else{//prop position takes priority over geolocation
                
                const AUTO_LOCATE = this.$store.getters.getAllowAutoLocate;//geolocation allowed by client

                if(vm.autoLocate && AUTO_LOCATE){//geolocate allowed on component level and client level
                    vm.geolocatePosition() //getting geolocation
                        .then(position=>{
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;

                            vm.map.setCenter({lat: lat, lng: lng});//set default center on current location
                            vm.setMarker({position: {lat: lat, lng: lng}, map: vm.map});//create marker on geolocated location
                        }).catch(err=>{
                            console.log(err); 
                        });
                }
            }

            vm.map.addListener('click', function(event){
                if(vm.editable){//only available if edit is true
                    vm.setMarker({position: event.latLng, map: vm.map});
                }
            });
        }
    }
}
</script>
<style scoped>
</style>
