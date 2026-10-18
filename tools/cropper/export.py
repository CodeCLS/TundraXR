"""
Exports EfficientSAM-Ti to an ExecuTorch program (.pte) for the headset's on-device crop.

    python -I tools/cropper/export.py <EfficientSAM checkout> app/src/main/assets/device_cropper.pte [size]

The program takes one size x size RGB image (float, 0..1, NCHW; size 512 unless given) and one
point in that image (the centre of view), and answers three candidate masks (logits at a quarter
of size: subpart, part, whole) with the model's own IoU estimate for each. Picking a mask and
turning it into a box is done in Kotlin (DeviceCropper.kt), so the program stays a plain encoder
and decoder.

EfficientSAM is trained at 1024. At 512 the encoder's attention is 16x cheaper (about 4x faster
overall; the boxes came out within a few pixels of 1024's), and a box around an object needs no
fine mask edges.
"""

import sys
from pathlib import Path

import torch


class Cropper(torch.nn.Module):
    def __init__(self, sam: torch.nn.Module, size: int):
        super().__init__()
        self.sam = sam
        self.size = size

    def forward(self, image: torch.Tensor, point: torch.Tensor):
        # image [1, 3, size, size] in 0..1; point [1, 2] in pixels of that image.
        embeddings = self.sam.get_image_embeddings(image)
        masks, iou = self.sam.predict_masks(
            embeddings,
            point.reshape(1, 1, 1, 2),
            torch.ones(1, 1, 1, dtype=torch.float32),
            multimask_output=True,
            input_h=self.size,
            input_w=self.size,
        )
        side = self.size // 4
        return masks.reshape(3, side, side), iou.reshape(3)


def build(repo: Path, size: int) -> Cropper:
    sys.path.insert(0, str(repo))
    from efficient_sam.efficient_sam import build_efficient_sam

    sam = build_efficient_sam(192, 3, checkpoint=str(repo / "weights/efficient_sam_vitt.pt")).eval()
    grid = size // 16
    sam.image_encoder.img_size = size
    sam.image_encoder.image_embedding_size = grid
    sam.prompt_encoder.input_image_size = (size, size)
    sam.prompt_encoder.image_embedding_size = (grid, grid)
    return Cropper(sam, size).eval()


def main(repo: Path, out: Path, size: int) -> None:
    from executorch.backends.xnnpack.partition.xnnpack_partitioner import XnnpackPartitioner
    from executorch.exir import to_edge_transform_and_lower

    model = build(repo, size)
    example = (torch.rand(1, 3, size, size), torch.tensor([[size / 2, size / 2]]))
    with torch.no_grad():
        exported = torch.export.export(model, example)
    program = to_edge_transform_and_lower(exported, partitioner=[XnnpackPartitioner()]).to_executorch()
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(program.buffer)
    print(f"{out}: {out.stat().st_size / 1e6:.1f} MB, {size}px")


if __name__ == "__main__":
    main(Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve(), int(sys.argv[3]) if len(sys.argv) > 3 else 512)
