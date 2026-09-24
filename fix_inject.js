const fs = require('fs');

let content = fs.readFileSync('app/page.tsx', 'utf-8');

if (!content.includes('import PrintEngine')) {
  content = content.replace(
    'import Image from "next/image";',
    'import Image from "next/image";\nimport PrintEngine from "../components/quotation/PrintEngine";'
  );
}

// 1. Replace the weird <style> block for print
const oldStyle = `<style>{\`
          @media print {
            body * {
              visibility: hidden;
            }
            .printable-article, .printable-article * {
              visibility: visible;
            }
            .printable-article {
              position: absolute;
              left: 0;
              top: 0;
              margin: 0 !important;
              box-shadow: none !important;
            }
            @page {
              size: A4;
              margin: 0;
            }
          }
        \`}</style>`;

const newStyle = `<style>{\`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-engine-container, .print-engine-container * {
              visibility: visible;
            }
            .print-engine-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .screen-only-quote {
              display: none !important;
            }
            @page {
              size: A4;
              margin: 0;
            }
          }
        \`}</style>`;

if (content.includes(oldStyle)) {
  content = content.replace(oldStyle, newStyle);
}

// 2. Inject PrintEngine and wrap original article
const searchStr = `<article className="printable-article"`;
const replaceStr = `<PrintEngine job={job} quoteSubtotal={quoteSubtotal} quoteVat={quoteVat} quoteGrandTotal={quoteGrandTotal} />
        <div className="screen-only-quote">
        <article className="printable-article"`;

if (!content.includes('<PrintEngine job={job}')) {
  content = content.replace(searchStr, replaceStr);
}

// 3. Close the wrapper div
const searchStr2 = `        </article>

        {job.stage === 0 && canEditQuote && (`;
const replaceStr2 = `        </article>
        </div>

        {job.stage === 0 && canEditQuote && (`;

if (content.includes(searchStr2)) {
  content = content.replace(searchStr2, replaceStr2);
}

fs.writeFileSync('app/page.tsx', content, 'utf-8');
console.log('Fixed PrintEngine injection!');
