<template>
    <div class="vote-info">
        <h2>投票セクション</h2>
        <p>返信して投票してください</p>
        <p v-for="(count, choice) in voteResults()" :key="count">
            {{ choice }}：{{ count }}票
        </p>
    </div>
</template>

<script>
export default {
    props: {
        post: Object,
        vote: Object
    },
    methods: {
        voteResults() {
            // ユーザーと投票の対応表を作る
            let userVotes = [];
            for (let reply of this.post.replys) {
                if (this.vote.choices.includes(reply.voteChoice)){
                    userVotes.push([reply.commenter, reply.voteChoice]);
                }
            }
            // 一人n票なので後ろからn票を採用する
            userVotes.reverse()
            let validUserVotes = [];
            let invalidUserVotes = [];
            for (let vote of userVotes) {
                // ユーザーが既に集計されている数を求める
                let nVoted = validUserVotes.filter(el => {
                    return el[0] === vote[0];
                }).length
                // 有効、無効を振り分ける
                if (nVoted < this.vote.nChoicesPerPerson) {
                    validUserVotes.push(vote)
                } else {
                    invalidUserVotes.push(vote)
                }
            }
            // それぞれの票の数を取得する
            let results = {};
            for (let choice of this.vote.choices) {
                results[choice] = validUserVotes.filter(el => {
                    return el[1] === choice;
                }).length;
            }
            // 無効票の数も載せておく
            results["無効票"] = invalidUserVotes.length;
            return results;
        }
    }
}
</script>

<style>
.vote-info {
    border: solid 0.1rem
}
</style>