<template>
<div>
    <NaviBar/>
    <Mapview/>
    <PlacesInputPanel/>

</div>

</template>

<script>

import NaviBar from "@/components/NaviBar"
import PlacesInputPanel from "@/components/PlacesInputPanel"
import Mapview from "@/components/Mapview"

export default {
  name: 'Main',
  // components:{NaviBar,PlacesInputPanel,Mapview}
  components:{NaviBar,PlacesInputPanel,Mapview}
}
</script>


<style scoped>

</style>
