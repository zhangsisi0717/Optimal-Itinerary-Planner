<template>
    <section class="ui three column grid" id="input-panel">
        <div class="column">
            <form class="ui segment large form">
                <div class="ui message red" v-show="errorMessage">{{errorMessage}}</div>
                <div class="ui segment">
                    <div class="field">
                        <div class = "ui right icon input large" :class="{loading:spinner}">
                            <input type="text" placeholder="Enter address here" v-model="address" ref="autocomplete">
                            <i class="dot circle link icon"  id="dot-icon" @click.prevent="findCurrentLocation"></i>
                            
                        </div>
                        <button class="tiny ui button" id="add-origin" @click.prevent="addOrigin">add origin</button>
                        <button class="tiny ui button" id="add-destination" @click.prevent="addDestination">add destination</button>
                        <button class="tiny ui button" id="add-stop" @click.prevent="addNewStops(false,false)">add stops</button>
                        
                    </div>
                </div>

                <h3 v-for ="(place,index) in stopsArray" v-show="stopsArrayDetail[index].isOrigin">Origin:</h3>
                <div class="ui list">
                        <div class="item" v-for ="(place,index) in stopsArray" v-show="stopsArrayDetail[index].isOrigin">
                        <i class="map marker icon"></i>
                        <div class="content">
                        <h4 class="header" >{{place}} <span><i class="window close outline icon" @click="removeThisLocation(index)"></i></span></h4>
                        </div>
                    </div>
                </div>

                <h3 v-for ="(place,index) in stopsArray" v-show="stopsArrayDetail[index].isDestination">Destination:</h3>
                <div class="ui list">
                        <div class="item" v-for ="(place,index) in stopsArray" v-show="stopsArrayDetail[index].isDestination">
                        <i class="map marker icon"></i>
                        <div class="content">
                        <h4 class="header" >{{place}} <span><i class="window close outline icon" @click="removeThisLocation(index)"></i></span></h4>
                        </div>
                    </div>
                </div>


                <h3 v-show="stopsArray.length - origin.length - destination.length>0">Lists of stops:</h3>
                <div class="ui list">
                    <!-- <div class="item" v-for="place in stopsArray" v-bind:key="place"> -->
                        <div class="item" v-for ="(place,index) in stopsArray" v-show="!stopsArrayDetail[index].isOrigin && !stopsArrayDetail[index].isDestination">
                        <i class="map marker icon"></i>
                        <div class="content">
                        <h4 class="header" >{{place}} <span><i class="window close outline icon" @click="removeThisLocation(index)"></i></span></h4>
                        </div>
                    </div>
                <form class="ui segment"  v-show="stopsArray.length>0" id="tranportation">
                    <div id="trasnInside">
                        <button id="car-button" v-bind:class=" driving ? 'green' : 'white' "/></button>
                        <i class="car icon" @click.prevent="carIconClicked"></i>

                        <button id="bicycle-button" v-bind:class=" bicycling ? 'green' : 'white' "/></button>
                        <i class="bicycle icon" @click.prevent="bicycleIconClicked"></i>

                        <button id="subway-button" v-bind:class=" transit ? 'green' : 'white' "/></button>
                        <i class="subway icon" @click.prevent="subwayIconClicked"></i>

                        <button id="male-button" v-bind:class=" walking ? 'green' : 'white' "/></button>
                        <i class="male icon" @click.prevent="walkingIconClicked"></i>

                        <button class="small ui button" id="calculate" @click="calculateOptimalItinerary"><router-link :to="{ name: 'ResultMapview'}" style="text-decoration: none; color: inherit;">calculate</router-link></button>
                        <!-- <button class="small ui button" id="calculate" @click="calculateOptimalItinerary">calculate</button> -->

                    </div>
                    
                </form>
                </div>
            </form>
        </div>
    </section>
</template>

<script>
import axios from "axios"
import {EventBus} from "@/EventBus"

