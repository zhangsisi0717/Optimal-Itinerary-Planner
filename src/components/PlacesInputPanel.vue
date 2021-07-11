<template>
    <section class="ui three column grid">
        <div class="column">
            <form class="ui segment large form">
                <div class="ui message red" v-show="errorMessage">{{errorMessage}}</div>
                <div class="ui segment">
                    <div class="field">
                        <div class = "ui right icon input large" :class="{loading:spinner}">
                        <!-- <div class = "ui right icon input large"> -->
                            <input type="text" placeholder="Add your destinations" v-model="address" ref="autocomplete">
                            <!-- <div class="ui tiny active loader" v-show="spinner" id="loader1"></div>  -->
                            <i class="dot circle link icon"  id="dot-icon" @click="findCurrentLocation"></i>
                            
                        </div>
                        <button class="medium ui button" id="add-button" @click="addNewDestination">Add</button>
                        
                    </div>
                </div>
                <h1 v-show="destinationArray.length>0">Lists of stops:</h1>
                <div class="ui list">
                    <!-- <div class="item" v-for="place in destinationArray" v-bind:key="place"> -->
                        <div class="item" v-for ="(place,index) in destinationArray">
                        <i class="map marker icon"></i>
                        <div class="content">
                        <h3 class="header">{{place}} <span><i class="window close outline icon" @click="removeThisLocation(index)"></i></span></h3>
                        </div>
                    </div>
                <form class="ui segment"  v-show="destinationArray.length>0" id="tranportation">
                    <div id="trasnInside">
                        <button id="car-button" v-bind:class=" carIconclicked ? 'green' : 'white' "/></button>
                        <i class="car icon" v-on:click="carIconclicked = !carIconclicked"></i>

                        <button id="bicycle-button" v-bind:class=" bicycleIconClicked ? 'green' : 'white' "/></button>
                        <i class="bicycle icon" v-on:click="bicycleIconClicked = !bicycleIconClicked"></i>

                        <button id="subway-button" v-bind:class=" subwayIconClicked ? 'green' : 'white' "/></button>
                        <i class="subway icon" v-on:click="subwayIconClicked = !subwayIconClicked"></i>

                        <button id="male-button" v-bind:class=" walkingIconClicked ? 'green' : 'white' "/></button>
                        <i class="male icon" v-on:click="walkingIconClicked = !walkingIconClicked"></i>

                        <button class="small ui button" id="calculate" @click="calculateOptimalItinerary">calculate</button>
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
        destinationArray:[],
        destinationArrayDetail:[],
        allRoutes:[],
        errorMessage: "",
        spinner: false,
        apiKey: "AIzaSyAdxXoKAF0KG0yAWKXRiKyOby9YfHUxOug",
        carIconclicked: true,
        bicycleIconClicked:false,
        subwayIconClicked:false,
        walkingIconClicked:false
        }
    },


    methods:{
        addNewDestination(){
            console.log("add location pressed");
            console.log(`this.address=${this.address}`);
            console.log(`current locations = ${this.destinationArrayDetail}`)
            // console.log(`this.lat,this.lng=${this.latitude},${this.longitude}`);
            this.errorMessage = "";
           if (!this.address){
                this.errorMessage = "Please input valid address";
            }
            else if(!this.destinationArray){
                const locationDetail = {
                    address:this.address,
                    lat:this.lat,
                    lng:this.lng
                    };
                this.destinationArray.push(this.address);
                this.destinationArrayDetail.push(locationDetail)

            }else{
                
                const index = this.destinationArray.indexOf(this.address);
                
                // let index = this.destinationArray.findIndex(element => {
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
                        lng:this.lng
                        };
                        this.destinationArray.push(this.address);
                        this.destinationArrayDetail.push(locationDetail)
                    }
            }
        
            console.log(this.destinationArray);
        }
        ,


        removeThisLocation(index){
            this.errorMessage = "";
            if (index > -1) {
            this.destinationArray.splice(index, 1);
            this.destinationArrayDetail.splice(index,1);
            console.log(`after delete, current locations = ${this.destinationArrayDetail}`);
            console.log(this.destinationArrayDetail);
            }
        },


        findCurrentLocation(){
            this.spinner = true;
            this.errorMessage="";
            console.log("locator start!");
            console.log(this.spinner)
            if(navigator.geolocation){ //check if user's browser support this Geolocation api
             navigator.geolocation.getCurrentPosition(pos=>{
                 this.coordinateToAddress(pos.coords.latitude,pos.coords.longitude)
                 console.log(pos.coords.latitude,pos.coords.longitude)
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
            for(let i=0; i<this.destinationArrayDetail.length;i++){
                var place = new google.maps.LatLng(this.destinationArrayDetail[i].lat, this.destinationArrayDetail[i].lng);
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
                    var routes = new Array(this.destinationArrayDetail.length);
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
                                origin:{address:from,lat:this.destinationArrayDetail[i].lat, lng:this.destinationArrayDetail[i].lng},
                                destination:{address:to,lat:this.destinationArrayDetail[j].lat, lng:this.destinationArrayDetail[j].lng}, 
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
            this.requestRoutesInfo((allRoutesData)=>{
                if(allRoutesData){
                console.log("run here all routes")
                // console.log(`this.allroutes=${this.allRoutes}`);
                console.log(`this.allroutes[0][0]=${allRoutesData[0][1]}`);
                // console.log(this.allRoutes[0][0]);
                console.log("emit route-data, this.routes[0][0]")
                EventBus.$emit("route-data",allRoutesData[0][1]);
                
                }
            });
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
#add-button{
    color: white;
    position: relative;
    top:10px;
    left:330px;
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
    color:white;
    margin: -4px;
    
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

</style>
