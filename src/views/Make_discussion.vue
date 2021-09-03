<template>
    <head>
        <title>Making discussion</title>
    </head>
    <body>
        <topbar />
        <div class="main">
            <h1>議論を作成</h1>
            <div class="main-list">
                <ul>
                    <li>議論テーマ設定</li>
                    <label class="theme">
                        <input class="themeEdit" v-model="themeEdit" placeholder="テーマを入力">
                    </label>
                    <label class="theme">
                        <p style="white-space: pre-line;"></p>
                        <textarea v-model="datail" placeholder="テーマの説明を入力"></textarea>
                    </label>
                    
                    <li>種別</li>
                    <label class="discussiontype">
                        <input type="radio" name="discussiontype" value="賛成・反対型" @change="disappealIdea();">賛成・反対型
                    </label>
                    <label class="discussiontype">
                        <input type="radio" name="discussiontype" value="ディベート型" @change="disappealIdea();">ディベート型
                    </label>
                    <label class="discussiontype">
                        <input type="radio" name="discussiontype" value="アイデア募集型" @change="appealIdea();">アイデア募集型
                    </label>
                    <label class="discussiontype">
                        <input type="radio" name="discussiontype" value="複数選択型" @change="disappealIdea();">複数選択型
                    </label>
                    
                    <li>クローズ条件</li>
                    <label class="closeconditions">
                        <input type="radio" name="closemanual" value="手動ON">手動クローズON
                    </label>
                    <label class="closeconditions">
                        <input type="radio" name="closemanual" value="手動OFF">手動クローズOFF
                    </label>
                    <label class="closeconditions">
                        <input type="checkbox" name="closeconditions" value="期限を設定" @change="appealCal();">期限を設定
                    <div v-show="showCal">
                        <flat-pickr placeholder="日時を入力" v-model="date" :config="config"></flat-pickr>
                    </div>
                    </label>
                    <label class="closeconditions">
                    <div v-show="showIdea">
                        <input type="checkbox" name="closeconditions" value="上限アイデア数を設定" @change="appealIdeaAmo();">上限アイデア数を設定
                        <div v-show="showIdeaAmo">
                            <input type="number" step="10" min="0" v-model="ideaAmount">
                        </div>
                    </div>
                    </label>
                    <label class="closeconditions">
                        <input type="checkbox" name="closeconditions" value="上限コメント数を設定" @change="appealComAmo();">上限コメント数を設定
                        <div v-show="showComAmo">
                            <input type="number" step="10" min="0" v-model="comAmount">
                        </div>
                    </label>
                    
                    <li>公開/非公開設定</li>
                    <label class="scope">
                        <input type="radio" name="scope" value="公開" @change="disappealPass();">公開
                    </label>
                    <label class="scope">
                        <input type="radio" name="scope" value="非公開" @change="appealPass();">非公開
                    </label>
                    <label class="scope">
                    <div v-show="showPass">
                        <input class="dpass" type="password" v-model="dpass" placeholder="パスワードを入力">
                    </div>
                    </label>
                </ul>
            </div>

            <div class="footer">
            
            </div>
        </div>
    </body> 
</template>

<script>
    // Import outside library from main.js
    import flatPickr from 'vue-flatpickr-component';

    import Topbar from '@/components/layouts/Topbar'

    export default {
        data() {
            return {
                date: null,
                ideaAmount: 0,
                comAmount: 0,
                // For flatPickr: flatPickrの要素設定
                config: {
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                    minDate: null,
                },
                showCal: false,
                showIdea: false,
                showPass: false,
                showIdeaAmo: false,
                showComAmo: false,
            }
        },
        components: {
            flatPickr,
            Topbar,
        },
        // For flatPickr: 現在日時を継続的に更新
        mounted: function() {
            this.updateTime();
            setInterval(this.updateTime, 1000);
        },
        methods: {
            // For flatPickr: 現在日時の1分後を取得し、flatPickerの要素minDateに代入
            updateTime() {
                let currentdate= new Date()
                this.config.minDate = currentdate.getFullYear() + '-' + (currentdate.getMonth() + 1) + '-' +
                currentdate.getDate() + ' ' + currentdate.getHours() + ':' + (currentdate.getMinutes() + 1)
            },
            // カレンダーを表示/非表示
            appealCal() {
                if (this.showCal === false) {
                    this.showCal = true
                } else {
                    this.showCal = false
                }
            },
            disappealCal() {
                this.showCal = false
            },
            
            appealIdea() {
                this.showIdea = true
            },

            appealPass() {
                this.showPass = true
            },
            disappealPass() {
                this.showPass = false
            },

            appealIdeaAmo() {
                if (this.showIdeaAmo === false) {
                    this.showIdeaAmo = true
                } else {
                    this.showIdeaAmo = false
                }
            },
            
            appealComAmo() {
                if (this.showComAmo === false) {
                    this.showComAmo = true
                } else {
                    this.showComAmo = false
                }
            }
        },
    }
</script>

<style scoped>
    body {
        font-family: "Avenir Next";
    }

    li {
        font-size: 23px;
        list-style: none;
        margin-top: 40px;
        margin-bottom: 5px;
        padding-right: 37px;
    }

    h1 {
        color: #3cd371;
    }

    .themeEdit {
        margin-top: 10px;
        outline: none;
        border-radius: 3px;
        font-size: 20px;
        width: 700px;
        height: 30px;
    }

    textarea {
        padding: 0.8em;
        outline: none;
        border-radius: 3px;
        font-size: 16px;
        width: 680px;
        height: 70px;
    }

    .theme {
        display: block;
        padding-right: 37px;
    }

    .discussiontype {
        display: block;
        padding-right: 37px;
    }

    .closeconditions {
        display: block;
        padding-right: 37px;
    }

    .scope {
        display: block;
        padding-right: 37px;
    }
</style>