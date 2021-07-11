<template>
    <div>
        
        <section id="map" ref="map"></section>
        <PlacesInputPanel v-show="showPlacesInputPanel"/>
    </div>
</template>

<script>
import {EventBus} from "@/EventBus"
import PlacesInputPanel from "@/components/PlacesInputPanel"


export default {
    name: "Mapview",
    components:{PlacesInputPanel},
    
    data(){
        return {
            lat:40.754932,
            lng:-73.984016,
            showPlacesInputPanel:true
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
            draggable: true,
            map: map,
        });
        },

        showRouteOntheMap(){
        /* ROUTW FOMATL
            route = {
            origin:{address:from,lat:this.destinationArrayDetail[i].lat, lng:this.destinationArrayDetail[i].lng},
            destination:{address:to,lat:this.destinationArrayDetail[j].lat, lng:this.destinationArrayDetail[j].lng}, 
            distance:distance,
            duration:duration,
            };*/
            var map = new google.maps.Map(this.$refs["map"], {
                zoom: 15,
                center: new google.maps.LatLng(this.lat, this.lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
            });
            console.log("created a new map");

            
            const directionsService = new google.maps.DirectionsService();
            console.log("init a directionsService")
            const directionsRenderer = new google.maps.DirectionsRenderer();
            console.log("init a directionsRenderer")

            EventBus.$on("route-data",(data)=>{
                console.log("receive the route-data");
                console.log(`data.origin = ${data.origin.address}`);
                console.log(`data.des = ${data.destination.address}`);
                directionsService.route({
                    origin: data.origin.address,
                    destination: data.destination.address,
                    travelMode: 'DRIVING',
                }, (response,status)=>{
                    if(status === "OK"){
                        console.log("route request status == OK");
                        console.log("the response is:")
                        console.log(response)
                        directionsRenderer.setDirections(response);
                        directionsRenderer.setMap(map);
                    }
                    else{console.log(status)}
                })
            })
            // const directionsService = new google.maps.DirectionsService();
            // const directionsRenderer = new google.maps.directionsRenderer();
            // EventBus.$on("route-data", data=>{
            //     directionsService.route({
            //         origin: data.origin.address,
            //         destination: data.destination.address,
            //         travelMode: "DRIVING"
            //     }, (response,status)=>{
            //         if (status === "OK"){
            //             directionsRenderer.setDirections(response);
            //             directionsRenderer.setMap(map);
            //         }
            //     })
            
            // )
            

            // } 
        }
    },
    



    mounted(){

      var map = new google.maps.Map(this.$refs["map"], {
        zoom: 15,
        center: new google.maps.LatLng(39, -98.5795),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        gestureHandling: 'greedy',
        draggable: true,
      });

    new google.maps.Marker({
        position: new google.maps.LatLng(39.8283, -98.5795),
        draggable: true,
        map: map,
      });

        // var map = new google.maps.Map(this.$refs["map"], {
        //     minZoom:0,
        //     maxZoom: 50,
        //     zoomControl:true,
        //     zoom: 5,
        //     center: new google.maps.LatLng(39.8283, -98.5795),
        //     gestureHandling: "auto",
        //     mapTypeId: google.maps.MapTypeId.ROADMAP,
        //     fullscreenControl: true
        // });
        console.log("created a new map");

        const directionsService = new google.maps.DirectionsService();
        console.log("init a directionsService")
        const directionsRenderer = new google.maps.DirectionsRenderer();
        console.log("init a directionsRenderer")

        EventBus.$on("route-data",(data)=>{
            console.log("received data")
            console.log(`from= ${data.origin.address}`)
            console.log(`to= ${data.destination.address}`)
            directionsService.route({
                origin: new google.maps.LatLng(data.origin.lat,data.origin.lng),
                destination: new google.maps.LatLng(data.destination.lat,data.destination.lng),
                travelMode: 'DRIVING',
            }, 
            (response,status)=>{
                if(status === "OK"){
                    console.log("route request status == OK");
                    console.log("the response is:")
                    console.log(response)
                    directionsRenderer.setDirections(response);
                    directionsRenderer.setMap(map);
                }
                else{console.log(status)}
            })
        })
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
}

</style>
