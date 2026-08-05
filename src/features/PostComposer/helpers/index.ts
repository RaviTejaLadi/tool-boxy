export { uid, loadImage, drawRoundedRect, wrapCanvasText, paintGradient } from './canvasUtils';
export { exportCanvas, exportAllSlides } from './exportCanvas';
export { initialElements } from './initialElements';
export { shapeClipPath, drawShapePath, getShapeBorderRadius } from './shapePaths';
export { elementLabel, elementTypeLabel } from './elementLabel';
export {
  assignIds,
  createSlideFromPreset,
  createBlankSlide,
  createInitialSlides,
  cloneSlide,
  cloneElementsWithOffset,
} from './slideUtils';
