#!/usr/bin/env bash
set -euo pipefail
ffmpeg -v error -y \
 -i ../etqan-materials-cinematic-v3-60s/renders/etqan-cinematic-3d-60s.mp4 \
 -loop 1 -framerate 30 -i renders/footer-overlay.png \
 -filter_complex '[0:v]format=rgba[base];[base][1:v]overlay=x=0:y=0:format=auto:shortest=1[composite];[composite]scale=in_color_matrix=bt709:out_color_matrix=bt709:out_range=tv,format=yuv420p[out]' \
 -map '[out]' -map 0:a:0 -c:v libx264 -preset veryfast -crf 16 \
 -pix_fmt yuv420p -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
 -c:a copy -t 60 -movflags +faststart renders/etqan-cinematic-3d-60s.mp4
