<template>
    <div>
        <NaviBar/>
        <Signup/>

    </div>
</template>

<script>

import NaviBar from "@/components/NaviBar"
import Signup from "@/components/Signup"

export default {
  name: 'SignupPage',
  components:{NaviBar,Signup}
}
</script>


