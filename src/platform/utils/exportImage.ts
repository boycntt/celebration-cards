import { toPng } from 'html-to-image';

export interface ExportPngOptions {
  backgroundColor?: string;
  pixelRatio?: number;
}

export async function exportElementToPng(
  element: HTMLElement,
  fileName: string,
  options: ExportPngOptions = {}
): Promise<void> {
  const { backgroundColor = '#ffffff', pixelRatio = 2 } = options;

  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio,
    backgroundColor,
  });

  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = dataUrl;
  link.click();
}
