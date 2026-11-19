import { toPng } from 'html-to-image';

export async function exportElementToPng(element: HTMLElement, fileName: string): Promise<void> {
  // Ensure fonts are loaded before rendering PNG
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#071A3C',
  });

  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = dataUrl;
  link.click();
}
