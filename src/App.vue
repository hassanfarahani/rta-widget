<template>
  <div id="app">
    <div class="main-wrapper">
      <Header />
      <div class="inputs-schematic-plots">
        <Inputs />
        <div class="schematic-plots">
          <Schematic />
          <PlotsHeader />
          <!-- <router-view></router-view> -->
        </div>
      </div>
    </div>   
  </div>
</template>

<script>
import '@/assets/css/styles.css'
import Header from '@/components/Header.vue'
import Inputs from '@/components/Inputs.vue'
import Schematic from '@/components/Schematic.vue'
import ProductionPlots from '@/components/ProductionPlots.vue'
import RnpPlots from '@/components/RnpPlots.vue'
import PlotsHeader from '@/components/PlotsHeader.vue'

export default {
  name: 'App',
  components: {
    Header,
    Inputs,
    Schematic,
    ProductionPlots,
    RnpPlots,
    PlotsHeader
  }
}
</script>

<style>

</style>
