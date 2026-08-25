export const generatePdfFromHtml = async (htmlContent) => {
  try {
    const puppeteer = await import('puppeteer');
    const browser = await (puppeteer.default || puppeteer).launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    
    await browser.close();
    return pdfBuffer;
  } catch (error) {
    console.error('Error in PDF generation (fallback to client-side PDF):', error.message);
    throw error;
  }
};
