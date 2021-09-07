<template>
    <div class="vote-info card border-info">
        <h2 class="card-header bg-info">アイデア募集セクション</h2>
        <div class="card-body">
        <p>期日：{{ format(ideaEvent.timelimit) }}({{timeLeft()}})</p>
        <p>状態：{{ state() }}</p>
        <p class="text-muted">返信してアイデアを投稿してください</p>
        <ul class="list-group">
        <li 
            v-for="idea in getIdeas()"
            :key="idea.id"
            class="list-group-item">
            {{ idea.idea }}
        </li>
        </ul>
        <p v-if="isFinished()">{{ nIdeas() }}個</p>
        </div>
    </div>
</template>

<script>
import moment from "moment";

export default {
    props: {
        post: Object,
        ideaEvent: Object
    },
    methods: {
        getIdeas() {
            let results = [];
            for (let reply of this.post.replys) {
                results.push(...reply.ideas)
            }
            let ideas = [];
            results.forEach((result, index) => {
                ideas.push({id: index, idea: result})
            });
            return ideas;
        },
        nIdeas() {
            return this.getIdeas().length;
        },
        format(time) {
            return moment(time).format("YYYY/MM/DD HH:mm");
        },
        isFinished() {
            return this.ideaEvent.timelimit < new Date();
        },
        state() {
            if (this.isFinished()) {
                return "終了済み"
            }
            return "アイデア受付中"
        },
        timeLeft() {
            let s = moment(this.ideaEvent.timelimit);
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
</style>