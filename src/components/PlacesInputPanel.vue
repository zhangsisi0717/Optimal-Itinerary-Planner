<template>
    <section class="ui three column grid" id="input-panel">
        <div class="column">
            <form class="ui segment large form">
                <div class="ui message red" v-show="errorMessage">{{errorMessage}}</div>
                <div class="ui segment">
                    <div class="field">
                        <div class = "ui right icon input large" :class="{loading:spinner}">
                            <input type="text" placeholder="Enter address here" v-model="address" ref="autocomplete">
                            <i class="dot circle link icon"  id="dot-icon" @click="findCurrentLocation"></i>
                            
                        </div>
                        <button class="tiny ui button" id="add-origin" @click="addOrigin">add origin</button>
                        <button class="tiny ui button" id="add-destination" @click="addDestination">add destination</button>
                        <button class="tiny ui button" id="add-stop" @click="addNewStops(false,false)">add stops</button>
                        
                    </div>
                </div>
                <!-- <h1 v-show="origin.length>0">Origin:</h1>
                    <div class="ui list" > 
                        <div class="item" v-show="origin.length>0">
                            <i class="map marker icon"></i>
                        <div class="content">
                        <h3 class="header" >{{origin[0]}} <span><i class="window close outline icon"></i></span></h3>
                        </div>
                        </div>
                    </div> -->

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
                        <i class="car icon" @click="carIconClicked"></i>

                        <button id="bicycle-button" v-bind:class=" bicycling ? 'green' : 'white' "/></button>
                        <i class="bicycle icon" @click="bicycleIconClicked"></i>

                        <button id="subway-button" v-bind:class=" transit ? 'green' : 'white' "/></button>
                        <i class="subway icon" @click="subwayIconClicked"></i>

                        <button id="male-button" v-bind:class=" walking ? 'green' : 'white' "/></button>
                        <i class="male icon" @click="walkingIconClicked"></i>

                        <button class="small ui button" id="calculate" @click="calculateOptimalItinerary"><router-link :to="{ name: 'ResultMapview'}" style="text-decoration: none; color: inherit;">calculate</router-link></button>
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
        destination: [],
        stopsArray:[],
        stopsArrayDetail:[],
        allRoutes:[],
        errorMessage: "",
        spinner: false,
        apiKey: "AIzaSyAdxXoKAF0KG0yAWKXRiKyOby9YfHUxOug",
        driving: true,
        bicycling:false,
        transit:false,
        walking:false
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
            console.log("add location pressed");
            console.log(`this.address=${this.address}`);
            console.log(`current locations = ${this.stopsArrayDetail}`)
            // console.log(`this.lat,this.lng=${this.latitude},${this.longitude}`);
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
                
                // let index = this.stopsArray.findIndex(element => {
                // if (element.address === this.address) {
                //     return true;
                // }
                // });
                if (index > -1) {
                    this.errorMessage = "Address already exists";
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
            console.log("locator start!");
            console.log(this.spinner)
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
                travelMode: 'DRIVING',
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

        calculateOptimalItinerary(){
            // this.$router.push({name:"ResultMapview"});
            this.requestRoutesInfo((allRoutesData)=>{
                if(allRoutesData){
                console.log("run here all routes");
                // console.log(`this.allroutes=${this.allRoutes}`);
                console.log(`this.allroutes[0][0]=${allRoutesData[0][1]}`);
                // console.log(this.allRoutes[0][0]);
                console.log("emit route-data, this.routes[0][0]");

                const optimalRoutes = [];
                var idx = 0;
                while(idx < allRoutesData.length-1)  {
                    optimalRoutes.push(allRoutesData[idx][idx+1]);
                    idx +=1
                }
                optimalRoutes.push(allRoutesData[idx][0]);
                // 0->1->2->3
                console.log("optimal routes = ")
                console.log(optimalRoutes);

                // EventBus.$emit("route-data",allRoutesData[0][1]);
                EventBus.$emit("route-data",optimalRoutes);
                EventBus.$emit("route-data2",optimalRoutes);
                
                
                }
            });
        },

        bicycleIconClicked(){
            this.driving = false;
            this.bicycling=true;
            this.transit =false;
            this.walking =false;
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
        },

        walkingIconClicked(){
            this.driving = false;
            this.bicycling=false;
            this.transit =false;
            this.walking =true;
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
