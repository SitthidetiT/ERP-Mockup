const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf-8');

const s1 = `        </article>\r\n\r\n        {job.stage === 0 && canEditQuote && (`
const r1 = `        </article>\r\n        </div>\r\n\r\n        {job.stage === 0 && canEditQuote && (`

const s2 = `        </article>\n\n        {job.stage === 0 && canEditQuote && (`
const r2 = `        </article>\n        </div>\n\n        {job.stage === 0 && canEditQuote && (`

if (content.includes(s1)) {
  content = content.replace(s1, r1);
} else if (content.includes(s2)) {
  content = content.replace(s2, r2);
} else {
  // Try regex
  content = content.replace(/<\/article>\s*\{job\.stage === 0 && canEditQuote && \(/g, '</article>\n        </div>\n\n        {job.stage === 0 && canEditQuote && (');
}

fs.writeFileSync('app/page.tsx', content, 'utf-8');
console.log('Fixed div');
