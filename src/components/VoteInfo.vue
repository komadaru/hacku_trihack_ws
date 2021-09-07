<template>
    <div class="vote-info">
        <h2>投票セクション</h2>
        <p>期日：{{ vote.timelimit }}({{timeLeft()}})</p>
        <p>状態：{{ state() }}</p>
        <p>返信して投票してください</p>
        <p v-for="(count, choice) in voteResults()" :key="choice">
            {{ choice }}：{{ count }}票
        </p>
        <p v-if="isFinished()">結果:{{ finalChoice() }}</p>
    </div>
</template>

<script>
import moment from "moment";

export default {
    props: {
        post: Object,
        vote: Object
    },
    methods: {
        voteResults() {
            // ユーザーと投票の対応表を作る
            let userChoices = [];
            for (let reply of this.post.replys) {
                if (this.vote.choices.includes(reply.voteChoice)){
                    userChoices.push(
                        [reply.commenter, reply.voteChoice, reply.time]
                    );
                }
            }
            // 一人n票なので後ろからn票を採用する
            userChoices.reverse()
            let validUserChoices = [];
            let invalidUserChoices = [];
            for (let vote of userChoices) {
                // ユーザーが既に集計されている数を求める
                let nVoted = validUserChoices.filter(el => {
                    return el[0] === vote[0];
                }).length
                // 有効、無効を振り分ける
                if (nVoted < this.vote.nChoicesPerPerson
                    && vote[2] < this.vote.timelimit) {
                    validUserChoices.push(vote)
                } else {
                    invalidUserChoices.push(vote)
                }
            }
            // それぞれの票の数を取得する
            let results = {};
            for (let choice of this.vote.choices) {
                results[choice] = validUserChoices.filter(el => {
                    return el[1] === choice;
                }).length;
            }
            // 無効票の数も載せておく
            results["無効票"] = invalidUserChoices.length;
            console.log(results)
            return results;
        },
        finalChoice() {
            let result = this.voteResults()
            delete result["無効票"]
            let max = Object.values(result).reduce((a, b) => {
                return Math.max(a, b)
            });
            let ret = [];
            for (let key of Object.keys(result)) {
                if (result[key] === max) {
                    ret.push(key)
                }
            }
            return ret.join(",") + "(" + ret.length + ")"
        },
        isFinished() {
            return this.vote.timelimit < new Date();
        },
        state() {
            if (this.isFinished()) {
                return "終了済み"
            }
            return "投票受付中"
        },
        timeLeft() {
            let s = moment(this.vote.timelimit);
            let e = moment(new Date());
            let prefix
            if (s - e > 0) {
                prefix = "残り"
            } else {
                prefix = "終了してから"
            }
            let times = [
                ["years", "年"],
                ["months", "月"],
                ["days", "日"],
                ["hours", "時間"],
                ["minutes", "分"],
                ["seconds", "秒"]
                ]
            let absDiff
            let unit
            for (let time of times) {
                absDiff = Math.abs(s.diff(e, time[0]))
                if (absDiff >= 1) {
                    unit = time[1];
                    break
                }
            }
            return prefix + absDiff + unit
        }
    }
}
</script>

<style>
.vote-info {
    border: solid 0.1rem
}
</style>