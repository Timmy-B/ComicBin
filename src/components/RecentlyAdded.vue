<template>
<v-container fluid>
    <v-layout row wrap>
        <v-flex xs12 class="text-center" mt-5>
            <h1>Welcome to ComicBin</h1>
        </v-flex>
        <v-flex xs12 sm6 offset-sm3 mt-3>
            <blockquote text-center class="blockquote text-center">
                In this library there are <br>
                {{this.totals.issues}} issues<br>
                in <br>{{this.totals.series}} series<br>
                from <br>{{this.totals.publishers}} publishers
            </blockquote>
        </v-flex>
        <v-flex xs12 sm6 offset-sm3 class="text-center" mt-5>
            <h1>Recently Added</h1>
        </v-flex>
        <v-flex xs12 sm8 offset-sm2 mt-2>
            <v-layout class="recents">
                <div v-for="item in recent" class="cellcontainer" :key="item.Id" v-on:click="selectItem">
                    <div class="thumb">
                        <clazy-load :src="baseURL+'/BCR/Comics/'+item.Id+'/Pages/0?height=240'">
                            <transition name="fade">
                                <img :id="item.Id" :title="item.Title" :src="baseURL+'/BCR/Comics/'+item.Id+'/Pages/0?height=240'" />
                            </transition>
                            <transition name="fade" slot="placeholder">
                                <img slot="placeholder" :src="'./publishers/Unknown Publisher.jpg'" />
                            </transition>
                        </clazy-load>

                    </div>
                    <div class="label">{{item.Caption}}</div>
                </div>
            </v-layout>
        </v-flex>
    </v-layout>
    <v-flex xs12 sm6 offset-sm3 class="text-center" mt-5>
        <h1>Recently Read</h1>
    </v-flex>
    <v-flex xs12 sm8 offset-sm2 mt-2>
        <v-layout class="recents">
            <div v-for="item in read" class="cellcontainer" :key="item.Id" v-on:click="selectItem">
                <div class="thumb">
                    <clazy-load :src="baseURL+'/BCR/Comics/'+item.Id+'/Pages/0?height=240'">
                        <transition name="fade">
                            <img :id="item.Id" :title="item.Title" :src="baseURL+'/BCR/Comics/'+item.Id+'/Pages/0?height=240'" />
                        </transition>
                        <transition name="fade" slot="placeholder">
                            <img slot="placeholder" :src="'./publishers/Unknown Publisher.jpg'" />
                        </transition>
                    </clazy-load>

                </div>
                <div class="label">{{item.Caption}}</div>
            </div>
        </v-layout>
    </v-flex>
    </v-layout>
</v-container>
</template>

<script>
import {
    GRAB_TOTALS,
    GRAB_RECENT,
    GRAB_READ,
    GRAB_ISSUE
} from '../plugins/api'
export default {
    methods: {
        selectItem: function (event) {
            this.$store.dispatch(GRAB_ISSUE, event.target.id);
            this.dialog = true;
            this.$router.push({ name: "Reader", query: { itemID: event.target.id } })

        }
    },
    mounted: function () {
        this.$store.dispatch(GRAB_TOTALS)
        this.$store.dispatch(GRAB_RECENT)
        this.$store.dispatch(GRAB_READ)
    },
    computed: {
        totals() {
            return this.$store.state.api.totals
        },
        recent() {
            return this.$store.state.api.recent
        },
        read() {
            return this.$store.state.api.read
        },
        baseURL() {
            return this.$store.state.api.baseURL;
        },
    },
    data() {
        return {
            dialog: false
        }
    }
}
</script>

<style>
.recents {
    height: auto;
    overflow-x: scroll;
}
</style>
