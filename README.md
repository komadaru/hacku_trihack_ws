# hacku_trihack_ws

Hack U

URL
https://project-of-trihack.web.app/

# リポジトリをクローンする
```
git clone https://github.com/komadaru/hacku_trihack_ws.git
```
できないかもしれない
# cloneした後にやること
```
npm install
```
これで、package.jsonの情報からnode_modules(モジュールがいっぱい入ってるフォルダ)を生成して、動かすことができるようになります。

# 見る
```
npm run serve
```
で、アプリがビルドされてローカルサーバーが建てられ、ブラウザで見れるようになります。ターミナルにlocalhost:なんとかと出てくるはずです。

この状態で各種ファイルを編集して保存すると、再度ビルドされて変更が即座にブラウザに反映されます。

> ⚠注意
>
> 記述に間違ってるところがあるとエラーが出てビルドできません。
> ターミナルやブラウザ（開発者ツール）などを見て修正してから保存し直しましょう。