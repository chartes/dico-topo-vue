import Vue from 'vue'
import VueRouter, {Location, Route, RouteConfig} from 'vue-router'
import PlacenamePage from "@/components/pages/PlacenamePage.vue"
import HomePage from "@/components/pages/HomePage.vue"
import NotFoundPage from "@/components/pages/NotFoundPage.vue"
import DocumentationPage from "@/components/pages/DocumentationPage.vue"
import LandingPage from "@/components/pages/LandingPage.vue"

Vue.use(VueRouter)

export const createRoutes: () => RouteConfig[] = () => [
  {
    path: '/',
    component: LandingPage,
    name: 'landing'
  },
  {
    path: '/search',
    component: HomePage,
    name: 'home',
    props: (route) => ({query: route.query.q})
  },
  {
    path: '/placenames/:placenameId',
    component: PlacenamePage,
    name: 'placename',
    props: true
  },
  {
    path: '/documentation',
    component: DocumentationPage,
    name: 'documentation'
  },
  {
    path: '*',
    component: NotFoundPage,
    name: 'notfound'
  }
]

const rootUrl = `${process.env.VUE_APP_ROOT_URL}`

export const createRouter = () => new VueRouter({
  base: rootUrl,
  mode: 'history',
  routes: createRoutes()
})
