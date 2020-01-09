<template>
    <div>                     
        <div class="plots-box-graphs">

            <div id="rnp-plot">            
                <div class="sliderRange">
                    <label class="labeltext">
                        MBT (1/day): <em>{{ rnpPlotSliderParams.sliderValues[0] }} - {{ rnpPlotSliderParams.sliderValues[1] }}</em>
                    </label> 
                    <vue-slider 
                        ref="slider"
                        v-model="rnpPlotSliderParams.sliderValues" 
                        :min="rnpPlotSliderParams.min" 
                        :max="rnpPlotSliderParams.max" 
                        @change="reRenderPlotByUpdatedSliderValues('rnpPlot')"
                        :interval="1"
                        :enable-cross="false">
                        <template v-slot:dot="{ value, focus }">
                            <div :class="['custom-dot', { focus }]"></div>
                        </template>
                    </vue-slider>
                </div>
            </div>

            <div id="sqrt-plot">            
                <div class="sliderRange">
                    <label class="labeltext">
                        <span>&#8730;</span>t : <em>{{ sqrtPlotSliderParams.sliderValues[0] }} - {{ sqrtPlotSliderParams.sliderValues[1] }}</em>
                    </label> 
                    <vue-slider 
                        ref="slider"
                        v-model="sqrtPlotSliderParams.sliderValues" 
                        :min="sqrtPlotSliderParams.min" 
                        :max="sqrtPlotSliderParams.max" 
                        @change="reRenderPlotByUpdatedSliderValues('sqrtPlot')"
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
    name: 'RnpPlots',
    mixins: [plotsMixin],
    data() {
        return {

        }
    },
    watch: {
        plotsParams(val) { 
            this.updateLoadPlots('#rnp-plot', 'rnpPlot', val);

            this.updateLoadPlots('#sqrt-plot', 'sqrtPlot', val);
        }
    },
    mounted() {
        this.loadPlots('#rnp-plot', 'rnpPlot', this.plotsParams);  

        this.loadPlots('#sqrt-plot', 'sqrtPlot', this.plotsParams); 
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
