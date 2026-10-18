"""
Runs the exported program on photos, the way the headset does, and saves each crop next to
the photo's mask, so a change to the model or the selection rule can be looked at.

    python -I tools/cropper/check.py app/src/main/assets/device_cropper.pte <size> <out dir> photo.jpg [x,y] ...

The point defaults to the centre of the photo. The selection rule is DeviceCropper.kt's.
"""

import sys
import time
from pathlib import Path

import numpy as np
import torch
from PIL import Image, ImageDraw

MARGIN = 0.12
MIN_IOU = 0.7
MIN_AREA, MAX_AREA = 0.01, 0.85


def choose(masks: np.ndarray, iou: np.ndarray):
    """Index of the largest confident mask that is neither a speck nor the whole frame, or None."""
    best, best_area = None, 0.0
    for i in range(3):
        area = float((masks[i] > 0).mean())
        if iou[i] >= MIN_IOU and MIN_AREA <= area <= MAX_AREA and area > best_area:
            best, best_area = i, area
    return best


def box(mask: np.ndarray, w: int, h: int):
    ys, xs = np.nonzero(mask > 0)
    s = mask.shape[0]
    x0, x1, y0, y1 = xs.min() / s * w, (xs.max() + 1) / s * w, ys.min() / s * h, (ys.max() + 1) / s * h
    mx, my = (x1 - x0) * MARGIN, (y1 - y0) * MARGIN
    return max(0, int(x0 - mx)), max(0, int(y0 - my)), min(w, int(x1 + mx)), min(h, int(y1 + my))


def main(pte: Path, size: int, out: Path, args: list[str]) -> None:
    from executorch.runtime import Runtime

    method = Runtime.get().load_program(pte).load_method("forward")
    out.mkdir(parents=True, exist_ok=True)
    jobs = []
    for arg in args:
        if "," in arg and jobs:
            jobs[-1] = (jobs[-1][0], tuple(float(v) for v in arg.split(",")))
        else:
            jobs.append((Path(arg), None))
    for n, (path, point) in enumerate(jobs):
        photo = Image.open(path).convert("RGB")
        w, h = photo.size
        point = point or (w / 2, h / 2)
        name = f"{path.stem}_{n}"

        image = torch.from_numpy(np.asarray(photo.resize((size, size), Image.BILINEAR), np.float32) / 255)
        image = image.permute(2, 0, 1)[None].contiguous()
        p = torch.tensor([[point[0] / w * size, point[1] / h * size]])
        t = time.perf_counter()
        masks, iou = method.execute([image, p])
        ms = (time.perf_counter() - t) * 1000
        masks, iou = masks.numpy(), iou.numpy()

        pick = choose(masks, iou)
        areas = [round(float((m > 0).mean()), 3) for m in masks]
        crop = box(masks[pick], w, h) if pick is not None else (0, 0, w, h)
        print(f"{name}: {ms:.0f} ms  iou={np.round(iou, 2).tolist()} area={areas} pick={pick} box={crop}")

        shown = photo.copy()
        draw = ImageDraw.Draw(shown)
        draw.rectangle(crop, outline=(255, 60, 60), width=6)
        draw.ellipse((point[0] - 12, point[1] - 12, point[0] + 12, point[1] + 12), fill=(60, 200, 255))
        shown.thumbnail((800, 800))
        shown.save(out / f"{name}_box.jpg")
        photo.crop(crop).save(out / f"{name}_crop.jpg")


if __name__ == "__main__":
    main(Path(sys.argv[1]), int(sys.argv[2]), Path(sys.argv[3]), sys.argv[4:])
