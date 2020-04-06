<template>
<v-container fluid justify-center>
    <v-layout justify-center column>
        <!-- <v-toolbar class="mb-1">
            <v-text-field v-model="search" clearable flat solo-inverted hide-details prepend-inner-icon="search" label="Search"></v-text-field>
        </v-toolbar> -->
        <v-layout align-center justify-center row fill-height>
            <v-pagination @next="top()" v-model="page" :length.sync="pages"></v-pagination>
        </v-layout>
        <v-container fluid grid-list-md justify-center>
        <v-data-iterator :items="this.results" :itemsPerPage.sync="itemsPerPage" :page.sync="page" :footer-props="{ itemsPerPageOptions }" hide-default-footer class="pages" ref="list">
            <template v-slot:default="props">
                <v-layout row wrap>
                    <div class="cellcontainer" v-for="item in props.items" :key="item.Id" >
                        <div class="thumb">

                            <img v-if="item.Name == ''" v-on:click="selectItem" name='no rating' :src="'./esrb/RatingPending.svg'" />
                            <img v-else v-on:click="selectItem" :name="item.Name" :src="'./esrb/'+(item.Name).replace(/[ +]/gi,'')+'.svg'" />

                        </div>
                        <div v-if="item.Name == ''" class="label">Rating Pending</div>
                        <div v-else class="label">{{item.Name}}</div>
                    </div>
                </v-layout>
            </template>
        </v-data-iterator>
        </v-container>
        <v-layout align-center justify-center row fill-height>
            <v-pagination @next="top()" v-model="page" :length="pages"></v-pagination>
        </v-layout>

    </v-layout>
</v-container>
</template>

<script>
import {
    GRAB_AGE_RATINGS,
    GRAB_AGE_RATING_SERIES,
    CHANGE_TITLE,
    CHANGE_RATING,
    CHANGE_PAGE_NBR
} from '../plugins/api'
export default {
    created() {
        this.$store.dispatch(GRAB_AGE_RATINGS, (data) => {this.itemList = data;})
        this.$store.dispatch(CHANGE_TITLE, "Age Ratings")
        this.$store.dispatch(CHANGE_RATING, "")
        this.$store.dispatch(CHANGE_PAGE_NBR, {
            list: "ageratings",
            page: 1
        })
    },
    methods: {
        selectItem: function (event) {
            var rating = event.target.name
            if (rating == 'no rating') {
                this.$store.dispatch(CHANGE_TITLE, "Rating Pending")
                this.$store.dispatch(CHANGE_RATING, "Rating Pending")
            } else {
                this.$store.dispatch(CHANGE_TITLE, rating)
                this.$store.dispatch(CHANGE_RATING, rating)
            }
            this.$router.push({
                name: 'Series',
                query: { agerating: rating}
            })
            this.$store.dispatch(CHANGE_PAGE_NBR, {
                list: "ageratings",
                page: this.pagination.page
            })
        },
        top() {
            this.$nextTick(() => {
                // $(window).scrollTop(0);
            });
        },
    },
    computed: {
        pages() {
            if (this.itemsPerPage == null ||
                this.totalItems == null
            ) return 0

            return Math.ceil(this.totalItems / this.itemsPerPage)
        },
        Issue() {
            return this.$store.state.api.selectedIssue[0]
        }
    },
    watch: {
        itemList(data) {
            this.results = data;
        },
        search() {
            if (this.search.trim() === "") {
                this.results = this.itemList;
            } else {
                this.$search(this.search, this.itemList, {
                    keys: ["Name", "Imprint"],
                    threshold: 0.2
                }).then(results => {
                    this.results = results;
                });
            }
        },
        results() {
            this.$nextTick(() => {
                this.totalItems = this.results.length;
            });
        }
    },
    mounted() {
        this.$store.state.test = this.$el.offsetHeight

    },
    data() {
        return {
            itemsPerPage: this.$store.state.api.gridSize,
            itemsPerPageOptions: [5, 10, 15, this.$store.state.api.gridSize],
            page: 1,
            totalItems: 0,
            pagination: {},
            listtype: 'Series',
            dialog: false,
            itemList: [],
            search: '',
            results: [],
        }
    },
};
</script>

<style scoped>
img{
    height: 100%;
}
</style>
