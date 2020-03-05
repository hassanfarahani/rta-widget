<template>
    <div class="main-wrapper">
      <Header :lessonId="lessonId" />
      <div class="inputs-schematic-plots">
        <Inputs />
        <div class="schematic-plots">
          <Schematic />
          <div class="plots">                     
                <div class="plots-box">
                    <div class="plots-box-header">                         
                        <ul class="plots-list">
                            <!-- <li class="plots-list-item">
                                <span><i class="fas fa-chart-line" style="backgroundColor: #facc9d; color: rgb(245, 153, 32); border:1px solid rgb(245, 153, 32); padding: 0.1rem;"></i></span>
                            </li> -->
                            <li class="plots-list-item">
                                <router-link :to="{name: 'ProductionPlots'}" active-class="active" exact>Production Plots</router-link>
                            </li>
                            <li class="plots-list-item">
                                <router-link :to="{name: 'RnpPlots'}" active-class="active">Rate-Normalized Pressure Plots</router-link>
                            </li> 
                        </ul>
                    </div>
                    <router-view />
                </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { plotsMixin } from './plotsMixin.js'
import Header from '@/components/Header.vue'
import Inputs from '@/components/Inputs.vue'
import Schematic from '@/components/Schematic.vue'
import ProductionPlots from '@/components/ProductionPlots.vue'
import RnpPlots from '@/components/RnpPlots.vue'
import PlotsHeader from '@/components/PlotsHeader.vue'

export default {
  name: 'Lesson',
  data() {
    return {
      lessonId: this.$route.params.lessonId
    }
  },
  components: {
    Header,
    Inputs,
    Schematic,
    ProductionPlots,
    RnpPlots,
    PlotsHeader
  },
  created() {
      // extracting the number from lessonId
      let id = Number(this.lessonId.split('-')[1]);
      
      let inputSlidersDisplayList = [
                { porosity: id>=1 ? true : false },
                { permeability: id>=2 ? true : false },
                { fracHalfLength: id>=3 ? true : false },
                { fracHeight: id>=4 ? true : false },
                { fracSpacing: id>=5 ? true : false },
                { fracNum: id>=6 ? true : false },
                { compressibility: id>=7 ? true : false },
                { resPressure: id>=8 ? true : false },
                { flowingWellPressure: id>=9 ? true : false },
                { FVF: id>=10 ? true : false },
                { viscosity: id>=11 ? true : false },
                { rate: id>=12 ? true : false }
      ];

      this.$store.dispatch('getInputSlidersListToBeDisplayed', inputSlidersDisplayList);
  }
}
</script>

<style>

</style>
