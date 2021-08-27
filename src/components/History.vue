<template>
    <div>
        <h1>Saved Itinerary</h1>
        <!-- <section class="ui two column grid" id="input-panel"> -->
            <form class="ui segment large form">
                <div class="item" v-for ="(route, index) in routesHistory" id="saved-routes" @click="renderThisItinerary(route)">
                    <!-- <button><router-link :to="{ name: 'ResultMapview'}" style="text-decoration: none; color: inherit;">click</router-link></button> -->
                     <!-- <router-link :to="{ name: 'ResultMapview'}" style="text-decoration: none; color: inherit;"></router-link> -->
                   
                    <div>
                        <h3>No. {{index+1}}
                        <button id="detail"><router-link :to="{ name: 'ResultMapview'}" style="text-decoration: none; color: inherit;">show detail</router-link></button>
                        </h3>
                        <i class="marker alternate icon"></i>
                        Origin: {{route.routes[1].origin.address}}
                    </div>
                    <div>
                        <i class="flag checkered icon"></i>
                        Destination: {{route.routes[2].origin.address}}
                    </div>
                </div> 
            </form>
        <!-- </section> -->
    </div>
</template>
<script>
import firebase from "firebase"
import db from "@/firebase/init"
import {EventBus} from "@/EventBus"

export default {
    name: "History",
    data(){
        return {
            routesHistory:null,
            user: null,
        }
    },
    created(){
        this.user = firebase.auth().currentUser;
        db.collection('users').where('UID','==',this.user.uid).get().then(snapshot=>{
            console.log("snap shot")
            console.log(snapshot)
            snapshot.forEach((doc)=>{

              console.log("doc=")
              console.log(doc.data().calculatedItineraryHistory)
              this.routesHistory = doc.data().calculatedItineraryHistory

            })

        })
      },

    methods:{
        renderThisItinerary(route){
            console.log(route.routes);
            EventBus.$emit("route-data-to-routelist",route.routes);
            EventBus.$emit("route-data-to-mapview",route.routes);
            // EventBus.$emit("route-data",route.routes);
            // this.$router.push({name:'ResultMapview'});

        }
    },
    }


</script>

<style scoped>
.item{
  margin: 10px;
  /* cursor: pointer; */
}

#detail{
    font-size:small;
}
.item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

</style>