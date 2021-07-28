<template>
    <div>
    <h1>Optimal Routes List:</h1>
    <section class="ui three column grid" id="input-panel">
    <form class="ui segment large form">
      <!-- <div class="ui message grey" >Optimal Itinerary</div> -->
    <div class="ui list">
      <h2>results:</h2>
    <div class="item">
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
    </div>
    

    
    <div class="item">
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
    </div>
    </div>

    </form>
    </section>
    </div>
</template>

<script>
export default {
  name: 'RouteList',
  // components:{NaviBar,PlacesInputPanel,Mapview}
  components:{}
}
</script>

<style scoped>
.item{
  margin: 10px;
}

</style>
