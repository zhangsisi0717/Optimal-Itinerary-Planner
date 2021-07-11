<template>
<div>
    <NaviBar/>
    <Login/>

</div>
</template>



<script>

import NaviBar from "@/components/NaviBar"
import Login from "@/components/Login"

export default {
  name: 'LoginPage',
  // components:{NaviBar,PlacesInputPanel,Mapview}
  components:{NaviBar,Login}
}
</script>


