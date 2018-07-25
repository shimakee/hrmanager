const state = {
    googleMap:{
        map:null,
        markers:[],
        currentPosition:null,
        position:{
            lat: 0,
            lng:0
        },
        label:null
    }
}
const getters = {
    getMap:(state)=>{
        return state.googleMap.map;
    },
    getMarkers:(state)=>{
        return state.googleMap.markers;
    },
    getPosition:(state)=>{
        return state.googleMap.position;
    },
    getLabel:(state)=>{
        return state.googleMap.label;
    }
}
const mutations = {
    setMarker:(state, payload)=>{
        let markers = state.googleMap.markers;
        let label = payload.label || state.googleMap.label;
        
        let marker = new google.maps.Marker({position: payload.position, map: payload.map, label: label});
        marker.addListener('click', function(){
            this.setMap(null);
            let index = markers.indexOf(this);
            markers.splice(index, 1);
        });

        state.googleMap.markers.push(marker);
    },
    setMap:(state, payload)=>{
        state.googleMap.map = new google.maps.Map(
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
    },
    setPosition:(state, payload)=>{
        state.googleMap.position = payload;
    },
    setLabel:(state, payload)=>{
        state.googleMap.label = payload;
    }
}
const actions = {
    createMap:({commit, getters}, payload)=>{
        commit('setMap', {
            position: payload.position,
            selector: payload.selector
        });

        let map = getters.getMap;

        // google.maps.event.addListener(map, 'click', function(event){
        //     commit('setMarker', {position: event.latLng, map: map, label: null});
        //     // state.googleMap.label = null;
        // });
        map.addListener('click', function(event){
            commit('setMarker', {position: event.latLng, map: map, label: null});
        });
    }
}

export default{
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
}