<template>
    <div>
        <section id="map" ref="map"></section>
        <!-- <PlacesInputPanel v-show="showPlacesInputPanel" id="places-input-panel"/> -->
        
    </div>
</template>

<script>
import {EventBus} from "@/EventBus"
import NaviBar from "@/components/NaviBar"
import PlacesInputPanel from "@/components/PlacesInputPanel"


export default {
    name: "Mapview",
    components:{NaviBar,PlacesInputPanel},
    
    data(){
        return {
            map:null,
            lat:39.8283,
            lng:-98.5795,
            showPlacesInputPanel:true
        }
        },
    methods:{
        resetMap(){
            this.map = new google.maps.Map(this.$refs["map"], {
            zoom: 5,
            center: new google.maps.LatLng(this.lat, this.lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        });
        }
    },
        // showUserLocationOnTheMap(latitude, longitude,showMarker) {
        // // Show & center the Map based oon
        //     var map = new google.maps.Map(this.$refs["map"], {
        //         zoom: 5,
        //         center: new google.maps.LatLng(latitude, longitude),
        //         mapTypeId: google.maps.MapTypeId.ROADMAP,
        //     });

        //     if (showMarker){
        //         new google.maps.Marker({
        //             position: new google.maps.LatLng(latitude, longitude),
        //             draggable: true,
        //             map: map,
        //         });
        //     }
        //     },

    //     showRouteOntheMap(){
    //     /* ROUTE FOMAT
    //         route = {
    //         origin:{address:from,lat:this.destinationArrayDetail[i].lat, lng:this.destinationArrayDetail[i].lng},
    //         destination:{address:to,lat:this.destinationArrayDetail[j].lat, lng:this.destinationArrayDetail[j].lng}, 
    //         distance:distance,
    //         duration:duration,
    //         };*/
    //         this.map = new google.maps.Map(this.$refs["map"], {
    //             zoom: 15,
    //             center: new google.maps.LatLng(this.lat, this.lng),
    //             mapTypeId: google.maps.MapTypeId.ROADMAP,
    //         });
    //         console.log("created a new map");

            
    //         const directionsService = new google.maps.DirectionsService();
    //         console.log("init a directionsService")
    //         const directionsRenderer = new google.maps.DirectionsRenderer();
    //         console.log("init a directionsRenderer")

    //         EventBus.$on("route-data",(data)=>{
    //             console.log("receive the route-data");
    //             console.log(`data.origin = ${data.origin.address}`);
    //             console.log(`data.des = ${data.destination.address}`);
    //             directionsService.route({
    //                 origin: data.origin.address,
    //                 destination: data.destination.address,
    //                 travelMode: 'DRIVING',
    //             }, (response,status)=>{
    //                 if(status === "OK"){
    //                     console.log("route request status == OK");
    //                     console.log("the response is:")
    //                     console.log(response)
    //                     directionsRenderer.setDirections(response);
    //                     directionsRenderer.setMap(this.map);
    //                 }
    //                 else{console.log(status)}
    //             })
    //         })
    //     }
    
        
    mounted(){

        this.resetMap();


        //Render all the markders/infoWindow: receive data: destination-array when "Add" button clicked
        EventBus.$on("destination-array",(data)=>{
            if (data){
                this.resetMap();
                console.log("data received");
                for (var idx=0;idx<data.length; idx++){
                    // console.log(`place.address = ${data[idx].address}`)
                    console.log(`place.lat,lng = ${data[idx].address}, ${data[idx].lat},${data[idx].lng}`)
                    new google.maps.Marker({
                        position: new google.maps.LatLng(data[idx].lat, data[idx].lng),
                        draggable: true,
                        map: this.map,
                    });

                    const infoWindow = new google.maps.InfoWindow({
                        content: `<div style="padding:5px;"><i class="flag icon"></i> ${data[idx].address}</div>`,
                        position: new google.maps.LatLng(data[idx].lat, data[idx].lng)
                    });
                    infoWindow.open(this.map, null);
                }
            }
        });

        //reveive data: route-data and render all the routes, after "calculate" clicked
        EventBus.$on("route-data",(data)=>{
            // console.log("received data")
            // console.log(`from= ${data.origin.address}`)
            // console.log(`to= ${data.destination.address}`)
            const directionsService = new google.maps.DirectionsService();
            directionsService.route({
                origin: new google.maps.LatLng(data.origin.lat,data.origin.lng),
                destination: new google.maps.LatLng(data.destination.lat,data.destination.lng),
                travelMode: 'DRIVING',
            }, 
            (response,status)=>{
                if(status === "OK"){
                    this.resetMap()
                   
                    const directionsRenderer = new google.maps.DirectionsRenderer({
                        suppressMarker: true
                    });
                    
                    const originLabel = new google.maps.InfoWindow({
                        content: `<i class="marker alternate icon"></i> ${data.origin.address}`,
                        position: new google.maps.LatLng(data.origin.lat,data.origin.lng)
                    })
                    originLabel.open(this.map,null)

                    const destinationLabel = new google.maps.InfoWindow({
                        content: `<i class="marker alternate icon"></i> ${data.destination.address}`,
                        position: new google.maps.LatLng(data.destination.lat,data.destination.lng),
                    })
                    destinationLabel.open(this.map,null)

                    // console.log("route request status == OK");
                    // console.log("the response is:")
                    // console.log(response)
                    directionsRenderer.setDirections(response);
                    directionsRenderer.setMap(this.map);
                }
                else{console.log(status)}
            })
        });

    }
}
</script>

<style>

#map {
  position: absolute;
  width:100%;
  height:100%;
  left: 0;
  right: 0;
  top: 89px;
  bottom: 0;
  /* z-index: -1; */
}

</style>
