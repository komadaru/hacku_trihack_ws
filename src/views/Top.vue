<template>
  <div class="button">
    <router-link :to="{ path: '/firstpage'}">
      <button type="button" class="btn btn-primary">サインイン</button>
    </router-link>
    <router-link :to="{ path: '/firstpage'}">
    <button type="button" class="btn btn-success">サインアップ</button>
    </router-link>
  </div>
</template>
