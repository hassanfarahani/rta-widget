<template>
    <div>                     
        <div class="plots-box-graphs">
          <div id="production-plot">
            
              <div class="sliderRange">
                  <label class="labeltext">
                    Time (days): <em>{{ productionPlotSliderParams.sliderValues[0] }} - {{ productionPlotSliderParams.sliderValues[1] }}</em>
                  </label> 
                  <vue-slider 
                      ref="slider" 
                      v-model="productionPlotSliderParams.sliderValues" 
                      :min="productionPlotSliderParams.min" 
                      :max="productionPlotSliderParams.max" 
                      @change="reRenderPlotByUpdatedSliderValues('productionPlot')" 
                      :interval="1"
                      :enable-cross="false">
                      <template v-slot:dot="{ value, focus }">
                        <div :class="['custom-dot', { focus }]"></div>
                      </template>
                  </vue-slider>
              </div>
          </div>

          <div id="rta-plot">
            
            <div class="sliderRange">
                <label class="labeltext">
                  MBT (1/day): <em>{{ rtaPlotSliderParams.sliderValues[0] }} - {{ rtaPlotSliderParams.sliderValues[1] }}</em>
                </label> 
                <vue-slider 
                    ref="slider"
                    v-model="rtaPlotSliderParams.sliderValues" 
                    :min="rtaPlotSliderParams.min" 
                    :max="rtaPlotSliderParams.max" 
                    @change="reRenderPlotByUpdatedSliderValues('rtaPlot')"
                    :interval="1"
                    :enable-cross="false">
                    <template v-slot:dot="{ value, focus }">
                      <div :class="['custom-dot', { focus }]"></div>
                    </template>
                </vue-slider>
            </div>
          </div>
      </div>
    </div>
</template>

<script>
  import * as d3 from 'd3';
  import { plotsMixin } from './plotsMixin.js';

  export default {
    name: 'ProductionPlots',
    mixins: [plotsMixin],
    data() {
      return {

      }
    },
    watch: {
      plotsParams(val) {      
          this.updateLoadPlots('#production-plot', 'productionPlot', val);

          this.updateLoadPlots('#rta-plot', 'rtaPlot', val);
      }
    },
    mounted() {
      this.loadPlots('#production-plot', 'productionPlot', this.plotsParams);

      this.loadPlots('#rta-plot', 'rtaPlot', this.plotsParams);
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
