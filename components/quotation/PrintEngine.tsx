import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { money } from "../../app/data";

interface PrintEngineProps {
  job: any;
  quoteSubtotal: number;
  quoteVat: number;
  quoteGrandTotal: number;
}

export default function PrintEngine({ job, quoteSubtotal, quoteVat, quoteGrandTotal }: PrintEngineProps) {
  const [pages, setPages] = useState<any[]>([]);
  const [measured, setMeasured] = useState(false);

  // We rebuild the same sub-components that match the screen UI

  const FullHeader = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          <div>
            <Image src="/logo.svg" alt="ERP Logo" width={80} height={80} />
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#333', fontSize: '18px' }}>ERP Manufacturing Systems Co.,Ltd</h2>
            <div style={{ fontSize: '10px', color: '#666', marginTop: '4px', lineHeight: '1.4' }}>
              123/45 Innovation Park, Tech Avenue, Bangkok 10900 Thailand<br />
              Tel: +66 2 123 4567 | Email: sales@erp-company.com<br />
              Tax ID: 0105551234567
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h1 style={{ margin: 0, color: '#137e79', fontSize: '28px', textTransform: 'uppercase', letterSpacing: '2px' }}>Quotation</h1>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '5px' }}>{job.name}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <div style={{ width: '60%', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '4px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '12px', color: '#333' }}>Customer:</div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{job.customer}</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
            Attn: Procurement Department<br />
            Address: 456 Business Tower, Sukhumvit Road, Bangkok 10110
          </div>
        </div>
        <div style={{ width: '35%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 0', fontWeight: 'bold', color: '#666' }}>Date:</td>
                <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 'bold' }}>{job.date}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', fontWeight: 'bold', color: '#666' }}>Validity:</td>
                <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 'bold' }}>30 Days</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', fontWeight: 'bold', color: '#666' }}>Lead Time:</td>
                <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 'bold' }}>14-21 Days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const ShortHeader = () => (
    <div style={{ marginBottom: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #137e79', paddingBottom: '10px', marginBottom: '10px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#333' }}>ERP Manufacturing Systems Co.,Ltd</div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#137e79' }}>QUOTATION (Continued)</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '11px' }}>
        <div>Customer: {job.customer}</div>
        <div>Quotation No.: {job.name} | Date: {job.date}</div>
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
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic', background: '#f8fafc' }}>Item</th>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic', background: '#f8fafc' }}>Part Name</th>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic', background: '#f8fafc' }}>Drawing Form</th>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic', background: '#f8fafc' }}>Part No.</th>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic', background: '#f8fafc' }}>Material</th>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic', background: '#f8fafc' }}>Finishing</th>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic', background: '#f8fafc' }}>Quantity</th>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic', background: '#f8fafc' }}>Unit Price</th>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic', background: '#f8fafc' }}>Discount</th>
        <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic', background: '#f8fafc' }}>Amount (THB)</th>
      </tr>
    </thead>
  );

  const ItemRow = ({ line, index }: { line: any, index: number }) => (
    <React.Fragment>
      <tr>
        <td rowSpan={2} style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top', fontWeight: 'bold' }}>{index + 1}</td>
        <td rowSpan={2} style={{ border: '1px solid black', padding: '6px 4px', verticalAlign: 'top' }}>
          <strong>{line.name}</strong>
          <div style={{ marginTop: '5px', fontSize: '10px', color: '#555', lineHeight: '1.4' }}>
            <div>Dimension: {line.specs ? line.specs.dimension : 'N/A'}</div>
            {line.specs?.parts && (
              <div style={{ marginTop: '4px' }}>
                <strong style={{ color: '#333' }}>Parts:</strong>
                <ul style={{ margin: '2px 0 0 15px', padding: 0 }}>
                  {line.specs.parts.map((p: string, i: number) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            )}
            <div style={{ marginTop: '4px', fontStyle: 'italic', color: '#0f9f95' }}>Warranty: 1 Year</div>
          </div>
        </td>
        <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top' }}>{line.specs ? line.specs.drawingForm : 'N/A'}</td>
        <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top' }}>{line.specs ? line.specs.partNo : 'N/A'}</td>
        <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top' }}>{line.specs ? line.specs.material : 'N/A'}</td>
        <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top' }}>{line.specs ? line.specs.finishing : 'N/A'}</td>
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
              alt="Product Sample"
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
      <TableColGroup />
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
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>การจ่ายเงินโดยใช้เช็คโปรดสั่งจ่ายในนามของ บริษัท ERP แมนูแฟคเจอริง จำกัด บริษัท จะคิดดอกเบี้ย 1.5% ต่อเดือน เมื่อชำระช้าเกินกว่ากำหนด</div>
            <div style={{ fontSize: '11px', fontWeight: 'bold' }}>Please issue a crossed cheque payable to ERP Manufacturing Systems Co.,Ltd Insert at 15% per month will be charged on overdue account</div>
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
    <div style={{ display: 'flex', marginTop: '40px', justifyContent: 'space-between', padding: '0 40px', pageBreakInside: 'avoid' }}>
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

  useEffect(() => {
    // Only re-measure when job.lines change
    const timer = setTimeout(() => {
      const getH = (id: string) => document.getElementById(id)?.offsetHeight || 0;
      
      const hFull = getH('measure-full-header');
      const hShort = getH('measure-short-header');
      const hTableHead = getH('measure-table-header');
      const hFinal = getH('measure-final-section');
      const hSig = getH('measure-signatures');
      
      const itemsH = job.lines.map((_: any, i: number) => getH('measure-item-' + i));
      
      // A4 portrait safe height = 297mm - margins. (approx 1000px)
      const PAGE_HEIGHT = 960;
      
      let currentPages: any[] = [];
      let curItems: any[] = [];
      let curH = hFull + hTableHead;
      
      for(let i=0; i<job.lines.length; i++) {
        if (curH + itemsH[i] > PAGE_HEIGHT) {
          currentPages.push({ items: curItems, hasFinal: false, hasSig: false });
          curItems = [];
          curH = hShort + hTableHead;
        }
        curItems.push({ line: job.lines[i], index: i });
        curH += itemsH[i];
      }
      
      // Check if final section + signature fits
      if (curH + hFinal + hSig > PAGE_HEIGHT) {
        if (curH + hFinal > PAGE_HEIGHT) {
            // Neither fits
            currentPages.push({ items: curItems, hasFinal: false, hasSig: false });
            currentPages.push({ items: [], hasFinal: true, hasSig: true });
        } else {
            // Final fits, Sig doesn't
            currentPages.push({ items: curItems, hasFinal: true, hasSig: false });
            currentPages.push({ items: [], hasFinal: false, hasSig: true });
        }
      } else {
        // Both fit
        currentPages.push({ items: curItems, hasFinal: true, hasSig: true });
      }
      
      setPages(currentPages);
      setMeasured(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [job.lines, quoteGrandTotal]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
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
      `}} />

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
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', tableLayout: 'fixed', fontSize: '11px' }}>
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
              <div>{job.customer} | {job.name}</div>
              <div>Page {pIdx + 1} of {pages.length}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