export default{
    name:"PlacesInputPanel",
    data(){
        return{
        address:"",
        lat:"",
        lng:"",
        origin:[],
        origin_idx:null,
        destination: [],
        destination_idx:null,
        stopsArray:[],
        stopsArrayDetail:[],
        allRoutes:[],
        distanceMatrix:null,
        errorMessage: "",
        spinner: false,
        apiKey: "AIzaSyAdxXoKAF0KG0yAWKXRiKyOby9YfHUxOug",
        driving: true,
        bicycling:false,
        transit:false,
        walking:false,
        travelMode:"DRIVING",

        }
    },


    methods:{
        addOrigin(){
            if(this.origin.length==0){
           this.addNewStops(true,false);
                }
           else{
               this.errorMessage = "origin already exists, please remove it first before adding a new one"
           }
           console.log(this.stopsArrayDetail)
            },


        addDestination(){
            if(this.destination.length==0){
                this.addNewStops(false,true);
            }
           else{
               this.errorMessage = "destination already exists, please remove it first before adding a new one"
           }
           console.log(this.stopsArrayDetail)

        },
        

        addNewStops(isOrigin,isDestination){
            
            this.errorMessage = "";
           if (!this.address){
                this.errorMessage = "Please input valid address";
            }
            else if(!this.stopsArray){
                const locationDetail = {
                    address:this.address,
                    lat:this.lat,
                    lng:this.lng,
                    isOrigin:isOrigin,
                    isDestination:isDestination,
                    };
                this.stopsArray.push(this.address);
                this.stopsArrayDetail.push(locationDetail)
                if (isOrigin){
                    this.origin = [this.address];
                    }
                
                if (isDestination){
                    this.destination = [this.address];
                }

                

            }else{
                
                const index = this.stopsArray.indexOf(this.address);

                if (index>-1 && this.address != this.origin[0] && this.address != this.destination[0]) {
                    this.errorMessage = "duplicate stops/stops can not be the same with origin/destination";
                }
                else if (index>-1 && isOrigin && this.address == this.origin[0]){
                    this.errorMessage = "duplicate origin";
                }
                else if (index>-1 && isDestination && this.address == this.destination[0]){
                    this.errorMessage = "duplicate destination";
                }
                else if(index>-1 && !isOrigin && !isDestination && (this.address==this.origin[0] || this.address==this.destination[0])){
                    this.errorMessage = "stops can not be the same with origin/destination"
                }
                else{
                    const locationDetail = {
                        address:this.address,
                        lat:this.lat,
                        lng:this.lng,
                        isOrigin:isOrigin,
                        isDestination:isDestination,
                        };
                        this.stopsArray.push(this.address);
                        this.stopsArrayDetail.push(locationDetail)
                        if (isOrigin){
                            this.origin = [this.address];
                            }
                
                        if (isDestination){
                            this.destination = [this.address];
                        }
                    }
            }
        
            
            this.renderAllStopsMarkers();
        console.log(this.stopsArrayDetail);
        }
        ,

        renderAllStopsMarkers(){
            console.log("render all stops markder called");
            console.log("emit destination-array");
            EventBus.$emit("destination-array",this.stopsArrayDetail);
        },


        removeThisLocation(index){
            this.errorMessage = "";
            if (index > -1) {
                if(this.stopsArrayDetail[index].isOrigin){
                    this.origin = [];
                }
                if(this.stopsArrayDetail[index].isDestination){
                    this.destination = [];
                }
                this.stopsArray.splice(index, 1);
                this.stopsArrayDetail.splice(index,1);
                console.log(`after delete, current locations = ${this.stopsArrayDetail}`);
                console.log(this.stopsArrayDetail);
            }
            this.renderAllStopsMarkers();
        },


        findCurrentLocation(){
            this.spinner = true;
            this.errorMessage="";
            // console.log("locator start!");
            // console.log(this.spinner)
            if(navigator.geolocation){ //check if user's browser support this Geolocation api
             navigator.geolocation.getCurrentPosition(pos=>{
                 this.lat = pos.coords.latitude;
                 this.lng = pos.coords.longitude;
                 this.coordinateToAddress(pos.coords.latitude,pos.coords.longitude);
                 console.log(pos.coords.latitude,pos.coords.longitude);
                //  this.spinner = false
             },
             errorMessage=>{
                 this.errorMessage= "locator can not find your location, please input manually"
                //  this.spinner = false
                 console.log(errorMessage.message)
             });
            }
            else{
                this.errorMessage = "browser does not support geolocation, please input manually"
                // this.spinner = false
                
            }
            // this.spinner = false
        },


        coordinateToAddress(latitude,longitude){
            this.spinner = true
            axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.apiKey}`).then((response) =>{
                if(response.data.error_message){
                    this.errorMessage = response.data.error_message
                    console.log(response.data.error_message)
                    this.spinner = false
                }
                else{
                    this.address = response.data.results[0].formatted_address
                    this.spinner = false
                    console.log(response.data.results[0].formatted_address)
                }
                
            }).catch(error=>{
                this.errorMessage = error.message
                this.spinner = false
                console.log(error.message)
            })
        },
 
        requestRoutesInfo(callback){

            let originsArray = [];
            let destinationsArray = [];
            for(let i=0; i<this.stopsArrayDetail.length;i++){
                var place = new google.maps.LatLng(this.stopsArrayDetail[i].lat, this.stopsArrayDetail[i].lng);
                originsArray.push(place);
                destinationsArray.push(place);
            }
            
            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
            {
                origins: originsArray,
                destinations: destinationsArray,
                travelMode: this.travelMode,
                transitOptions: null,
                drivingOptions: null,
                unitSystem: null,
                avoidHighways: null,
                avoidTolls: null,
            }, (response,status)=>{
                if(status == "OK"){
                    var routes = new Array(this.stopsArrayDetail.length);
                    for (var idx = 0; idx < routes.length; idx++) {
                        routes[idx] = new Array(routes.length);
                    }

                    var origins = response.originAddresses;                 
                    var destinations = response.destinationAddresses;
                  
                    for (var i = 0; i < origins.length; i++) {
                                      
                        var results = response.rows[i].elements;
                        for (var j = 0; j < results.length; j++) {
                            var element = results[j];
                            var distance = element.distance;
                            var duration = element.duration;
                            var from = origins[i];
                            var to = destinations[j];
                            console.log(i,j)
                            console.log(`from,origins[i]=${origins[i]},to,destinations[j]=${destinations[j]}`);

                
                            var route = {
                                origin:{address:from,lat:this.stopsArrayDetail[i].lat, lng:this.stopsArrayDetail[i].lng},
                                destination:{address:to,lat:this.stopsArrayDetail[j].lat, lng:this.stopsArrayDetail[j].lng}, 
                                distance:distance,
                                duration:duration,
                                };
                            console.log(route);
                            routes[i][j] = route;
                        }
                    }

                    this.allRoutes = routes;
                    console.log(this.allRoutes);
                    callback(this.allRoutes);
                    
                }
                else if(status == "NOT_FOUND"){
                    this.errorMessage = "The origin and/or destination of this pairing could not be geocoded."
                }
                else if(status == "ZERO_RESULTS"){
                    this.errorMessage = "No route could be found between the origin and destination."
                }

            });
            
        },

        generateDistanceMatrix(allRoutesData){
            console.log("start generate distance matrix");
            let stops_idx = []
            let distanceMatrix = []
            for (var i=0; i<this.stopsArrayDetail.length;i++){
                if(this.stopsArrayDetail[i].isOrigin){
                    this.origin_idx=i;
                }
                else if(this.stopsArrayDetail[i].isDestination){
                    this.destination_idx=i;
                }
                else{
                    stops_idx.push(i);
                }
            };
            // console.log(`origin idx=${origin_idx}, des_idx=${destination_idx}, stops=${stops_idx}`);
            // console.log(`origin =${this.stopsArrayDetail[origin_idx]}`);
            // console.log(`des=${this.stopsArrayDetail[destination_idx]}`);
            for(var r=0; r<this.stopsArrayDetail.length-1;r++){
                let temp_row = [];
                if(r===0){
                    temp_row.push(allRoutesData[this.origin_idx][this.origin_idx]);
                    for(var j=0;j<stops_idx.length;j++){
                        temp_row.push(allRoutesData[this.origin_idx][stops_idx[j]]);
                    }
                }
                else{
                    temp_row.push(allRoutesData[stops_idx[r-1]][this.destination_idx]);
                    for(var j=0;j<stops_idx.length;j++){
                        temp_row.push(allRoutesData[stops_idx[r-1]][stops_idx[j]])
                    }

                }
                distanceMatrix.push(temp_row);
                }
            // console.log("distance_matrix=");
            // console.log(distanceMatrix);
            return distanceMatrix
        },

        greedyMethod(distanceMatrix,origin=0){
            let n = distanceMatrix.length;

            let unvisited = new Set();
            for(var i=0; i<n;i++){
                unvisited.add(i)
            }

            let totalDistance = 0;
            let optimalRoutes = [origin];
            let cur_node = origin;
            while (unvisited.size > 1){
                // console.log(`current node = ${cur_node}`);
                unvisited.delete(cur_node);
                // console.log("after delete current node, unvisited becomes=");
                // console.log(unvisited);
                let minNode = null;
                let minDistance = Infinity;
                unvisited.forEach((node) => {
                    // console.log(`node=${node}`);
                    if (distanceMatrix[cur_node][node].duration.value < minDistance){
                        // console.log(`run here 1, distanceMatrix[cur_node][node]=${distanceMatrix[cur_node][node]}`)
                        minNode = node;
                        minDistance = distanceMatrix[cur_node][node].duration.value;
                    }
                });

                totalDistance += minDistance;
                cur_node = minNode;
                optimalRoutes.push(cur_node);
                
            }
            totalDistance += distanceMatrix[cur_node][origin].duration.value;

            return [optimalRoutes,totalDistance]
    
        },

        greedyEnumerateOriginsMethod(distanceMatrix){
            let n = distanceMatrix.length;
            let bestResult = [];
            let bestTotalDistance = Infinity
            for(var origin=0; origin<n; origin++){
                let result = this.greedyMethod(distanceMatrix,origin);
                let tempRoutes = result[0];
                let tempDistance = result[1];
                if (tempDistance < bestTotalDistance){
                    bestTotalDistance = tempDistance;
                    bestResult = tempRoutes;
                }

            }

            let originIdx = null;
            for(var index=0; index<bestResult.length;++index){
                if (bestResult[index] === 0){
                    originIdx = index;
                    break;
                }
            }
            let firstHalf = bestResult.slice(originIdx,);
            let secondHalf = bestResult.slice(0,originIdx);

            let finalResultIdx = firstHalf.concat(secondHalf);

            finalResultIdx.push(0);
            console.log("final result index ========");
            console.log(finalResultIdx);
            console.log("final routes are:===========")
            let finalRoutesResults = [];
            for(var j=0;j<finalResultIdx.length-1;++j){
                finalRoutesResults.push(this.distanceMatrix[finalResultIdx[j]][finalResultIdx[j+1]]);
                let thisroute = this.distanceMatrix[finalResultIdx[j]][finalResultIdx[j+1]];
                console.log(`from ${thisroute.origin.address} to ${thisroute.destination.address}`);
            }
            return finalRoutesResults
        },


        calculateOptimalItinerary(){
            // this.$router.push({name:"ResultMapview"});
            this.requestRoutesInfo((allRoutesData)=>{
                if(allRoutesData){
                console.log("run here all routes,allRoutesData=");
                console.log(allRoutesData);

                console.log("all stops detail:");
                console.log(this.stopsArrayDetail);

                this.distanceMatrix = this.generateDistanceMatrix(allRoutesData);
                let optimalResults = this.greedyEnumerateOriginsMethod(this.distanceMatrix);
                // optimal_results.push(this.destination_idx);
                // console.log(optimal_results[0]);
                // console.log(optimal_results[1]);

                // const optimalRoutes = [];
                // for(var idx=0;idx<optimal_results.length-1;idx++){
                //     optimalRoutes.push(allRoutesData[optimal_results[idx]][optimal_results[idx+1]]);
                // }
                // console.log("optimal routes = ")
                // console.log(optimalRoutes);

                let optimalRoutesAndTravelMode = [this.travelMode,optimalResults];
                EventBus.$emit("route-data",optimalRoutesAndTravelMode);
               
                
                }
            });
        },

        bicycleIconClicked(){
            this.driving = false;
            this.bicycling=true;
            this.transit =false;
            this.walking =false;
            this.travelMode = "BICYCLING";
        },

       carIconClicked(){
            this.driving = true;
            this.bicycling=false;
            this.transit =false;
            this.walking =false;
        },

        subwayIconClicked(){
            this.driving = false;
            this.bicycling=false;
            this.transit =true;
            this.walking =false;
            this.travelMode = "TRANSIT";
        },

        walkingIconClicked(){
            this.driving = false;
            this.bicycling=false;
            this.transit =false;
            this.walking =true;
            this.travelMode="WALKING";
        }



    },

    mounted(){
        
        var autocomplete = new google.maps.places.Autocomplete(
        this.$refs["autocomplete"],
      {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(45.4215296, -75.6971931)
        ),
      }
      );

        autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        this.lat = place.geometry.location.lat();
        this.lng = place.geometry.location.lng();
        this.address = `${place.name}, ${place.vicinity}`;
        
        console.log(this.address);
        console.log(`lat=${this.lat}, lng=${this.lng}`)
        // this.location.address = `${place.name}, ${place.vicinity}`;
        // console.log(`this.location.address = ${this.location.address}`)
        // this.location.lat =  place.geometry.location.lat();
        // this.location.lng = place.geometry.location.lng();
        // console.log(this.location);
        });
    }
}
</script>

<style scoped>
.ui-message{
    position: absolute;
    top: 0px;
    left:10px
}

/* #dot-icon{
    position: relative;
    left: 0px;
    top:0px
} */
#add-stop,#add-origin,#add-destination{
    color: white;
    position: relative;
    top:10px;
    left:0px;
    margin: 9px;
    background-color: rgb(41, 165, 130);
}

.white {
       background-color: white;
       width: 25px;
       height: 25px;  

}

.green {
    width: 25px;
    height: 25px;
    background-color:rgb(193, 221, 213);

}

.car.icon,.bicycle.icon,.subway.icon,.male.icon{
    position: relative;
    left: -24px;
    top: -3px;
}

#calculate{
    position: relative;
    left: 100px;
    top: -5px;
    background-color: rgb(41, 165, 130);
    color: white;
    margin: -4px;
    
}
.active button{
    color: inherit
}

#tranportation{
    background-color: rgb(247, 242, 242)
}

#trasnInside{
    position: relative;
    top:3px;
    left:15px;
    margin: -7px;

}

#loader1{
    position: relative;
    left: -20px;
    top: 20px;
}

#input-panel{
    position: relative;
    top: 40px
}

</style>
