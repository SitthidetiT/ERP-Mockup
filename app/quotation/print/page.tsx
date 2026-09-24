"use client";

import React, { useState, useEffect } from "react";
import { mockDetailedQuotation as data } from "./data";
import { money } from "../../data";

// ----------------------------------------------------
// Sub-components
// ----------------------------------------------------

const FullHeader = () => (
  <>
    <div className="header-top">
      <div className="logo-area">
        <div className="logo-text-main">ATS</div>
        <div className="logo-text-sub">{data.company.nameSub}</div>
      </div>
      <div className="company-info">
        <h1 className="company-name">{data.company.name}</h1>
        <p className="company-address">{data.company.address}</p>
        <p className="company-contact">
          Tel : {data.company.tel} E-Mail : {data.company.email} Mobile : {data.company.mobile} TAX: {data.company.taxId}
        </p>
      </div>
    </div>

    <div className="doc-title">Quotation</div>

    <div className="info-grid">
      <div className="customer-col">
        <table style={{ width: '100%', borderSpacing: 0 }}>
          <tbody>
            <tr>
              <td style={{ width: '30px', verticalAlign: 'top', fontWeight: 'bold' }}>To:</td>
              <td>
                <strong>{data.customer.companyName}</strong><br />
                {data.customer.branch}<br />
                {data.customer.addressLine1}<br />
                {data.customer.addressLine2}
              </td>
            </tr>
            <tr>
              <td style={{ verticalAlign: 'top', fontWeight: 'bold', paddingTop: '10px' }}>Attn:</td>
              <td style={{ paddingTop: '10px', fontWeight: 'bold' }}>{data.customer.attn}</td>
            </tr>
            <tr>
              <td style={{ verticalAlign: 'top', fontWeight: 'bold' }}>C.c.:</td>
              <td style={{ fontWeight: 'bold' }}>{data.customer.cc}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="meta-col">
        <div className="meta-row">
          <div className="meta-label">Quotation No.</div>
          <div className="meta-val">{data.metadata.quotationNo}</div>
        </div>
        <div className="meta-row">
          <div className="meta-label">Date</div>
          <div className="meta-val">{data.metadata.date}</div>
        </div>
        <div className="meta-row">
          <div className="meta-label">Price Validity</div>
          <div className="meta-val">{data.metadata.priceValidity}</div>
        </div>
        <div className="meta-row">
          <div className="meta-label">Payment Terms</div>
          <div className="meta-val">{data.metadata.paymentTerms}</div>
        </div>
        <div className="meta-row">
          <div className="meta-label">Lead Time</div>
          <div className="meta-val">{data.metadata.leadTime}</div>
        </div>
        <div className="meta-row">
          <div className="meta-label">Contact Person</div>
          <div className="meta-val" style={{ textTransform: 'uppercase' }}>{data.metadata.contactPerson}</div>
        </div>
      </div>
    </div>
  </>
);

const ShortHeader = () => (
  <div className="short-header" style={{ marginBottom: '15px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '10px' }}>
      <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'red' }}>{data.company.name}</div>
      <div style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>QUOTATION (Continued)</div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
      <div>Customer: {data.customer.companyName}</div>
      <div>Quotation No.: {data.metadata.quotationNo} | Date: {data.metadata.date}</div>
    </div>
  </div>
);

const TableHeader = () => (
  <thead id="measure-table-header">
    <tr>
      <th style={{ width: '40px' }}>Item</th>
      <th>Part Name</th>
      <th>Drawing Form</th>
      <th>Part No.</th>
      <th>Material</th>
      <th>Finishing</th>
      <th>Quantity</th>
      <th>Unit Price</th>
      <th>Discount</th>
      <th>Amount (THB)</th>
    </tr>
  </thead>
);

