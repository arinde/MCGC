import jsQR from "jsqr";

/**
 * QR decoding that works on every phone at the gate.
 *
 * Two engines:
 *   1. BarcodeDetector — native, hardware-accelerated, Chromium only.
 *   2. jsQR — pure JavaScript, works in Safari and therefore on every iPhone
 *      (on iOS, Chrome and Firefox are Safari underneath, so this is the only
 *      option there regardless of which browser an usher opens).
 *
 * The native path is preferred where it exists because it costs less battery.
 */

export type Engine = "native" | "js";

type Decoder = {
  engine: Engine;
  decode: (video: HTMLVideoElement) => Promise<string | null>;
};

/** jsQR scans pixel data, so frames are downscaled — full resolution is wasted work. */
const SCAN_WIDTH = 420;

function createNativeDecoder(): Decoder | null {
  const Detector = (globalThis as Record<string, any>).BarcodeDetector;
  if (!Detector) return null;

  let detector: any;
  try {
    detector = new Detector({ formats: ["qr_code"] });
  } catch {
    return null;
  }

  return {
    engine: "native",
    decode: async (video) => {
      try {
        const codes = await detector.detect(video);
        return codes?.[0]?.rawValue ?? null;
      } catch {
        // A dropped frame mid-focus is normal; keep scanning.
        return null;
      }
    },
  };
}

function createJsDecoder(): Decoder {
  const canvas = document.createElement("canvas");
  // `willReadFrequently` keeps the surface in software memory, which is what
  // getImageData wants — without it Safari re-uploads the texture every frame.
  const context = canvas.getContext("2d", { willReadFrequently: true })!;

  return {
    engine: "js",
    decode: async (video) => {
      const { videoWidth, videoHeight } = video;
      if (!videoWidth || !videoHeight) return null;

      const scale = Math.min(1, SCAN_WIDTH / videoWidth);
      const width = Math.round(videoWidth * scale);
      const height = Math.round(videoHeight * scale);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      context.drawImage(video, 0, 0, width, height);

      let pixels: ImageData;
      try {
        pixels = context.getImageData(0, 0, width, height);
      } catch {
        // Tainted canvas — cannot happen with a camera stream, but never throw
        // out of the scan loop.
        return null;
      }

      const result = jsQR(pixels.data, width, height, {
        inversionAttempts: "dontInvert",
      });

      return result?.data ?? null;
    },
  };
}

export function createDecoder(): Decoder {
  return createNativeDecoder() ?? createJsDecoder();
}

/**
 * Opens the rear camera.
 *
 * iOS refuses getUserMedia outside a secure context and outside a user
 * gesture, so this must be called from a click handler on an HTTPS page.
 */
export async function openCamera(facing: "environment" | "user"): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: { ideal: facing },
      // A higher resolution gives jsQR more to work with on a worn printout,
      // without forcing a mode the phone may not have.
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  });
}

export function cameraErrorMessage(error: unknown): string {
  const name = (error as { name?: string })?.name ?? "";

  if (!window.isSecureContext) {
    return "The camera needs a secure connection. Open this page over https.";
  }

  switch (name) {
    case "NotAllowedError":
    case "SecurityError":
      return "Camera permission was refused. On iPhone: Settings → Safari → Camera → Allow, then reload.";
    case "NotFoundError":
    case "OverconstrainedError":
      return "No camera found on this device. Type the code in below instead.";
    case "NotReadableError":
      return "Another app is using the camera. Close it and try again.";
    default:
      return "Could not start the camera. Type the code in below instead.";
  }
}
