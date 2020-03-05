<template>
    <div class="main-wrapper">
        <Header />
        <div class="lessons">
            <div class="lessons-box">
                <div class="lessons-box-header">List of RTA Lessons</div>
                <ul class="lessons-box-content">
                    <li :class="{ 'lessonListItem': lessonNumberToBeColored == 0 ? true : false }" @click="changeColorCode(0)">  
                        <router-link :class="{ 'lessonListItemLink': lessonNumberToBeColored == 0 ? true : false }" to="/lesson-1/production-plot" active-class="active" exact>Lesson One</router-link>
                    </li>
                    <li :class="{ 'lessonListItem': lessonNumberToBeColored == 1 ? true : false }" @click="changeColorCode(1)">
                        <router-link :class="{ 'lessonListItemLink': lessonNumberToBeColored == 1 ? true : false }" to="/lesson-2/production-plot" active-class="active" exact>Lesson Two</router-link>
                    </li>
                    <li :class="{ 'lessonListItem': lessonNumberToBeColored == 2 ? true : false }" @click="changeColorCode(2)">
                        <router-link to="/lesson-3/production-plot" active-class="active" exact>Lesson Three</router-link>
                    </li>
                    <li :class="{ 'lessonListItem': lessonNumberToBeColored == 3 ? true : false }" @click="changeColorCode(3)">
                        <router-link to="/lesson-4/production-plot" active-class="active" exact>Lesson Four</router-link>
                    </li>
                    <li :class="{ 'lessonListItem': lessonNumberToBeColored == 4 ? true : false }" @click="changeColorCode(4)">
                        <router-link to="/lesson-5/production-plot" active-class="active" exact>Lesson Five</router-link>
                    </li>
                    <li :class="{ 'lessonListItem': lessonNumberToBeColored == 5 ? true : false }" @click="changeColorCode(5)">
                        <router-link to="/lesson-6/production-plot" active-class="active" exact>Lesson Six</router-link>
                    </li>
                    <li :class="{ 'lessonListItem': lessonNumberToBeColored == 6 ? true : false }" @click="changeColorCode(6)">
                        <router-link to="/lesson-7/production-plot" active-class="active" exact>Lesson Seven</router-link>
                    </li>
                    <li :class="{ 'lessonListItem': lessonNumberToBeColored == 7 ? true : false }" @click="changeColorCode(7)">
                        <router-link to="/lesson-8/production-plot" active-class="active" exact>Lesson Eight</router-link>
                    </li>
                    <li :class="{ 'lessonListItem': lessonNumberToBeColored == 8 ? true : false }" @click="changeColorCode(8)">
                        <router-link to="/lesson-9/production-plot" active-class="active" exact>Lesson Nine</router-link>
                    </li>
                    <li :class="{ 'lessonListItem': lessonNumberToBeColored == 9 ? true : false }" @click="changeColorCode(9)">
                        <router-link to="/lesson-10/production-plot" active-class="active" exact>Lesson Ten</router-link>
                    </li>
                    <li :class="{ 'lessonListItem': lessonNumberToBeColored == 10 ? true : false }" @click="changeColorCode(10)">
                        <router-link to="/lesson-11/production-plot" active-class="active" exact>Lesson Eleven</router-link>
                    </li>
                    <li :class="{ 'lessonListItem': lessonNumberToBeColored == 11 ? true : false }" @click="changeColorCode(11)">
                        <!-- <router-link :style="{ color: lessonLinkColor}" to="/lesson-12/production-plot" active-class="active" exact>Lesson Twelve</router-link> -->
                        <router-link to="/lesson-12/production-plot" active-class="active" exact>Lesson Twelve</router-link>
                    </li>
                </ul>  
            </div>
        </div>      
    </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
    name: 'Lessons',
    data() {
        return {
             
        }
    },
    components: {
        Header
    },
    computed: {
        lessonNumberToBeColored() {
            return this.$store.getters.getLessonNumber;
        },
        // lessonLinkColor() {
        //     return this.lessonNumberToBeColored == 11 ? 'red' : null;
        // }
    },
    methods: {
        changeColorCode(number) {
            this.$store.dispatch('getLessonNumberToBeColored', number);
        }
    },
    created() {
        console.log('colorcode:', this.colorCode)
    }

}
</script>

<style>

</style>