const ItemRow = ({ item }: { item: any }) => (
  <React.Fragment>
    <tr>
      <td className="text-center" style={{ borderBottom: 'none' }}><strong>{item.itemNo}</strong></td>
      <td style={{ borderBottom: 'none', width: '250px' }}><strong>{item.partName}</strong></td>
      <td className="text-center" style={{ borderBottom: 'none' }}>{item.drawingForm}</td>
      <td className="text-center" style={{ borderBottom: 'none' }}>{item.partNo}</td>
      <td className="text-center" style={{ borderBottom: 'none' }}>{item.material}</td>
      <td className="text-center" style={{ borderBottom: 'none' }}>{item.finishing}</td>
      <td className="text-center" style={{ borderBottom: 'none' }}>{item.quantityText}</td>
      <td className="text-right" style={{ borderBottom: 'none' }}><strong>{money(item.unitPrice)}</strong></td>
      <td className="text-right" style={{ borderBottom: 'none' }}>{item.discount > 0 ? money(item.discount) : ''}</td>
      <td className="text-right" style={{ borderBottom: 'none' }}><strong>{money(item.amount)}.00</strong></td>
    </tr>
    <tr>
      <td style={{ borderTop: 'none' }}></td>
      <td style={{ borderTop: 'none', verticalAlign: 'top' }}>
        <div className="details-parts">
          <p>Size : {item.details.size}</p>
          <p style={{ marginTop: '5px', fontWeight: 'bold' }}>Parts :</p>
          {item.details.parts.map((p: string, i: number) => (
            <div key={i}>{p}</div>
          ))}
          <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{item.details.warranty}</p>
        </div>
      </td>
      <td colSpan={8} style={{ borderTop: 'none', verticalAlign: 'middle', textAlign: 'center', padding: '20px' }}>
        <div style={{ border: '1px dashed #ccc', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
          [ 3D Drawing Image Placeholder ]<br />
          (Dimensions, Views, Revision History, and Title Block)
        </div>
      </td>
    </tr>
  </React.Fragment>
);

const FinalSection = () => (
  <>
    <div className="payment-system" style={{ marginTop: '20px' }}>
      <p># Payment Systems</p>
      <div style={{ display: 'flex', marginTop: '5px' }}>
        <div style={{ width: '150px' }}>- Deposit upon order</div>
        <div>{data.paymentSystem.depositPercent}%</div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '150px' }}>- Deliver</div>
        <div>{data.paymentSystem.deliverPercent}%</div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '150px' }}>- Credit {data.paymentSystem.creditDays} days</div>
        <div>{data.paymentSystem.creditPercent}%</div>
      </div>
    </div>

    <div className="footer-grid">
      <div className="notes-col">
        <div className="note-th">{data.notesTh}</div>
        <div className="note-en">{data.notesEn}</div>
        <div className="word-amount">
          <div className="word-label">ตัวอักษร</div>
          <div className="word-val">{data.summary.amountInWordsTh}</div>
        </div>
      </div>
      <div className="totals-col">
        <div className="total-row">
          <div className="total-label">Total</div>
          <div className="total-val">{money(data.summary.total)}.00</div>
        </div>
        <div className="total-row">
          <div className="total-label">VAT {data.summary.vatRate}%</div>
          <div className="total-val">{money(data.summary.vatAmount)}.00</div>
        </div>
        <div className="total-row">
          <div className="total-label">Grand Total</div>
          <div className="total-val">{money(data.summary.grandTotal)}.00</div>
        </div>
      </div>
    </div>

    <div className="signatures">
      <div className="sig-box">
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', marginBottom: '10px' }}>APPROVED BY</div>
        <div style={{ fontSize: '24px', fontFamily: 'cursive', color: '#333', marginTop: '30px' }}>{data.approver.name}</div>
        <div className="sig-line" style={{ marginTop: '5px' }}></div>
        <div style={{ fontWeight: 'bold' }}>{data.approver.name}</div>
        <div style={{ fontStyle: 'italic' }}>{data.approver.position}</div>
      </div>
      <div className="sig-box">
        <div className="sig-line" style={{ marginTop: '70px', width: '250px' }}></div>
        <div style={{ fontWeight: 'bold' }}>Signature &amp; Company Stamp</div>
        <div>(Please return a copy by email or fax)</div>
        <div style={{ marginTop: '10px', fontWeight: 'bold' }}>This is a computer generated quotation no signature is required.</div>
      </div>
    </div>
  </>
);


// ----------------------------------------------------
// Main Component
// ----------------------------------------------------

