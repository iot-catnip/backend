import Vue from "vue";
import VueRouter from "vue-router";

// styles

import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/assets/styles/tailwind.css";

// mouting point for the whole app

import App from "@/App.vue";

// layouts

import Admin from "@/layouts/Admin.vue";
import Auth from "@/layouts/Auth.vue";

// views for Admin layout

import Dashboard from "@/views/admin/Dashboard.vue";
import Settings from "@/views/admin/Settings.vue";
import Tables from "@/views/admin/Tables.vue";
import Maps from "@/views/admin/Maps.vue";

// views for Auth layout

import Login from "@/views/auth/Login.vue";

// views without layouts

import Landing from "@/views/Landing.vue";
import Profile from "@/views/Profile.vue";
import Index from "@/views/Index.vue";
import axios from "axios";
import {logoutRoutine} from "@/script/auth";

// routes

const routes = [
  /**
   * Main Paths
   */
  {
    path: "*",
    redirect: "/",
  },
  {
    path: "/",
    component: Index,
    meta: {
      requiresAuth: true,
    }
  },
  /**
   * Authentification route
   */
  {
    path: "/auth",
    redirect: "/auth/login",
    component: Auth,
    children: [
      {
        name:'login',
        path: "/auth/login",
        component: Login,

      },
      {
        name:'logout',
        path: "/auth/logout",
        beforeEnter: (to,from,next) => {
          logoutRoutine.then(() => {
            next({name:'login'});
          })
        }
      }
    ],
  },
  /**
   * Dashboard Managements Route
   */
  {
    path: "/admin",
    redirect: "/admin/dashboard",
    component: Admin,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/admin/dashboard",
        component: Dashboard,
        meta: {
          requiresAuth: true,
        }
      },
      {
        path: "/admin/settings",
        component: Settings,
        meta: {
          requiresAuth: true,
        }
      },
      {
        path: "/admin/tables",
        component: Tables,
        meta: {
          requiresAuth: true,
        }
      },
      {
        path: "/admin/maps",
        component: Maps,
        meta: {
          requiresAuth: true,
        }
      },
    ],
  },
  /**
   * Other page (TODO: delete later)
   */
  {
    path: "/landing",
    component: Landing,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/profile",
    component: Profile,
    meta: {
      requiresAuth: true,
    }
  },
];

// app config

Vue.config.productionTip = false;

Vue.use(VueRouter);

// If connected automatically add token to every request
const token = localStorage.getItem('user-token')
if (token) {
  axios.defaults.headers.common['Authorization'] = token
}

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('user-token');
  const isAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (isAuth && !loggedIn) {
    return next({ name: "login" });
  }
  next();
});


new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
