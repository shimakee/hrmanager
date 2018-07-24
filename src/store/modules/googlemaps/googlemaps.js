const state = {
    googleMap:{
        map:null,
        marker:null,
        position:{
            lat: 0,
            lng:0
        }
    }
}
const getters = {
    //map getter
    //marker getter
}
const mutations = {
    //create set marker
    //creat set map
}
const actions = {
    getMap:({state, dispatch}, payload)=>{
        state.googleMap.map = new google.maps.Map(//push map with selector as key
            document.querySelector(payload.selector), {
            center: payload.position,
            scrollwheel: true,
            zoom: 4
            // ,scaleControl: true
            ,mapTypeControl: true,
            mapTypeControlOptions:{
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
            }
            });

        state.googleMap.marker = new google.maps.Marker({position:state.googleMap.position, map: state.googleMap.map});
        state.googleMap.marker.addListener('click', function(){
            let position = state.googleMap.marker.getPosition();
            console.log(position);
        });

        google.maps.event.addListener(state.googleMap.map, 'click', function(event){
            dispatch('setMarker', event.latLng);
        });
    },
    setMarker:({state}, payload)=>{
        state.googleMap.marker = new google.maps.Marker({position: payload,
                                                        map: state.googleMap.map,
                                                        label: 'address'});
        state.googleMap.marker.addListener('click', function(){
            let position = state.googleMap.marker.getPosition();
            console.log(position);
        });
    }
}

export default{
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
}