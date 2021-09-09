<template>
  <header>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div class="collapse navbar-collapse" id="Navbar">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
            <li class="nav-item">
              <router-link class="routerLink" :to="{ path: '/user/' + uid}">
                <a class="nav-link active">プロフィール</a>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="routerLink" :to="{ path: '/comlist'}">
                <a class="nav-link active">コミュニティ一覧</a>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="routerLink" :to="{ path: '/make_community'}">
                <a class="nav-link active">コミュニティ作成</a>
              </router-link>
            </li>
          </ul>
        </div>
      
    </nav>
  </header>
</template>

<script>
import firebase from "firebase/app";

export default {
  data() {
    return {
      uid: "invalid",
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid
      }
    });
  }
}
</script>


<style>
.routerLink{
  text-decoration: none;
}

.container {
  max-width: 960px;
}

.site-header {
  background-color: rgba(0, 0, 0, .85);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
}

.site-header a {
  color: #8e8e8e;
  transition: color .15s ease-in-out;
}

.site-header a:hover {
  color: #fff;
  text-decoration: none;
}
</style>
