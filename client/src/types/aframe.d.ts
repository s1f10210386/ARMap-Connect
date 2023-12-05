/* eslint-disable @typescript-eslint/no-explicit-any */
// aframe.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'a-scene': any;
    'a-box': any;
    'a-marker-camera': any;
    'a-sphere': any;
    'a-cylinder': any;
    'a-camera': any;
    'a-entity': any;
    'a-text': any;
    'a-light': any;
    'a-animation': any;
    'a-cursor': any;
    // 他のA-FrameまたはAR.jsの要素に必要な型定義をここに追加
  }
}

declare let AFRAME: any;
