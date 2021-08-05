<template>
    <div>
        <h1>Optimal Routes List:</h1>
        <section class="ui three column grid" id="input-panel">
          <form class="ui segment large form">
          <!-- <div class="ui list"> -->
          <h2>Results:</h2>
          <button @click="showAllRoutesOnMap">show all routes</button>
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
        <!-- </div> -->
        </form>
      </section>
    </div>
</template>

<script>
import {EventBus} from "@/EventBus"

export default {
    name: 'RouteList',
    // components:{NaviBar,PlacesInputPanel,Mapview}
    components:{},

    data(){
      return {
        calculatedRouteLists:[],
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
      }
    },

    mounted(){
      EventBus.$on("route-data2",(data)=>{
        console.log("route list received data")
        this.calculatedRouteLists=[]
        // this.allCalculatedRouteLists=[]
        if(data){
          this.calculatedRouteLists = data
          this.allCalculatedRouteLists = data
          console.log("this.calculatedRouteLists=")
          console.log(this.calculatedRouteLists)
        }

      });
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
