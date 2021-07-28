<template>
    <div>
        <NaviBar/>
        <Mapview/>
        <RouteList/>
        
        
        
        <!-- <section id="map" ref="map"></section> -->
        <!-- <PlacesInputPanel v-show="showPlacesInputPanel" id="places-input-panel"/> -->
        
    </div>
</template>


<script>
import NaviBar from "@/components/NaviBar"
import RouteList from "@/components/RouteList"
import Mapview from "@/components/Mapview"


export default {
  name: 'ResultMapview',
  // components:{NaviBar,PlacesInputPanel,Mapview}
  components:{NaviBar,RouteList, Mapview},

data(){
  return {}
},

methods:{
},
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
