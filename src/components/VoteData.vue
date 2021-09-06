<template>
  <div class="vote-info">
      <h2>投票セクション</h2>
      <p>賛成：{{ count("賛成") }}票</p>
      <p>反対：{{ count("反対") }}票</p>
  </div>
</template>

<script>
export default {
    props: {
        post: Object
    },
    methods: {
        count(type) {
            let counter = 0;
            let countedUser = [];
            for (let post of this.post.replys) {
                if (post.type === type && !(post.commenter in countedUser)) {
                    counter ++;
                    countedUser.push(post.commenter)
                }
            }
            return counter
        }
    }
}
</script>

<style>
.vote-info {
    border: solid 0.1rem
}
</style>