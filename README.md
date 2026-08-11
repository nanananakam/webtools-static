# nanananakam-webtools-static

Web開発・運用であるとうれしいちょっとしたツール集です。
すべてブラウザ上だけで動作する、Cloudflare Pages 上の静的サイトです。

## This project is deployed to

https://webtools.nanananakam.com/

on Cloudflare Pages

## Features

- UnixTime便利ツール ( https://webtools.nanananakam.com/unixtime/ )
- 文字数カウントツール ( https://webtools.nanananakam.com/length/ )
- 文字列ハッシュ化ツール ( https://webtools.nanananakam.com/hash/ )
- ファイルハッシュ確認ツール ( https://webtools.nanananakam.com/hashFile/ )
- Base64文字列ツール ( https://webtools.nanananakam.com/base64/ )
- ファイルBase64ツール ( https://webtools.nanananakam.com/fileBase64/ )
- QRコード作成ツール ( https://webtools.nanananakam.com/qrcode/ )
- このサイトについて ( https://webtools.nanananakam.com/about/ )

## 構成上のポイント

- Nuxt 2 の `target: 'static'` 構成で、`nuxt generate` により全ページを事前生成します。
- 生成物の出力先は `dist/` です。SPAフォールバックとして `404.html` を生成します。
- 入力データはすべてブラウザ内で処理し、サーバーへ送信しません。
- 広告は掲載していません。

## Build Setup

Node.js 18 系を利用してください(`.nvmrc` 参照)。Nuxt 2 は webpack 4 を利用するため、
Node.js 17 以降では `NODE_OPTIONS=--openssl-legacy-provider` が必要です(npm scripts 内で指定済み)。

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# generate static project into dist/
$ yarn generate

# serve the generated site locally
$ yarn start
```

## Cloudflare Pages の設定

GitHub連携でこのリポジトリを接続し、以下を設定します。

| 項目 | 値 |
| --- | --- |
| Framework preset | None (Nuxt.js は Nuxt 3 前提のため使わない) |
| Build command | `yarn generate` |
| Build output directory | `dist` |
| Node.js version | 18 (`.nvmrc` で指定済み) |

Custom domain には `webtools.nanananakam.com` を設定してください。

`wrangler.toml` を同梱しているため、`npx wrangler pages deploy` でのデプロイも可能です。

キャッシュ・セキュリティヘッダーは `static/_headers` (生成後は `dist/_headers`) で設定しています。

## Special Directories

Nuxt 2 の標準的なディレクトリ構成に従います。

- `assets` … コンパイル前のアセット (Sass変数など)
- `components` … 再利用するVueコンポーネント
- `layouts` … 全ページ共通のレイアウト
- `pages` … 各ページ。ファイル構成がそのままルーティングになります
- `static` … そのまま `/` 直下に配置される静的ファイル (`robots.txt`, `_headers` など)
- `store` … Vuex ストア (未使用)
