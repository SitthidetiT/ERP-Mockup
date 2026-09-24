import {
  FolderKanban,
  Activity,
  Clock3,
  CheckCircle2,
  Tag,
  Wrench,
  Truck,
  UserCheck,
  BriefcaseBusiness,
  ChevronRight,
  FileText,
  ClipboardCheck,
  Settings,
  ChartNoAxesColumnIncreasing,
  Factory,
  ShieldCheck
} from "lucide-react";
import { MetricCard } from "./MetricCard";
import { QuickActionCard } from "./QuickActionCard";

export function DashboardView({
  visibleJobs,
  activeJobs,
  urgentJobs,
  deliveredJobsCount,
  openDialog,
  isManager,
}: {
  visibleJobs: any[];
  activeJobs: number;
  urgentJobs: number;
  deliveredJobsCount: number;
  openDialog: (type: string, data: any) => void;
  isManager: boolean;
}) {
  return (
    <div className="dashboard-content">
      {/* KPI Cards */}
      <div className="stats-grid">
        <MetricCard
          icon={<FolderKanban />}
          label="งานทั้งหมด"
          value={String(visibleJobs.length).padStart(2, "0")}
          detail="งานที่รอดำเนินการในระบบ"
          tone="blue"
        />
        <MetricCard
          icon={<Activity />}
          label="กำลังดำเนินการ"
          value={String(activeJobs).padStart(2, "0")}
          detail="อยู่ในกระบวนการ"
          tone="purple"
        />
        <MetricCard
          icon={<Clock3 />}
          label="งานเร่งด่วน"
          value={String(urgentJobs).padStart(2, "0")}
          detail="ต้องติดตามใกล้ชิด"
          tone="amber"
        />
        <MetricCard
          icon={<CheckCircle2 />}
          label="ส่งมอบแล้ว"
          value={String(deliveredJobsCount).padStart(2, "0")}
          detail="เสร็จสิ้นการจัดส่ง"
          tone="green"
        />
      </div>

      {/* Process Cards */}
      {isManager && (
        <div className="scenario-grid">
          <QuickActionCard
            eyebrow="A · งานขาย"
            title="เริ่มจากใบเสนอราคา"
            detail="สร้าง → เสนอ → อนุมัติ"
            icon={<Tag />}
            onClick={() => openDialog("quote", { qty: "1", price: "1000" })}
          />
          <QuickActionCard
            eyebrow="B · ออกสั่งผลิต"
            title="ติดตาม QC ไม่ผ่าน"
            detail="เลือกส่งผลิตและตรวจซ้ำ"
            icon={<Wrench />}
            onClick={() => openDialog("plan", {})}
          />
          <QuickActionCard
            eyebrow="C · จัดการขนส่ง"
            title="ส่งงานเข้าสู่ขั้นตอน"
            detail="ยืนยันและจัดส่งงาน"
            icon={<Truck />}
            onClick={() => openDialog("delivery", {})}
          />
          <QuickActionCard
            eyebrow="D · หลังการขาย"
            title="ยื่นและอนุมัติใบลา"
            detail="แสดงผลผู้ใช้งาน"
            icon={<UserCheck />}
            onClick={() => openDialog("leave", {})}
          />
        </div>
      )}

      {/* Middle Section: Workflow & Inbox */}
      <div className="dashboard-middle-grid">
        <div className="modern-panel">
          <div className="modern-panel-header">
            <div>
              <div className="modern-panel-title">WORKFLOW OVERVIEW</div>
              <h2 className="modern-panel-subtitle">เส้นทางงานตั้งแต่ต้นจนจบ</h2>
              <p className="modern-panel-desc">ติดตามกระบวนการตั้งแต่เริ่มต้นจนส่งมอบ</p>
            </div>
            <button className="btn-outline">
              <ChartNoAxesColumnIncreasing size={16} /> ดูภาพรวมทั้งหมด
            </button>
          </div>

          <div className="workflow-stepper">
            <div className="workflow-line"></div>
            
            {[
              { num: '01', label: 'ใบเสนอราคา', icon: FileText, active: true },
              { num: '02', label: 'รับงาน', icon: ClipboardCheck, active: false },
              { num: '03', label: 'วิศวกรรม', icon: Settings, active: false },
              { num: '04', label: 'วางแผน', icon: ChartNoAxesColumnIncreasing, active: false },
              { num: '05', label: 'ผลิต', icon: Factory, active: false },
              { num: '06', label: 'ตรวจ QC', icon: ShieldCheck, active: false },
              { num: '07', label: 'จัดส่ง', icon: Truck, active: false }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="workflow-step">
                  <span className="step-number">{step.num}</span>
                  <div className={`step-icon ${step.active ? 'active' : ''}`}>
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modern-panel">
          <div className="modern-panel-header" style={{ marginBottom: '16px' }}>
            <div>
              <h2 className="modern-panel-subtitle">กล่องงานของฉัน</h2>
              <p className="modern-panel-desc">งานสำคัญที่ควรติดตาม</p>
            </div>
            <button className="btn-outline" style={{ padding: '4px 12px', fontSize: '11px' }}>
              ดูงานทั้งหมด <ChevronRight size={14} />
            </button>
          </div>
          <div className="task-list">
            <div className="task-item">
              <div className="task-icon"><BriefcaseBusiness size={20} /></div>
              <div className="task-content">
                <strong className="task-title">โครงประกอบ รุ่น C</strong>
                <span className="task-meta">JOB-2609-003 · QC</span>
              </div>
              <ChevronRight className="task-arrow" size={16} />
            </div>
            <div className="task-item">
              <div className="task-icon"><BriefcaseBusiness size={20} /></div>
              <div className="task-content">
                <strong className="task-title">ชุดฐานยึดเครื่องจักร รุ่น A</strong>
                <span className="task-meta">JOB-2609-001 · ฝ่ายผลิต</span>
              </div>
              <ChevronRight className="task-arrow" size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
