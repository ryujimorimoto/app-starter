# Shopify アプリ開発

- スターターキット

# 2022-02-23

## スターターキットの内容

- OAuth 認証
- Redis によるアクセストークンのキャッシュ化

## ライブラリ

redis
util
husky ※ husky は、GitHub のプラグインです。v7.0.0 では、husky-git-hooks が必要です。

@shopify/koa-shopify-auth v4 系を利用。最新の v5 系は不具合が多いため。

---

インフラは AWS を想定。
EC2 インスタンス上で動作させる。
Koa（Node.js）は pm2 で起動管理。
