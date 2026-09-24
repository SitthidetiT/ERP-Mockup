const fs = require('fs');

const code = `import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Boxes } from "lucide-react";
import { money } from "../../app/data";

const quoteParts = [
  "P-2025-ME-SCH-C00001-17",
  "เซนเซอร์ตรวจจับตำแหน่ง",
  "CDJP2B16-15D",
  "PZ-V11",
  "สายสัญญาณและขั้วต่อ",
  "P-2025-ME-SCH-C00001-17",
  "AS1201F-M5-06A",
  "P-2025-ME-SCH-C00001-16",
  "P-2025-ME-SCH-C00001-18",
  "ประกอบและทดสอบการทำงาน",
  "CTS M5 x 12",
  "socket head cap screw_iso 4762 M3 x 10",
  "pan head cross recess screw ISO 7045",
  "รับประกัน 1 ปี (ข้อมูลสมมติ)",
];

const dateTH = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  return \`\${d.getDate()} \${months[d.getMonth()]} \${d.getFullYear() + 543}\`;
};

interface PrintEngineProps {
  job: any;
  quoteSubtotal: number;
  quoteVat: number;
  quoteGrandTotal: number;
}

export default function PrintEngine({ job, quoteSubtotal, quoteVat, quoteGrandTotal }: PrintEngineProps) {
  const [pages, setPages] = useState<any[]>([]);
  const [measured, setMeasured] = useState(false);

  const FullHeader = () => (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ width: '120px', textAlign: 'center', color: '#c00', fontWeight: 'bold', marginRight: '20px' }}>
          <div style={{ fontSize: '36px', margin: '0', lineHeight: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Boxes size={36} color="#c00" style={{ marginRight: '5px' }} />
            ERP
          </div>
          <div style={{ fontSize: '8px', letterSpacing: '1px', marginTop: '2px' }}>ERP - TECH SYSTEMS</div>
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ color: '#c00', fontSize: '24px', fontWeight: 'bold', fontStyle: 'italic', margin: '0 0 5px 0', letterSpacing: '1px' }}>ERP - MANUFACTURING SYSTEMS CO., LTD</h1>
          <p style={{ margin: '2px 0', fontSize: '11px', fontWeight: 'bold' }}>Manufacturing : 99/9 Demo Road, Industrial District, Bangkok 10200 Thailand (Head Office)</p>
          <p style={{ margin: '2px 0', fontSize: '11px', fontWeight: 'bold' }}>Tel : 02 000 0000 E-Mail : sales@erp-company.example TAX: 0100000000000</p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid black', borderBottom: '1px solid black', textAlign: 'center', padding: '5px 0', marginBottom: '10px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 'bold', fontStyle: 'italic', margin: 0, letterSpacing: '1px' }}>Quotation</h2>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', fontSize: '11px', marginBottom: '10px' }}>
        <tbody>
          <tr>
            <td rowSpan={2} style={{ width: '30px', padding: '4px 6px', verticalAlign: 'top', fontWeight: 'bold' }}>To:</td>
            <td rowSpan={2} style={{ padding: '4px 6px', verticalAlign: 'top', borderRight: '1px solid black' }}>
              <strong>{job.customer}</strong><br/>
              {job.address || "สำนักงานใหญ่..."}
            </td>
            <td style={{ width: '120px', padding: '4px 6px', borderRight: '1px solid black', borderBottom: '1px solid black', fontWeight: 'bold' }}>Quotation No.</td>
            <td style={{ width: '200px', padding: '4px 6px', textAlign: 'center', borderBottom: '1px solid black', fontWeight: 'bold' }}>{job.quoteId} REV 01</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 6px', borderRight: '1px solid black', borderBottom: '1px solid black', fontWeight: 'bold' }}>Date</td>
            <td style={{ padding: '4px 6px', textAlign: 'center', borderBottom: '1px solid black' }}>24 September 2026</td>
          </tr>
          <tr>
            <td rowSpan={2} style={{ padding: '4px 6px', verticalAlign: 'top', borderTop: '1px solid black', fontWeight: 'bold' }}>Attn:</td>
            <td rowSpan={2} style={{ padding: '4px 6px', verticalAlign: 'top', borderRight: '1px solid black', borderTop: '1px solid black' }}>
              <strong>{job.contact}</strong>
            </td>
            <td style={{ padding: '4px 6px', borderRight: '1px solid black', borderBottom: '1px solid black', fontWeight: 'bold' }}>Price Validity</td>
            <td style={{ padding: '4px 6px', textAlign: 'center', borderBottom: '1px solid black' }}>30 DAYS</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 6px', borderRight: '1px solid black', borderBottom: '1px solid black', fontWeight: 'bold' }}>Payment Terms</td>
            <td style={{ padding: '4px 6px', textAlign: 'center', borderBottom: '1px solid black' }}>30 DAYS</td>
          </tr>
          <tr>
            <td rowSpan={2} style={{ padding: '4px 6px', verticalAlign: 'top', borderTop: '1px solid black', fontWeight: 'bold' }}>C.c.:</td>
            <td rowSpan={2} style={{ padding: '4px 6px', verticalAlign: 'top', borderRight: '1px solid black', borderTop: '1px solid black' }}>-</td>
            <td style={{ padding: '4px 6px', borderRight: '1px solid black', borderBottom: '1px solid black', fontWeight: 'bold' }}>Lead Time</td>
            <td style={{ padding: '4px 6px', textAlign: 'center', borderBottom: '1px solid black' }}>{dateTH(job.due)}</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 6px', borderRight: '1px solid black', fontWeight: 'bold' }}>Contact Person</td>
            <td style={{ padding: '4px 6px', textAlign: 'center' }}>ERP SALES (MOCK)</td>
          </tr>
        </tbody>
      </table>
    </>
  );

  const ShortHeader = () => (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
        <div style={{ fontSize: '24px', margin: '0', lineHeight: '1', display: 'flex', alignItems: 'center', color: '#c00', fontWeight: 'bold', marginRight: '10px' }}>
          <Boxes size={24} color="#c00" style={{ marginRight: '5px' }} />
          ERP
        </div>
        <div style={{ flex: 1, borderBottom: '2px solid #c00', paddingBottom: '2px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#c00', fontStyle: 'italic' }}>QUOTATION (Continued)</h2>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '11px', marginTop: '5px' }}>
        <div>To: {job.customer}</div>
        <div>Quotation No.: {job.quoteId} REV 01</div>
      </div>
    </div>
  );

  const TableColGroup = () => (
    <colgroup>
      <col style={{ width: '4%' }} />
      <col style={{ width: '28%' }} />
      <col style={{ width: '12%' }} />
      <col style={{ width: '10%' }} />
      <col style={{ width: '7%' }} />
      <col style={{ width: '8%' }} />
      <col style={{ width: '8%' }} />
      <col style={{ width: '8%' }} />
      <col style={{ width: '5%' }} />
      <col style={{ width: '10%' }} />
    </colgroup>
  );

  const TableHeader = () => (
    <thead id="measure-table-header">
      <tr>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Item</th>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Part Name</th>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Drawing Form</th>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Part No.</th>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Material</th>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Finishing</th>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Quantity</th>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Unit Price</th>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Discount</th>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Amount (THB)</th>
      </tr>
    </thead>
  );

  const ItemRow = ({ line, index }: { line: any; index: number }) => (
    <React.Fragment>
      <tr>
        <td rowSpan={2} style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top', fontWeight: 'bold' }}>{index + 1}</td>
        <td rowSpan={2} style={{ border: '1px solid black', padding: '0', width: '30%', verticalAlign: 'top' }}>
          <div style={{ padding: '6px 4px' }}>
            <strong>{line.name}</strong>
            <div style={{ margin: '8px 0' }}>Size : {job.description}</div>
            <strong>Parts :</strong>
          </div>
          <div style={{ lineHeight: '1.6' }}>
            {quoteParts.map((part, i) => (
              <div key={i} style={{ padding: '2px 6px', backgroundColor: i % 2 === 1 ? '#f5f5f5' : 'transparent' }}>{part}</div>
            ))}
          </div>
        </td>
        <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top' }}>ERP DEMO</td>
        <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top' }}>MOCK-{String(index + 1).padStart(3, "0")}</td>
        <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top' }}>AL</td>
        <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top' }}>N/A</td>
        <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top' }}>{line.qty} Set</td>
        <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'right', verticalAlign: 'top', fontWeight: 'bold' }}>{money(line.price)}</td>
        <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top' }}></td>
        <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'right', verticalAlign: 'top', fontWeight: 'bold' }}>{money(line.price * line.qty)}</td>
      </tr>
      <tr>
        <td colSpan={8} style={{ border: '1px solid black', padding: '10px', verticalAlign: 'top', position: 'relative' }}>
          <div style={{ border: '1px solid #ccc', display: 'inline-block', padding: '4px', fontSize: '8px', color: '#666', marginBottom: '15px', maxWidth: '350px', lineHeight: '1.2' }}>
            EXCEPT AS OTHERWISE PROVIDED BY CONTRACTOR IN DRAWING THESE DRAWINGS AND SPECIFICATIONS ARE THE PROPERTY OF ERP COMPANY CO.,LTD. AND MUST BE RETURNED UPON REQUEST. MUST NOT BE MANUFACTURED OR USED BY OTHERS WITHOUT WRITTEN PERMISSION OF ERP COMPANY CO.,LTD.
          </div>
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <Image
              src="/product-sample.svg"
              alt="sample"
              width={400}
              height={180}
              style={{ objectFit: 'contain' }}
            />
          </div>
        </td>
      </tr>
    </React.Fragment>
  );

  const FinalSection = () => (
    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', borderTop: 'none', fontSize: '11px', tableLayout: 'fixed' }}>
      <colgroup>
        <col style={{ width: '4%' }} />
        <col style={{ width: '28%' }} />
        <col style={{ width: '12%' }} />
        <col style={{ width: '10%' }} />
        <col style={{ width: '7%' }} />
        <col style={{ width: '8%' }} />
        <col style={{ width: '8%' }} />
        <col style={{ width: '8%' }} />
        <col style={{ width: '5%' }} />
        <col style={{ width: '10%' }} />
      </colgroup>
      <tbody>
        <tr>
          <td colSpan={8} style={{ border: '1px solid black', padding: '8px 10px', verticalAlign: 'top' }}>
            <strong style={{ display: 'block', marginBottom: '8px' }}># Payment Systems</strong>
            <div style={{ display: 'flex', marginBottom: '4px', paddingLeft: '10px' }}>
              <div style={{ width: '150px', fontWeight: 'bold' }}>- Deposit upon order</div>
              <div style={{ fontWeight: 'bold' }}>100%</div>
            </div>
            <div style={{ display: 'flex', marginBottom: '4px', paddingLeft: '10px' }}>
              <div style={{ width: '150px', fontWeight: 'bold' }}>- Deliver</div>
              <div style={{ fontWeight: 'bold' }}>0%</div>
            </div>
            <div style={{ display: 'flex', paddingLeft: '10px' }}>
              <div style={{ width: '150px', fontWeight: 'bold' }}>- Credit 30 days</div>
              <div style={{ fontWeight: 'bold' }}>0%</div>
            </div>
          </td>
          <td style={{ border: '1px solid black', padding: '8px 10px', fontWeight: 'bold', fontStyle: 'italic', verticalAlign: 'bottom' }}>Total</td>
          <td style={{ border: '1px solid black', padding: '8px 10px', textAlign: 'right', fontWeight: 'bold', verticalAlign: 'bottom' }}>{money(quoteSubtotal)}</td>
        </tr>
        <tr>
          <td colSpan={8} style={{ border: '1px solid black', padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>Please issue a crossed cheque payable to ERP Manufacturing Systems Co.,Ltd Insert at 15% per month will be charged on overdue account</div>
          </td>
          <td style={{ border: '1px solid black', padding: '8px 10px', fontWeight: 'bold', fontStyle: 'italic', verticalAlign: 'middle' }}>VAT 7%</td>
          <td style={{ border: '1px solid black', padding: '8px 10px', textAlign: 'right', fontWeight: 'bold', verticalAlign: 'middle' }}>{money(quoteVat)}</td>
        </tr>
        <tr>
          <td colSpan={2} style={{ border: '1px solid black', padding: '8px 10px', fontWeight: 'bold', textAlign: 'center' }}>ตัวอักษร</td>
          <td colSpan={6} style={{ border: '1px solid black', padding: '8px 10px', textAlign: 'center', fontWeight: 'bold' }}>ยอดรวมตามเอกสารตัวอย่าง</td>
          <td style={{ border: '1px solid black', padding: '8px 10px', fontWeight: 'bold', fontStyle: 'italic' }}>Grand Total</td>
          <td style={{ border: '1px solid black', padding: '8px 10px', textAlign: 'right', fontWeight: 'bold' }}>{money(quoteGrandTotal)}</td>
        </tr>
      </tbody>
    </table>
  );

  const Signatures = () => (
    <div style={{ display: 'flex', marginTop: '40px', justifyContent: 'space-between', padding: '0 40px' }}>
      <div style={{ textAlign: 'center', width: '250px' }}>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', marginBottom: '30px' }}>APPROVED BY</div>
        <div style={{ fontSize: '28px', fontFamily: 'cursive', color: '#333', marginBottom: '5px' }}>ERP Sales Director</div>
        <div style={{ borderBottom: '1px solid black', marginBottom: '5px' }}></div>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic' }}>ERP Sales Director</div>
        <div style={{ fontStyle: 'italic', fontSize: '10px' }}>Biz. Development Director</div>
      </div>
      <div style={{ textAlign: 'center', width: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <div style={{ borderBottom: '1px dotted black', marginBottom: '8px' }}></div>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic' }}>Signature &amp; Company Stamp</div>
        <div style={{ fontStyle: 'italic', fontSize: '10px', marginBottom: '15px' }}>(Please return a copy by email or fax)</div>
        <div style={{ fontSize: '9px', fontWeight: 'bold' }}>This is a computer generated quotation no signature is required.</div>
      </div>
    </div>
  );

  // Measure and calculate pages
  useEffect(() => {
    const timer = setTimeout(() => {
      const getH = (id: string) => document.getElementById(id)?.offsetHeight || 0;
      
      const PAGE_HEIGHT = 960; 
      
      const hFull = getH('measure-full-header');
      const hShort = getH('measure-short-header');
      const hThead = getH('measure-table-header');
      const hFinal = getH('measure-final-section');
      const hSig = getH('measure-signatures');

      const itemsH = job.lines.map((_: any, i: number) => getH('measure-item-' + i));

      const newPages: any[] = [];
      let currentPage: any = { items: [], hasFinal: false, hasSig: false };
      let currentHeight = hFull + hThead;

      itemsH.forEach((h: number, i: number) => {
        if (currentHeight + h > PAGE_HEIGHT) {
          newPages.push(currentPage);
          currentPage = { items: [{ line: job.lines[i], index: i }], hasFinal: false, hasSig: false };
          currentHeight = hShort + hThead + h;
        } else {
          currentPage.items.push({ line: job.lines[i], index: i });
          currentHeight += h;
        }
      });

      if (currentHeight + hFinal <= PAGE_HEIGHT) {
        currentPage.hasFinal = true;
        currentHeight += hFinal;
        if (currentHeight + hSig <= PAGE_HEIGHT) {
          currentPage.hasSig = true;
        } else {
          newPages.push(currentPage);
          currentPage = { items: [], hasFinal: false, hasSig: true };
        }
      } else {
        newPages.push(currentPage);
        currentPage = { items: [], hasFinal: true, hasSig: false };
        if (hShort + hFinal + hSig <= PAGE_HEIGHT) {
          currentPage.hasSig = true;
        } else {
          newPages.push(currentPage);
          currentPage = { items: [], hasFinal: false, hasSig: true };
        }
      }
      
      newPages.push(currentPage);
      setPages(newPages);
      setMeasured(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [job.lines, quoteGrandTotal]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: \`
        @media print {
          .a4-page { display: block !important; margin: 0 !important; box-shadow: none !important; border: none !important; page-break-after: always; padding: 12mm; }
          @page { size: A4 portrait; margin: 0; }
        }
        @media screen {
          .a4-page { display: none !important; }
        }
        .a4-page {
          width: 210mm;
          min-height: 297mm;
          background: white;
          color: black;
          font-family: Arial, sans-serif;
          font-size: 11px;
          box-sizing: border-box;
          position: relative;
        }
        .page-footer-info {
          position: absolute;
          bottom: 12mm;
          left: 12mm;
          right: 12mm;
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #666;
          font-weight: bold;
        }
      \`}} />

      <div className="print-engine-container">
        
        {/* INVISIBLE MEASUREMENT LAYER */}
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', visibility: 'hidden', width: '210mm', padding: '12mm', boxSizing: 'border-box' }}>
          <div id="measure-full-header"><FullHeader /></div>
          <div id="measure-short-header"><ShortHeader /></div>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <TableColGroup />
            <TableHeader />
          </table>
          {job.lines.map((line: any, i: number) => (
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }} key={i}>
              <TableColGroup />
              <tbody id={'measure-item-' + i}>
                <ItemRow line={line} index={i} />
              </tbody>
            </table>
          ))}
          <div id="measure-final-section"><FinalSection /></div>
          <div id="measure-signatures"><Signatures /></div>
        </div>

        {/* ACTUAL RENDERED PAGES */}
        {measured && pages.map((page, pIdx) => (
          <div className="a4-page" key={pIdx}>
            
            {pIdx === 0 ? <FullHeader /> : <ShortHeader />}
            
            {page.items.length > 0 && (
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', borderBottom: page.hasFinal ? 'none' : '1px solid black', tableLayout: 'fixed', fontSize: '11px' }}>
                <TableColGroup />
                <TableHeader />
                <tbody>
                  {page.items.map((itm: any) => (
                    <ItemRow key={itm.index} line={itm.line} index={itm.index} />
                  ))}
                </tbody>
              </table>
            )}

            {page.hasFinal && <FinalSection />}
            
            {page.hasSig && <Signatures />}

            <div className="page-footer-info">
              <div>Ref: {job.quoteId}</div>
              <div>Page {pIdx + 1} of {pages.length}</div>
            </div>
          </div>
        ))}

      </div>
    </>
  );
}
`;

fs.writeFileSync('components/quotation/PrintEngine.tsx', code, 'utf-8');
console.log('Successfully rewrote PrintEngine.tsx with exact original layout!');
