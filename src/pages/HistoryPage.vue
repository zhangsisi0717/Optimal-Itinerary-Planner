<template>
    <div>
        <NaviBar/>
        <History/>

    </div>
</template>
<script>
import NaviBar from "@/components/NaviBar"
import History from "@/components/History"
export default {
    name: "HistoryPage",
    components:{NaviBar,History}
    
}
</script>