# On-device crop (ExecuTorch)

Before a photo goes to image search, the headset crops it to the object the engineer is
looking at. EfficientSAM-Ti (Meta, Apache-2.0) runs on the Galaxy XR's CPU through
ExecuTorch with the XNNPACK backend: about 0.5 s per photo, measured on the device. Code:
`app/src/main/java/com/tundra/tundraxr/capture/DeviceCropper.kt`.

The program (`app/src/main/assets/device_cropper.pte`, ~41 MB) is built, not committed:

```sh
uv venv --python 3.12 .venv-cropper
uv pip install --python .venv-cropper/bin/python executorch==1.5.1 torch torchvision pillow
git clone --depth 1 https://github.com/yformer/EfficientSAM.git ../EfficientSAM
.venv-cropper/bin/python -I tools/cropper/export.py ../EfficientSAM app/src/main/assets/device_cropper.pte
```

Keep `executorch` here and `executorch` in `gradle/libs.versions.toml` on the same version.
Without the file the app still builds and sends photos uncropped.

`check.py` runs the program on photos and saves each box and crop, to look at a change.
`DeviceCropperTest` (androidTest) runs it on the headset: a drawn device on a plain bench
must come back boxed.

Look at the body of a device, not its screen: a point on a display gives back the display.
