<template>
  <div id="app">
    <NaviBar/>
    <!-- <PlacesInputPanel/> -->
    <!-- <Mapview/> -->
    <router-view/>
  </div>
</template>

<script>
import NaviBar from "@/components/NaviBar"
// import PlacesInputPanel from "@/components/PlacesInputPanel"
// import Mapview from "@/components/Mapview"

export default {
  name: 'App',
  // components:{NaviBar,PlacesInputPanel,Mapview}
  components:{NaviBar}
}
</script>


