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
            lat:39.8283,
            lng:-98.5795,
            showPlacesInputPanel:true
        }
        },
    methods:{
        showUserLocationOnTheMap(latitude, longitude,showMarker) {
        // Show & center the Map based oon
            var map = new google.maps.Map(this.$refs["map"], {
                zoom: 5,
                center: new google.maps.LatLng(latitude, longitude),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
            });

            if (showMarker){
                new google.maps.Marker({
                    position: new google.maps.LatLng(latitude, longitude),
                    draggable: true,
                    map: map,
                });
            }
            },

        showRouteOntheMap(){
        /* ROUTE FOMAT
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
        }
    },
    



    mounted(){
        this.showUserLocationOnTheMap(this.lat,this.lng,false)

        // if(navigator.geolocation){
        //     navigator.geolocation.getCurrentPosition(pos=>{
        //         this.lat = pos.coords.latitude;
        //         this.lng = pos.coords.longitude;
        //         this.showUserLocationOnTheMap(this.lat,this.lng)
        //     },(err)=>{
        //         this.showUserLocationOnTheMap(this.lat,this.lng)
        //     })
        // }

        // var map = new google.maps.Map(this.$refs["map"], {
        // zoom: 15,
        // center: new google.maps.LatLng(39, -98.5795),
        // mapTypeId: google.maps.MapTypeId.ROADMAP,
        // gestureHandling: 'greedy',
        // draggable: true,
        // });

        // new google.maps.Marker({
        //     position: new google.maps.LatLng(39.8283, -98.5795),
        //     draggable: true,
        //     map: map,
        //     });


        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();

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

#map {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

</style>