export default function PrintableQuotation() {
  const [pages, setPages] = useState<any[]>([]);
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    // We delay slightly to allow fonts to render if any
    const timer = setTimeout(() => {
      const getH = (id: string) => document.getElementById(id)?.offsetHeight || 0;
      
      const hFull = getH('measure-full-header');
      const hShort = getH('measure-short-header');
      const hTableHead = getH('measure-table-header');
      const hFinal = getH('measure-final-section');
      
      const itemsH = data.items.map((_, i) => getH('measure-item-' + i));
      
      // A4 content safe height (297mm - margins)
      const PAGE_HEIGHT = 980; // slightly conservative to avoid edge cases
      
      let currentPages: any[] = [];
      let curItems: any[] = [];
      let curH = hFull + hTableHead;
      
      for(let i=0; i<data.items.length; i++) {
        if (curH + itemsH[i] > PAGE_HEIGHT) {
          // Push current page
          currentPages.push({ items: curItems, hasFinal: false });
          curItems = [];
          // Next page starts with short header
          curH = hShort + hTableHead;
        }
        curItems.push({ item: data.items[i], index: i });
        curH += itemsH[i];
      }
      
      // Check if final section fits
      if (curH + hFinal > PAGE_HEIGHT) {
        currentPages.push({ items: curItems, hasFinal: false });
        currentPages.push({ items: [], hasFinal: true });
      } else {
        currentPages.push({ items: curItems, hasFinal: true });
      }
      
      setPages(currentPages);
      setMeasured(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; background: white; }
          .no-print { display: none !important; }
          .a4-page { margin: 0 !important; box-shadow: none !important; border: none !important; page-break-after: always; }
          @page { size: A4 portrait; margin: 0; }
        }
        body { background: #f0f0f0; margin: 0; padding: 20px; }
        .a4-page {
          width: 210mm;
          height: 297mm;
          margin: 0 auto 20px auto;
          background: white;
          color: black;
          font-family: Arial, sans-serif;
          font-size: 11px;
          padding: 12mm;
          box-sizing: border-box;
          position: relative;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .header-top { display: flex; align-items: flex-start; margin-bottom: 5px; border-bottom: 2px solid black; padding-bottom: 10px; }
        .logo-area { width: 120px; text-align: center; color: red; font-weight: bold; }
        .logo-text-main { font-size: 32px; margin: 0; line-height: 1; }
        .logo-text-sub { font-size: 9px; border-top: 1px solid red; border-bottom: 1px solid red; display: inline-block; padding: 2px 5px; }
        .company-info { flex: 1; padding-left: 20px; }
        .company-name { color: red; font-size: 20px; font-weight: bold; font-style: italic; margin: 0 0 5px 0; }
        .company-address, .company-contact { margin: 2px 0; font-size: 11px; font-weight: bold; }
        .doc-title { text-align: center; font-size: 24px; font-weight: bold; font-style: italic; margin: 10px 0; }
        .info-grid { display: flex; border: 1px solid black; border-bottom: none; }
        .customer-col { flex: 1; border-right: 1px solid black; padding: 5px; }
        .meta-col { width: 40%; }
        .meta-row { display: flex; border-bottom: 1px solid black; }
        .meta-row:last-child { border-bottom: none; }
        .meta-label { width: 120px; padding: 2px 5px; border-right: 1px solid black; font-weight: bold; background: #f0f0f0; }
        .meta-val { flex: 1; padding: 2px 5px; text-align: center; }
        table.items-table { width: 100%; border-collapse: collapse; border: 1px solid black; }
        table.items-table th, table.items-table td { border: 1px solid black; padding: 4px 6px; }
        table.items-table th { background: #f0f0f0; font-weight: bold; text-align: center; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .details-parts { margin-top: 10px; font-size: 10px; line-height: 1.4; }
        .payment-system { border: 1px solid black; border-bottom: none; padding: 5px; font-weight: bold; }
        .payment-system p { margin: 2px 0; }
        .footer-grid { display: flex; border: 1px solid black; }
        .notes-col { flex: 1; border-right: 1px solid black; }
        .note-th, .note-en { padding: 5px; text-align: center; font-size: 10px; font-weight: bold; border-bottom: 1px solid black; }
        .word-amount { display: flex; }
        .word-label { width: 100px; padding: 5px; border-right: 1px solid black; font-weight: bold; text-align: center; }
        .word-val { flex: 1; padding: 5px; text-align: center; font-weight: bold; }
        .totals-col { width: 250px; }
        .total-row { display: flex; border-bottom: 1px solid black; }
        .total-row:last-child { border-bottom: none; }
        .total-label { flex: 1; padding: 5px; border-right: 1px solid black; font-weight: bold; }
        .total-val { width: 120px; padding: 5px; text-align: right; font-weight: bold; }
        .signatures { display: flex; margin-top: 30px; }
        .sig-box { flex: 1; text-align: center; }
        .sig-line { width: 200px; border-bottom: 1px solid black; margin: 40px auto 5px auto; }
        .btn-print { position: fixed; top: 20px; right: 20px; padding: 10px 20px; background: #137e79; color: white; border: none; border-radius: 5px; cursor: pointer; z-index: 1000; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.2); }
        .page-footer-info { position: absolute; bottom: 12mm; left: 12mm; right: 12mm; display: flex; justify-content: space-between; font-size: 10px; color: #666; font-weight: bold; }
      `}} />

      {/* Floating Print Button */}
      <button className="btn-print no-print" onClick={() => window.print()}>Print Quotation</button>

      {/* MEASURING CONTAINER (Invisible) */}
      {!measured && (
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', visibility: 'hidden', width: '210mm', padding: '12mm', boxSizing: 'border-box' }}>
          <div id="measure-full-header"><FullHeader /></div>
          <div id="measure-short-header"><ShortHeader /></div>
          <table className="items-table"><TableHeader /></table>
          {data.items.map((item, i) => (
            <table className="items-table" key={i}>
              <tbody id={'measure-item-' + i}>
                <ItemRow item={item} />
              </tbody>
            </table>
          ))}
          <div id="measure-final-section"><FinalSection /></div>
        </div>
      )}

      {/* RENDER PAGES */}
      {measured && pages.map((page, pIdx) => (
        <div className="a4-page" key={pIdx}>
          
          {/* Header */}
          {pIdx === 0 ? <FullHeader /> : <ShortHeader />}
          
          {/* Items Table */}
          {page.items.length > 0 && (
            <table className="items-table">
              <TableHeader />
              <tbody>
                {page.items.map((itm: any) => (
                  <ItemRow key={itm.index} item={itm.item} />
                ))}
              </tbody>
            </table>
          )}

          {/* Final Section */}
          {page.hasFinal && <FinalSection />}

          {/* Page Footer */}
          <div className="page-footer-info">
            <div>{data.company.name} | Quotation No. {data.metadata.quotationNo}</div>
            <div>Page {pIdx + 1} of {pages.length}</div>
          </div>
          
        </div>
      ))}
    </>
  );
}
