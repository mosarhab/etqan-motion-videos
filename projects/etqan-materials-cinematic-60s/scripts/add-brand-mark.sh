#!/usr/bin/env bash
set -euo pipefail
# Branding-only revision: use the verified full-resolution base film.
ffmpeg -v error -y -i renders/etqan-materials-cinematic-60s.mp4 -loop 1 -framerate 30 -i public/etqan-logo.png \
-filter_complex "color=c=0xf3f1e8:s=288x101:r=30[card];[1:v]scale=256:69:flags=lanczos,format=rgba[logo];[card][logo]overlay=x=16:y=16:format=auto:shortest=1,format=rgba,fade=t=out:st=57.5:d=0.5:alpha=1[badge];[0:v]format=rgba[base];[base][badge]overlay=x=80:y=100:format=auto:shortest=1[composite];[composite]scale=out_color_matrix=bt709:out_range=tv,format=yuv420p[out]" \
-map '[out]' -map 0:a:0 -c:v libx264 -preset veryfast -crf 16 -pix_fmt yuv420p -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a copy -t 60 -movflags +faststart renders/etqan-materials-cinematic-60s-branded.mp4
