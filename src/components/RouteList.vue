<template>
    <div>
    <h1>Optimal Routes List:</h1>
    <section class="ui three column grid" id="input-panel">
    <form class="ui segment large form">
      <!-- <div class="ui message grey" >Optimal Itinerary</div> -->
    <div class="ui list">
      <h2>Results:</h2>
    <div class="item" v-for ="route in calculatedRouteLists">
      <div> 
        <i class="marker alternate icon"></i>
        {{route.origin.address}}
      </div>
      <div>
        <i class="flag checkered icon"></i>
        {{route.destination.address}}
      </div>
      <div class="ui label small">200miles</div>
      <div class="ui label small">5h</div>
    </div>
    

    
    <!-- <div class="item">
      <div>
        <i class="marker alternate icon"></i>
        1575 Oak Avenue
      </div>
      <div>
        <i class="flag checkered icon"></i>
        6601 Kingsbury blvd
      </div>
      <div class="ui label small">200miles</div>
      <div class="ui label small">5h</div>
    </div> -->
    </div>

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
        calculatedRouteLists:[]
      }
      },

    methods:{},

    mounted(){
      EventBus.$on("route-data2",(data)=>{
        console.log("route list received data")
        this.calculatedRouteLists=[]
        if(data){
          this.calculatedRouteLists = [data]
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
}

</style>
