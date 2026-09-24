export interface QuotationCompanyInfo {
  name: string;
  nameSub: string;
  address: string;
  tel: string;
  email: string;
  mobile: string;
  taxId: string;
}

export interface QuotationCustomerInfo {
  companyName: string;
  branch: string;
  addressLine1: string;
  addressLine2: string;
  attn: string;
  cc: string;
}

export interface QuotationMetadata {
  quotationNo: string;
  date: string;
  priceValidity: string;
  paymentTerms: string;
  leadTime: string;
  contactPerson: string;
}

export interface QuotationItemDetail {
  size: string;
  parts: string[];
  warranty: string;
  drawingImagePlaceholder?: string; // Using a placeholder since we don't have the real image
}

export interface QuotationItem {
  itemNo: number;
  partName: string;
  drawingForm: string;
  partNo: string;
  material: string;
  finishing: string;
  quantityText: string;
  unitPrice: number;
  discount: number;
  amount: number;
  details: QuotationItemDetail;
}

export interface PaymentSystem {
  depositPercent: number;
  deliverPercent: number;
  creditDays: number;
  creditPercent: number;
}

export interface QuotationSummary {
  total: number;
  vatRate: number;
  vatAmount: number;
  grandTotal: number;
  amountInWordsTh: string;
}

export interface ApproverInfo {
  name: string;
  position: string;
}

export interface DetailedQuotation {
  id: string;
  company: QuotationCompanyInfo;
  customer: QuotationCustomerInfo;
  metadata: QuotationMetadata;
  items: QuotationItem[];
  paymentSystem: PaymentSystem;
  summary: QuotationSummary;
  approver: ApproverInfo;
  notesTh: string;
  notesEn: string;
}

export const mockDetailedQuotation: DetailedQuotation = {
  id: "Q-001",
  company: {
    name: "AUTO - TECH SYSTEMS CO.,LTD",
    nameSub: "AUTO - TECH SYSTEMS CO., LTD.", // Used in logo text area
    address: "Manufacturing : 58/2,58/71 Moo 9 T.Raikhing A.Samphran Nakornpathom 73210 Thailand (Head Office)",
    tel: "065 789 5226",
    email: "ats@auto-techsystems.com",
    mobile: "(081 777 1669)",
    taxId: "0735556004823"
  },
  customer: {
    companyName: "Cal-Comp Automation and Industrial 4.0 Service (Thailand) Co., Ltd.",
    branch: "Branch 00001 : 138 Moo4, Petchkasem Road, Tambol Sarpang , Amphur Khao Yoi",
    addressLine1: "Phetchaburi Province 76140 Thailand.,",
    addressLine2: "",
    attn: "K. Pramote Suckasem (PET-6PE),",
    cc: ""
  },
  metadata: {
    quotationNo: "CALH22609-013 REV 2 Con_Load_Tary_Sip",
    date: "23 September 2026",
    priceValidity: "30 DAYS",
    paymentTerms: "30 DAYS",
    leadTime: "4 Week",
    contactPerson: "ALONGKRON K."
  },
  items: [
    {
      itemNo: 1,
      partName: "Con_Load_Tary_Sip",
      drawingForm: "Calcomp",
      partNo: "CLTS",
      material: "AL",
      finishing: "N/A",
      quantityText: "1 Set",
      unitPrice: 230000,
      discount: 0,
      amount: 230000,
      details: {
        size: "794W x 3200L x 307H mm.",
        parts: [
          "21K6RGN-6W",
          "Gear",
          "Speed",
          "KHF55-2060-4000",
          "MTSRK16-710-F25-R12-T10-Q12-S23-E10-KR0",
          "MTSGR16",
          "LHFC16",
          "Shaft 635 x 16",
          "CDJP2B16-15D",
          "PZ-V11",
          "P-2025-ME-SCH-C00001-17",
          "AS1201F-M5-06A",
          "P-2025-ME-SCH-C00001-16",
          "P-2025-ME-SCH-C00001-18",
          "CTS M5 x 12",
          "socket head cap screw_iso(ISO 4762 M3 x 10 - 10S)",
          "pan head cross recess screw(ISO 7045-M3x20-Z-20)",
          "P-2025-ME-SCH-C00001-05",
          "1583_400W_ECMA-C20604RS",
          "P-2025-ME-SCH-C00007-05",
          "P-2025-ME-SCH-C00001-04",
          "P-2025-ME-SCH-C00001-07",
          "SMT-KSD-CONVEYOR 800-P003.222",
          "C-FFL69577",
          "C-HBPA20-P8-6",
          "TTPA16T5150-A-P10_b",
          "C-TTPA26T5150-A-N14",
          "6001ZZ",
          "POM Parts",
          "Assembly"
        ],
        warranty: "# รับประกัน 1 ปี"
      }
    }
  ],
  paymentSystem: {
    depositPercent: 100,
    deliverPercent: 0,
    creditDays: 30,
    creditPercent: 0
  },
  summary: {
    total: 230000,
    vatRate: 7,
    vatAmount: 16100,
    grandTotal: 246100,
    amountInWordsTh: "สองแสนสี่หมื่นหกพันหนึ่งร้อยบาทถ้วน"
  },
  approver: {
    name: "Alongkron Kunchong",
    position: "Biz. Development Director"
  },
  notesTh: "การจ่ายเงินโดยเช็คโปรดสั่งจ่ายในนามของ บริษัท ออโต้-เทคซิสเต็มส์ จำกัด บริษัท จะคิดดอกเบี้ย 1.5% ต่อเดือน เมื่อชำระช้าเกินกว่ากำหนด",
  notesEn: "Please issue a crossed cheque payable to Auto-TechSystems Co.,Ltd Insert at 15% per month will be charged on overdue account"
};
