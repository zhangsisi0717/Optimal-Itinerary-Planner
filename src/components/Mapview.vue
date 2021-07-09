<template>
    <div>
        <PlacesInputPanel/>
        <section id="map" ref="map"></section>
    </div>
</template>

<script>
import PlacesInputPanel from "@/components/PlacesInputPanel"

export default {
    name: "Mapview",
    components:{PlacesInputPanel},
    
    data(){
        return {
            lat:40.754932,
            lng:-73.984016
        }
        },
    methods:{
        showUserLocationOnTheMap(latitude, longitude) {
        // Show & center the Map based oon
        var map = new google.maps.Map(this.$refs["map"], {
            zoom: 15,
            center: new google.maps.LatLng(latitude, longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        });

        new google.maps.Marker({
            position: new google.maps.LatLng(latitude, longitude),
            map: map,
        });
        },
    },

    mounted(){
        // let user = firebase.auth().currentUser
        // console.log(user)
        this.showUserLocationOnTheMap(this.lat,this.lng)
        // console.log(firebase.auth().currentUser)  //firebase will return current log in user
    }
}
</script>

<style>
/* .google-map{
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1; 
} */

#map {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
}

</style>
