import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

const LandingPage = () => import(/* webpackChunkName: "primary-pages" */ '@/components/pages/LandingPage.vue')
const HomePage = () => import(/* webpackChunkName: "primary-pages" */ '@/components/pages/HomePage.vue')
const PlacePage = () => import(/* webpackChunkName: "primary-pages" */ '@/components/pages/PlacePage.vue')

const DocumentationPage = () => import(/* webpackChunkName: "secondary-pages" */ '@/components/pages/DocumentationPage.vue')
const AboutPage = () => import(/* webpackChunkName: "secondary-pages" */ '@/components/pages/AboutPage.vue')
const ContactPage = () => import(/* webpackChunkName: "secondary-pages" */ '@/components/pages/ContactPage.vue')
const NotFoundPage = () => import(/* webpackChunkName: "secondary-pages" */ '@/components/pages/NotFoundPage.vue')

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
    props: (route) => ({ query: route.query.q })
  },
  {
    path: '/places/:placeId',
    component: PlacePage,
    name: 'place',
    props: true
  },
  {
    path: '/documentation',
    component: DocumentationPage,
    name: 'documentation'
  },
  {
    path: '/about',
    component: AboutPage,
    name: 'about'
  },
  {
    path: '*',
    component: NotFoundPage,
    name: 'notfound'
  },
  {
    path: '/contact',
    component: ContactPage,
    name: 'contact'
  }

]

const rootUrl = `${process.env.VUE_APP_ROOT_URL}`

export const createRouter = () => new VueRouter({
  base: rootUrl,
  mode: 'history',
  routes: createRoutes(),
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})
