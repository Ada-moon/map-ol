import Vue from 'vue'
import VueRouter from 'vue-router'
import Map from '../views/Map.vue'
import MapCircle from '../views/MapCircle.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'map',
    component: Map,
  },
  {
    path: '/',
    name: 'mapCircl',
    component: MapCircle,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
