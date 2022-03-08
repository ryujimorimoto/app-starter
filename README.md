# Shopify アプリ開発

- スターターキット

# 初期設定

### 環境変数

AWS_API_REGION=ap-northeast-1
AWS_API_ACCESS_KEY= //
AWS_API_SECRET_KEY= //
STORE_ACCOUNT_TABLENAME= // ストアアカウントのテーブル名

# 2022-02-23

## スターターキットの内容

- OAuth 認証
- Redis によるアクセストークンのキャッシュ化

## ライブラリ

redis
util
husky ※ husky は、GitHub のプラグインです。v7.0.0 では、husky-git-hooks が必要です。

@shopify/koa-shopify-auth v4 系を利用。最新の v5 系は不具合が多いため。
axios

## 初期設定

- Shopify 管理画面で新規アプリを作成
- AWS DynamoDB にアクセストークンを保存するテーブルを作成
- 環境変数の設定
- $ yarn install
- github リポジトリの作成と、first commit の push

---

インフラは AWS を想定。
EC2 インスタンス上で動作させる。
Koa（Node.js）は pm2 で起動管理。
