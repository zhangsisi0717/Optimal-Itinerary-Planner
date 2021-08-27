<template>
    <div>
        <section id="map" ref="map"></section>
        <!-- <PlacesInputPanel v-show="showPlacesInputPanel" id="places-input-panel"/> -->
        
    </div>
</template>

<script>
import {EventBus} from "@/EventBus"
import NaviBar from "@/components/NaviBar"
// import PlacesInputPanel from "@/components/PlacesInputPanel"


export default {
    name: "Mapview",
    // components:{NaviBar,PlacesInputPanel},
    components:{NaviBar},
    
    data(){
        return {
            map:null,
            lat:39.8283,
            lng:-98.5795,
            // showPlacesInputPanel:true
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
        EventBus.$on("route-data",(routes)=>{
            if(routes){
            console.log("mapView received data ========")
            console.log(routes)
            // console.log(`from= ${data.origin.address}`)
            // console.log(`to= ${data.destination.address}`)
            // for(let idx =0; idx<routes.length; idx++){
            //     var data = routes[idx];
            //     console.log(`data = ${data}`);
            const directionsService = new google.maps.DirectionsService();
            this.resetMap();
            console.log("after reset map")
            // console.log("received routes =")
            // console.log(routes[0])
            // console.log(routes[1])
            // console.log(routes[2])

            routes.forEach((data) => {
                console.log("routes. for each = ")
                console.log(data)
                // console.log("routes.for each data:");
                // console.log(data);
                
            directionsService.route({
                origin: new google.maps.LatLng(data.origin.lat,data.origin.lng),
                destination: new google.maps.LatLng(data.destination.lat,data.destination.lng),
                travelMode: 'DRIVING',
            }, 
            (response,status)=>{
                if(status === "OK"){
                    console.log("map view status === OK");
                    // this.resetMap()
                   
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

        });


        //reveive data: route-data and render all the routes, after "calculate" clicked
        EventBus.$on("route-data-to-mapview",(routes)=>{
            console.log("route-data-to-mapView received data ========")
            console.log(routes)
            // console.log(`from= ${data.origin.address}`)
            // console.log(`to= ${data.destination.address}`)
            // for(let idx =0; idx<routes.length; idx++){
            //     var data = routes[idx];
            //     console.log(`data = ${data}`);
            const directionsService = new google.maps.DirectionsService();
            console.log("after create directionsService ")
            this.resetMap();
            console.log("after reset map")
            // console.log("received routes =")
            // console.log(routes[0])
            // console.log(routes[1])
            // console.log(routes[2])

            routes.forEach((data) => {
                console.log("routes. for each = ")
                console.log(data)
                // console.log("routes.for each data:");
                // console.log(data);
                
            directionsService.route({
                origin: new google.maps.LatLng(data.origin.lat,data.origin.lng),
                destination: new google.maps.LatLng(data.destination.lat,data.destination.lng),
                travelMode: 'DRIVING',
            }, 
            (response,status)=>{
                if(status === "OK"){
                    console.log("map view status === OK");
                    // this.resetMap()
                   
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


        });






        EventBus.$on("route-data-from-routeList",(routes)=>{
            const directionsService = new google.maps.DirectionsService();
            this.resetMap();
            console.log("received routes =")
            console.log(routes[0])
            console.log(routes[1])
            console.log(routes[2])

            routes.forEach((data) => {
                console.log("routes.for each data:");
                console.log(data);
                
            directionsService.route({
                origin: new google.maps.LatLng(data.origin.lat,data.origin.lng),
                destination: new google.maps.LatLng(data.destination.lat,data.destination.lng),
                travelMode: 'DRIVING',
            }, 
            (response,status)=>{
                if(status === "OK"){
                    
                    // this.resetMap()
                   
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


        });

    }
}
</script>

<style scoped>

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
