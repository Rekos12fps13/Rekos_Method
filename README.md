# Rekos HD Uploader

## What it does
- Local, on-device video preparation.
- MP4/MOV input workflow.
- Remux-first processing: compatible video/audio streams are copied rather than re-encoded.
- Up to 1080p / 60 FPS workflow guidance.
- H.264/AVC or H.265/HEVC + AAC preservation when already present in the source.
- Original audio is preserved by the remux path.
- TikTok Login and TikTok Studio Upload shortcuts.
- TikTok page helper panel.
- Watermark toggle for an extension-side caption/tag preference (does not edit video pixels).
- Repost helper preference (does not remove TikTok reposts).
- Desktop Chrome/Chromium support; mobile support depends on whether the browser supports unpacked MV3 extensions.

## Important limitations
The extension cannot disable or bypass TikTok's server-side transcoding, upload limits, account permissions, or platform controls. TikTok may re-encode uploaded media after it leaves the device.

"Zero compression" is implemented as a remux-first path: FFmpeg copies the existing streams when the container can be prepared without re-encoding. It does not magically make an unsupported codec, resolution, or frame rate compatible.

The extension does not remove third-party watermarks from video pixels.

## Install
1. Extract this folder.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Choose **Load unpacked**.
5. Select the `Rekos HD Uploader` folder.
6. Open the extension, choose an MP4/MOV file, prepare it locally, then download the prepared file.
7. Open TikTok Studio and upload the prepared file.

## Folder layout
- `manifest.json`
- `index.html`
- `popup.js`
- `src/worker.js`
- `src/tiktok.js`
- `encoder/encoder-frame.html`
- `encoder/encoder-frame.js`
- `encoder/encoder-worker.js`
- `encoder/encode-job.js`
- `encoder/core/ffmpeg-core.js`
- `encoder/core/ffmpeg-core.wasm`
- `encoder/ffmpeg/ffmpeg.js`
- `assets/icons/icon.svg`
