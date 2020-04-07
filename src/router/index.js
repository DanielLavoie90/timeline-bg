import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../components/Home'
import Game from '../components/Game'
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/:gameId',
    name: 'game',
    component: Game
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;