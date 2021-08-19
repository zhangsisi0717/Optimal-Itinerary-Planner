<template>
    <div>
        <h1>Optimal Routes List:</h1>
        <section class="ui three column grid" id="input-panel">
          <form class="ui segment large form">
          <h2>Results:</h2>
          <button @click="showAllRoutesOnMap">show all routes</button>
          <i class="save outline icon" v-show="!curRoutesSaved && user" @click="saveCurrentRoutes"></i>
          <i class="save icon" v-show="curRoutesSaved"></i>
          <div class="item" v-for ="route in calculatedRouteLists" @click="showThisRouteOnMap(route)">
            <div> 
              <i class="marker alternate icon"></i>
              {{route.origin.address}}
            </div>
            <div>
              <i class="flag checkered icon"></i>
              {{route.destination.address}}
            </div>
            <div class="ui label small">{{route.distance.text}}</div>
            <div class="ui label small">{{route.duration.text}}</div>
        </div>
        </form>
      </section>
    </div>
</template>

<script>
import {EventBus} from "@/EventBus"
import firebase from "firebase"
import db from "@/firebase/init"

export default {
    name: 'RouteList',
    // components:{NaviBar,PlacesInputPanel,Mapview}
    components:{
    },

    data(){
      return {
        test:null,
        user: null,
        calculatedRouteLists:[],
        curRoutesSaved:false
        // allCalculatedRouteLists:[]
      }
      },

    methods:{
      showThisRouteOnMap(route){
        let singleRouteData = [route];
        EventBus.$emit("route-data-from-routeList",singleRouteData);
      },

      showAllRoutesOnMap(){
        EventBus.$emit("route-data-from-routeList",this.calculatedRouteLists);
      },

      saveCurrentRoutes(){
        console.log("save routes")
        this.curRoutesSaved = true;
        console.log(this.curRoutesSaved);


        db.collection('users').where('UID','==',this.user.uid).get().then(snapshot=>{
            console.log("snap shot")
            console.log(snapshot)
            snapshot.forEach((doc)=>{

              console.log("doc=")
              console.log(doc.data().calculatedItineraryHistory)
              let routesHistory = doc.data().calculatedItineraryHistory
              let newRoutes = {"routes":this.calculatedRouteLists}
              console.log("new route=")
              console.log(newRoutes)
              routesHistory.push(newRoutes)
              // routesHistory.push(this.calculatedRouteLists)
              db.collection('users').doc(doc.id).update({
                calculatedItineraryHistory: routesHistory
              })

            })

        })
      }
    },

    created(){
        this.user = firebase.auth().currentUser;
        EventBus.$on("route-data",(data)=>{
        console.log("route list received data")
        this.calculatedRouteLists=[]
        // this.allCalculatedRouteLists=[]
        if(data){
          this.calculatedRouteLists = data
          this.allCalculatedRouteLists = data
          // console.log("this.calculatedRouteLists=")
          // console.log(this.calculatedRouteLists)
        }

      });
          },

    mounted(){
      // EventBus.$on("route-data2",(data)=>{
      //   console.log("route list received data")
      //   this.calculatedRouteLists=[]
      //   // this.allCalculatedRouteLists=[]
      //   if(data){
      //     this.calculatedRouteLists = data
      //     this.allCalculatedRouteLists = data
      //     // console.log("this.calculatedRouteLists=")
      //     // console.log(this.calculatedRouteLists)
      //   }

      // });
    }
  }

</script>

<style scoped>
.item{
  margin: 10px;
  cursor: pointer;
}

.item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

</style>
