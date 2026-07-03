# FALO GAS LINE Bot PoC

<!--
Digital Watermark:
FALO IM Watch v1.01 Private Internal GAS Monitor
Copyright (c) 2026 Falo x Force Cheng. All rights reserved.
Internal teaching and development artifact.
-->

Copyright (c) 2026 Falo x Force Cheng. All rights reserved.

Private internal build for FALO IM Watch v1.01. This README documents the GAS
webhook receiver, Google Sheet storage, Drive media upload worker, and LINE
`200 OK` diagnostics used in the Falo x Force Cheng teaching material.

This folder contains the Google Apps Script version of the LINE webhook receiver.

## What this version does

- Receives the second LINE Official Account webhook.
- Normalizes events into Google Sheets.
- Provides an HTML monitor page from the same GAS Web App.
- Provides a JSON proxy for the local AI commander:

```text
<WEB_APP_URL>?api=events&limit=200
<WEB_APP_URL>?api=health
<WEB_APP_URL>?api=config
<WEB_APP_URL>?api=setup
<WEB_APP_URL>?api=controls
```

When the Web App `/exec` URL is opened directly in a browser, it also works as
a small resource card. The page shows the current Web App URL, `spreadsheet_id`,
Google Sheet link, Drive media folder ID, Drive folder link, and Bot basic ID.
This is intentional: a single exec URL should explain where its data goes.

This is intentionally similar to the local Python webhook format, so the local
AI node can choose either source:

```text
LINE -> local Python webhook -> local storage
LINE -> GAS webhook -> Google Sheet -> local AI commander pull
```

## One-time setup

1. Install or confirm `clasp`:

```bash
clasp --version
```

2. Log in once:

```bash
clasp login
```

3. Copy the local env file:

```bash
cp .gas.env.example .gas.env
```

4. Fill in `GAS_SCRIPT_ID` in `.gas.env`.

You can find the Script ID from the Apps Script editor URL:

```text
https://script.google.com/home/projects/<SCRIPT_ID>/edit
```

or from:

```text
Project Settings -> Script ID
```

For this internal PoC, the current target values are:

```text
Sheet ID: 1VWP34oZeUqcYdOfI042SDeHXNNhLKi2vQCYDzAOaDyo
GAS Script ID: 1NJz55_sp90mYwltbbT0vHVCZAPaT3ueBgTjedx3doLpFrDdIRZx2_WwE
Bot basic ID: @415taurm
```

## Push local code to GAS

```bash
./GAS_PUSH.command
```

This uploads:

- `Code.gs`
- `Index.html`
- `appsscript.json`

After pushing, run `setupSecondWebhookDefaults` once in Apps Script, or run it
through `clasp run` if your local `clasp` auth is already ready. It initializes:

- `SPREADSHEET_ID`
- `BOT_ALIAS`
- `BOT_NAME`
- `BOT_BASIC_ID`
- `AUTO_REPLY=false`
- `MEDIA_SAVE_MODE=metadata`
- `MEDIA_SAVE_ENABLED=false`
- `MEDIA_FOLDER_ID=1YMudlXzJYuBgK3gtJt2sPAUvcOc3kQwC`

Keep `LINE_CHANNEL_ACCESS_TOKEN`, `WEBHOOK_TOKEN`, and `VIEWER_TOKEN` in Script
Properties, not in source code.

If `clasp run` is not available, open this URL once after Web App deployment:

```text
<WEB_APP_URL>?api=setup
```

## Pull cloud code back to local

```bash
./GAS_PULL.command
```

The pull script creates a local backup first:

```text
backups/gas-YYYYMMDD-HHMMSS/
```

Use pull carefully because it can overwrite local files.

## Deployment note

`clasp push` only updates the Apps Script project source code.

## First authorization for trigger and Drive access

Before the monitor page can create the 5-minute media worker trigger, the GAS
owner must authorize the runtime once from the Apps Script editor.

Run this function manually:

```text
authorizeRuntime
```

What it does:

- Opens the configured Google Sheet.
- Opens the configured Drive media folder.
- Reads Apps Script project triggers.
- Initializes the default config sheets.

It does not enable the 5-minute trigger by itself. After authorization is done,
use the monitor page buttons to enable or disable:

- Drive media upload.
- The 5-minute `processMediaQueue` trigger.
- Manual media queue processing.

The older helper name `authorizeMediaWorkerTriggerAccess` is kept as an alias,
but `authorizeRuntime` is the recommended teaching name.

For LINE webhook usage, you still need to deploy or redeploy the Apps Script Web App in the Apps Script UI:

```text
Deploy -> Manage deployments -> Edit -> New version -> Deploy
```

Then paste the Web App `/exec` URL into LINE Developers:

```text
Messaging API -> Webhook settings -> Webhook URL
```

The webhook handler returns `200 OK` immediately for LINE Developers' synthetic
Verify event. Real user, group, and room events are still stored in Sheets.

If `WEBHOOK_TOKEN` is set in Script Properties, append it to the URL:

```text
https://script.google.com/macros/s/.../exec?token=<WEBHOOK_TOKEN>
```

For the first GAS text test, keep auto-reply disabled. This gateway is primarily
for collection and later AI commander synchronization.

## Media queue and Drive upload

LINE image, video, audio, and file messages arrive as a `messageId`. The file
content is downloaded later through LINE's content API, so this PoC separates
the flow into two steps:

```text
LINE webhook -> write event + media_queue row -> return 200 quickly
5-minute worker -> download one file at a time -> save to Drive -> write media_files
```

There are two different HTTP success checks in this flow:

- Webhook ack: LINE Platform expects the GAS `/exec` webhook to return `200 OK`
  quickly. Media download should not block this response.
- Media fetch: the worker later calls LINE Content API with the matching
  official account `LINE_CHANNEL_ACCESS_TOKEN`. This request should return
  `200` with a binary blob. If it returns `302`, `401`, `403`, `404`, or `410`,
  check the media queue `last_error` column first.

Teaching note:

```text
LINE Developers Verify = webhook endpoint returned 200.
media_queue.status=saved = media was downloaded from LINE and uploaded to Drive.
```

These two checks must be kept separate. A successful Verify does not prove that
image, video, audio, or ZIP upload works. Drive upload is confirmed only after
the worker writes `saved` and a Drive URL back to the Sheet.

Common media fetch failures:

- `302`: a redirect was returned instead of the media binary. Check whether the
  worker is calling the LINE Content API directly and not a browser/proxy URL.
- `401` / `403`: wrong or missing channel access token, or token belongs to a
  different LINE Official Account.
- `404` / `410`: the media may have expired, been deleted by LINE, or the
  `messageId` does not belong to this bot.

The default Drive folder is:

```text
1YMudlXzJYuBgK3gtJt2sPAUvcOc3kQwC
```

The monitor page has buttons for:

- Enable / disable Drive media upload.
- Enable / disable the 5-minute Apps Script trigger.
- Manually process the media queue.
- Open the linked Google Sheet.
- Open the linked Drive folder.

LINE's official Messaging API reference says media content is automatically
deleted after a certain period and that LINE does not guarantee how long the
content is stored. That is why the worker should run frequently enough for real
use. Source: https://developers.line.biz/en/reference/messaging-api/#get-content
