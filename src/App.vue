<template>
  <div id="app">
    <div class="main-wrapper">
      <Header />
      <div class="inputs-schematic-plots">
        <Inputs />
        <div class="schematic-plots">
          <Schematic />
          <Plots />
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
import Plots from '@/components/Plots.vue'

export default {
  name: 'App',
  components: {
    Header,
    Inputs,
    Schematic,
    Plots
  }
}
</script>

<style>

</style>
