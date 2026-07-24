import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Activity, MapPin, AlertCircle, Phone, FileText, ActivitySquare, 
  Settings, Users, MessageSquare, Home, ShieldAlert, CreditCard, HeadphonesIcon, 
  Clock, CheckCircle, Truck, Stethoscope, ChevronRight, Bell, User, Info, 
  Mic, Send, Battery, Wifi, X, ChevronLeft, Check, Sliders, Calendar, ChevronDown, Server, Cross, Lock, Search, Navigation
} from 'lucide-react';

// --- CONFIGURATION & THEME ---
const THEME = {
  primary: '#00564E',
  secondary: '#b8d8d8',
  bgPresentation: '#ffffff',
  danger: '#d9342b',
  warning: '#f59e0b',
  success: '#10b981'
};

const FONT_STYLE = { fontFamily: '"Sukhumvit Set", "Kanit", sans-serif' };

// --- GLOBAL WORKFLOW DEFINITIONS ---
const ADMIN_STEPS = [
  { id: 'sos_triggered', label: 'รับแจ้งเหตุ', icon: <AlertCircle size={18}/> },
  { id: 'admin_acknowledged', label: 'ศูนย์ยืนยันเหตุ', icon: <CheckCircle size={18}/> },
  { id: 'ambulance_dispatched', label: 'สั่งรถพยาบาล', icon: <Truck size={18}/> },
  { id: 'on_scene', label: 'ถึงที่เกิดเหตุ', icon: <MapPin size={18}/> },
  { id: 'in_transit', label: 'กำลังนำส่ง รพ.', icon: <Activity size={18}/> },
  { id: 'hospital_handed_over', label: 'ส่งมอบ รพ.', icon: <Server size={18}/> }
];

const HOSPITAL_STEPS = [
  { id: 'hospital_handed_over', label: 'รอรับผู้ป่วย', icon: <ShieldAlert size={18}/> },
  { id: 'in_er', label: 'เข้าห้องฉุกเฉิน', icon: <Activity size={18}/> },
  { id: 'assessment', label: 'ประเมินอาการ', icon: <ActivitySquare size={18}/> },
  { id: 'doctor_assigned', label: 'แพทย์ดูแล', icon: <Stethoscope size={18}/> },
  { id: 'treatment', label: 'กำลังรักษา', icon: <Cross size={18}/> },
  { id: 'resolved', label: 'เสร็จสิ้น', icon: <CheckCircle size={18}/> }
];

const FAMILY_TIMELINE = [
  { id: 'sos_triggered', label: 'รับแจ้งเหตุ', from: 'admin' },
  { id: 'ambulance_dispatched', label: 'รถพยาบาลออกเดินทาง', from: 'admin' },
  { id: 'on_scene', label: 'กำลังปฐมพยาบาล', from: 'admin' },
  { id: 'in_transit', label: 'นำส่งโรงพยาบาล', from: 'admin' },
  { id: 'hospital_handed_over', label: 'ถึงโรงพยาบาล', from: 'hospital' },
  { id: 'doctor_assigned', label: 'แพทย์รับช่วงต่อ', from: 'hospital' },
  { id: 'treatment', label: 'กำลังรักษา (ER)', from: 'hospital' },
  { id: 'resolved', label: 'ปลอดภัย / ปิดเคส', from: 'hospital' }
];

export default function App() {
  const [currentView, setCurrentView] = useState('elder');
  
  // Emergency State
  const [emergencyStatus, setEmergencyStatus] = useState(null);
  
  // Vitals State
  const [vitals, setVitals] = useState({ 
    hr: 72, bloodPressure: '120/80', oxygen: 98, 
    location: 'บ้าน (ห้องรับแขก)', battery: 85, healthScore: 100 
  });
  
  const [fallCountdown, setFallCountdown] = useState(10);
  const countdownRef = useRef(null);

  // Global Chat State
  const [globalChat, setGlobalChat] = useState([
    { sender: 'admin', text: 'สวัสดีครับ ศูนย์ myHealthCare ยินดีให้บริการ มีอะไรให้ช่วยเหลือแจ้งได้เลยครับ' }
  ]);

  // Elder Settings State (Managed by Family, Applied to Elder)
  const [elderSettings, setElderSettings] = useState({
    fontSize: 'normal', // 'normal' | 'large'
    sosVolume: 'max'
  });

  // Patient Data
  const patientData = {
    name: 'นายปิยชาญ ตาลอำไพ', age: 75,
    allergies: 'Penicillin (เพนิซิลลิน)',
    diseases: 'ความดันโลหิตสูง, เบาหวานประเภท 2',
    livingWill: 'ปฏิเสธการปั๊มหัวใจ (DNR) หากอยู่ในภาวะสมองตาย (เอกสาร LW-2023-08)',
    insurance: 'AIA แผนผู้สูงวัยพรีเมียม (วงเงิน 5 ล้านบาท)'
  };

  // --- Actions ---
  const triggerFallDetection = () => {
    setCurrentView('watch');
    setEmergencyStatus('countdown');
    setFallCountdown(10);
  };

  const cancelEmergency = () => {
    setEmergencyStatus(null);
    setVitals({ hr: 75, bloodPressure: '120/80', oxygen: 98, location: 'บ้าน (ห้องรับแขก)', battery: 85, healthScore: 100 });
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const confirmEmergency = () => {
    setEmergencyStatus('sos_triggered');
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const sendGlobalMessage = (sender, text) => {
    setGlobalChat(prev => [...prev, { sender, text }]);
  };

  // --- Effects ---
  useEffect(() => {
    if (emergencyStatus === 'countdown') {
      setVitals(prev => ({ ...prev, hr: 110, bloodPressure: '140/90', healthScore: 50 })); 
      countdownRef.current = setInterval(() => {
        setFallCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            confirmEmergency();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [emergencyStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (emergencyStatus === 'post_life_executed') {
        setVitals(prev => ({ ...prev, hr: 0, bloodPressure: '0/0', oxygen: 0, healthScore: 0 }));
      } else if (emergencyStatus !== 'countdown' && emergencyStatus !== 'sos_triggered') {
        const isEmergency = emergencyStatus && emergencyStatus !== 'resolved';
        setVitals(prev => ({ 
          ...prev, 
          hr: isEmergency ? (100 + Math.floor(Math.random() * 15)) : (70 + Math.floor(Math.random() * 5)),
          healthScore: isEmergency ? 45 : 100
        }));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [emergencyStatus]);

  const isAdminAlert = ['sos_triggered', 'admin_acknowledged', 'ambulance_dispatched', 'on_scene', 'post_life_pending'].includes(emergencyStatus);
  const isHospitalAlert = ['in_transit', 'hospital_handed_over', 'in_er', 'assessment', 'doctor_assigned', 'treatment'].includes(emergencyStatus);

  return (
    <div className="min-h-screen font-sans flex flex-col overflow-hidden" style={{ backgroundColor: THEME.bgPresentation, ...FONT_STYLE }}>
      {/* Top Device Switcher */}
      <div className="p-4 border-b flex flex-wrap justify-center gap-3 sticky top-0 z-50 shadow-sm bg-white" style={{ borderColor: THEME.secondary }}>
        <h1 className="w-full text-center font-extrabold text-2xl mb-1" style={{ color: THEME.primary }}>myHealthCare Ecosystem</h1>
        
        <DeviceBtn icon={<Clock/>} label="Smart Watch" active={currentView === 'watch'} onClick={() => setCurrentView('watch')} />
        <DeviceBtn icon={<User/>} label="Elder App" active={currentView === 'elder'} onClick={() => setCurrentView('elder')} />
        <DeviceBtn icon={<Users/>} label="Family App" active={currentView === 'family'} onClick={() => setCurrentView('family')} />
        <DeviceBtn icon={<Server/>} label="Admin Dashboard" active={currentView === 'admin'} onClick={() => setCurrentView('admin')} alert={isAdminAlert} />
        <DeviceBtn icon={<ActivitySquare/>} label="Hospital Dashboard" active={currentView === 'hospital'} onClick={() => setCurrentView('hospital')} alert={isHospitalAlert} />
        
        <div className="w-full flex justify-center mt-2">
           <button onClick={triggerFallDetection} className="text-white px-5 py-2.5 rounded-full font-bold shadow-lg animate-pulse flex items-center gap-2 hover:scale-105 transition-transform" style={{ backgroundColor: THEME.danger }}>
             <AlertCircle size={20}/> จำลองเหตุการณ์: ผู้สูงอายุหกล้ม (Trigger SOS)
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex justify-center items-center p-4 sm:p-8 overflow-y-auto bg-slate-50">
        {currentView === 'watch' && <WatchSim vitals={vitals} status={emergencyStatus} countdown={fallCountdown} onCancel={cancelEmergency} onConfirm={confirmEmergency} />}
        {currentView === 'elder' && <MobileContainer title="Elder App (iPhone)"><ElderApp vitals={vitals} onSos={confirmEmergency} onCancelSos={cancelEmergency} status={emergencyStatus} countdown={fallCountdown} patientData={patientData} elderSettings={elderSettings} /></MobileContainer>}
        {currentView === 'family' && <MobileContainer title="Family App (iPhone)"><FamilyApp vitals={vitals} status={emergencyStatus} patientData={patientData} globalChat={globalChat} sendGlobalMessage={sendGlobalMessage} elderSettings={elderSettings} setElderSettings={setElderSettings} /></MobileContainer>}
        {currentView === 'admin' && <DesktopContainer title="ADMIN / DISPATCH CENTER"><AdminDashboard status={emergencyStatus} setStatus={setEmergencyStatus} vitals={vitals} patientData={patientData} globalChat={globalChat} sendGlobalMessage={sendGlobalMessage} /></DesktopContainer>}
        {currentView === 'hospital' && <DesktopContainer title="HOSPITAL ER NODE"><HospitalDashboard status={emergencyStatus} setStatus={setEmergencyStatus} vitals={vitals} patientData={patientData} /></DesktopContainer>}
      </div>
    </div>
  );
}

// --- Reusable UI Components ---
const DeviceBtn = ({ icon, label, active, onClick, alert }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 font-bold ${active ? 'text-white shadow-md scale-105' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'}`} style={active ? { backgroundColor: THEME.primary } : {}}>
    {icon} <span className="text-sm">{label}</span>
    {alert && <span className="w-3 h-3 rounded-full ml-1 animate-pulse" style={{ backgroundColor: THEME.danger }}></span>}
  </button>
);

const MobileContainer = ({ children, title }) => (
  <div className="flex flex-col items-center drop-shadow-2xl">
    <div className="mb-2 font-bold text-slate-500">{title}</div>
    <div className="w-[390px] h-[844px] bg-black rounded-[45px] border-[8px] border-slate-800 overflow-hidden relative flex flex-col ring-1 ring-slate-200/50">
      <div className="absolute top-0 w-full h-7 flex justify-center z-[100]"><div className="w-[120px] h-6 bg-slate-800 rounded-b-3xl"></div></div>
      <div className="flex-1 w-full h-full bg-white relative overflow-hidden flex flex-col" style={FONT_STYLE}>{children}</div>
    </div>
  </div>
);

const DesktopContainer = ({ children, title }) => (
  <div className="w-full max-w-[1400px] h-[800px] bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col border border-slate-200 ring-4 ring-slate-100/50">
    <div className="h-8 flex items-center px-4 gap-2" style={{ backgroundColor: THEME.primary }}>
      <div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div>
      <div className="flex-1 text-center text-xs text-white/80 font-bold tracking-widest">{title}</div>
    </div>
    <div className="flex-1 overflow-hidden flex text-slate-800" style={FONT_STYLE}>{children}</div>
  </div>
);

const SimpleModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="font-bold text-lg" style={{ color: THEME.primary }}>{title}</h3>
          <button onClick={onClose} className="p-1 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"><X size={20}/></button>
        </div>
        <div className="text-slate-600">{children}</div>
      </div>
    </div>
  );
};


// ==========================================
// 1. Elder App (myHealthCare - Elder)
// ==========================================
const ElderApp = ({ vitals, onSos, onCancelSos, status, countdown, patientData, elderSettings }) => {
  const [navTab, setNavTab] = useState('home');
  const isPostLife = status === 'post_life_executed';

  // Apply dynamic font scaling based on family app settings
  const dynamicScale = elderSettings.fontSize === 'large' ? 'scale-105 origin-top' : 'scale-100 origin-top';

  if (isPostLife) return (
    <div className="h-full bg-slate-900 flex flex-col items-center justify-center text-white p-8 text-center relative z-50">
      <Lock size={64} className="mb-4 text-slate-500" />
      <h2 className="text-2xl font-bold mb-2">Account Memorialized</h2>
      <p className="text-slate-400 text-sm">บัญชีนี้ถูกระงับการใช้งานชั่วคราวตามมาตรการ Post-Life Protocol ข้อมูลและสินทรัพย์ถูกส่งต่อให้ทายาทเรียบร้อยแล้ว</p>
    </div>
  );

  if (status === 'countdown') return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-pulse z-50 relative" style={{ backgroundColor: THEME.danger }}>
      <ShieldAlert size={80} className="text-white mb-4" />
      <h2 className="text-3xl font-black text-white mb-2">ยืนยันขอความช่วยเหลือ?</h2>
      <p className="text-white/90 text-lg mb-6">ระบบกำลังส่งสัญญาณฉุกเฉินใน</p>
      <div className="text-8xl font-black text-white mb-10">{countdown}</div>
      <div className="flex gap-4 w-full">
        <button onClick={onCancelSos} className="flex-1 py-4 bg-black/30 text-white rounded-2xl font-bold text-xl active:scale-95">ยกเลิก</button>
        <button onClick={onSos} className="flex-1 py-4 bg-white text-red-600 rounded-2xl font-black text-xl active:scale-95 shadow-lg">ยืนยันทันที</button>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-full bg-white text-slate-800 transition-all duration-300 ${dynamicScale}`}>
      <div className="flex-1 overflow-y-auto px-5 pt-12 pb-6" style={{ background: `linear-gradient(180deg, #f0f8f5 0%, #ffffff 100%)` }}>
        {navTab === 'home' && <ElderHome vitals={vitals} onSos={onSos} status={status} patientData={patientData} />}
        {navTab === 'assistant' && <ElderAssistant />}
        {navTab === 'community' && <ElderCommunity />}
        {navTab === 'settings' && <ElderSettings elderSettings={elderSettings} />}
      </div>
      <div className="bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 pt-4 pb-8 flex justify-between items-center rounded-t-[30px] shadow-[0_-10px_30px_rgba(0,0,0,0.03)] z-10 relative">
        <NavBtn icon={<Home/>} label="หน้าหลัก" active={navTab==='home'} onClick={()=>setNavTab('home')} />
        <NavBtn icon={<Mic/>} label="ผู้ช่วย" active={navTab==='assistant'} onClick={()=>setNavTab('assistant')} />
        <NavBtn icon={<Users/>} label="ชุมชน" active={navTab==='community'} onClick={()=>setNavTab('community')} />
        <NavBtn icon={<Settings/>} label="ตั้งค่า" active={navTab==='settings'} onClick={()=>setNavTab('settings')} />
      </div>
    </div>
  );
};

const ElderHome = ({ vitals, onSos, status, patientData }) => {
  const [isPressing, setIsPressing] = useState(false);
  const pressTimer = useRef(null);

  const startPress = () => {
    setIsPressing(true);
    pressTimer.current = setTimeout(() => { onSos(); setIsPressing(false); }, 1000); 
  };
  const endPress = () => {
    setIsPressing(false);
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <div className="w-20 h-20 rounded-full shadow-md overflow-hidden mb-2 relative border-4 border-white bg-slate-200">
             <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex gap-2 mt-2">
           <button className="p-2 rounded-full transition-colors bg-white shadow-sm text-[#00564E]"><Mic size={24}/></button>
           <button className="p-2 rounded-full transition-colors bg-white shadow-sm text-[#00564E]"><Sliders size={24}/></button>
        </div>
      </div>
      
      <div>
        <h1 className="text-[32px] font-extrabold tracking-tight" style={{ color: THEME.primary }}>สวัสดี คุณตาปิยชาญ</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mt-2 hide-scrollbar">
         <button className="whitespace-nowrap px-6 py-2.5 text-white rounded-2xl font-bold text-sm shadow-md" style={{ backgroundColor: THEME.primary }}>ประวัติ</button>
         <button className="whitespace-nowrap px-6 py-2.5 bg-white text-slate-600 rounded-2xl font-bold text-sm shadow-sm border border-slate-100">ผลตรวจล่าสุด</button>
         <button className="whitespace-nowrap px-6 py-2.5 bg-white text-slate-600 rounded-2xl font-bold text-sm shadow-sm border border-slate-100">ประกันสุขภาพ</button>
      </div>

      <div className="rounded-[28px] p-5 shadow-lg relative mt-2 text-white overflow-hidden" style={{ backgroundColor: THEME.primary }}>
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
         <div className="flex items-center gap-4 relative z-10">
            <Heart size={54} className="fill-current text-white/90" />
            <div className="flex-1">
               <h2 className="text-[28px] font-extrabold leading-tight">สุขภาพ</h2>
               <p className="font-medium text-white/70">Health Score</p>
            </div>
            <div className="text-5xl font-black mt-2">{vitals.healthScore}<span className="text-2xl">%</span></div>
         </div>
         
         <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mt-5 flex justify-around border border-white/20 relative z-10">
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase tracking-widest opacity-80">อัตราเต้นหัวใจ</span>
              <div className="text-2xl font-black flex items-center justify-center gap-1">{vitals.hr} <span className="text-xs font-normal opacity-80">bpm</span></div>
            </div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase tracking-widest opacity-80">ความดันโลหิต</span>
              <div className="text-2xl font-black">{vitals.bloodPressure}</div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-1">
         <div className="bg-white rounded-[24px] p-5 shadow-md border border-slate-100">
            <h3 className="text-[20px] font-extrabold mb-3 flex items-center gap-2" style={{ color: THEME.primary }}><Bell size={18}/> แจ้งเตือน</h3>
            <ul className="text-[13px] font-bold text-slate-600 list-disc pl-4 space-y-2 leading-snug"><li>งดอาหารก่อนตรวจ</li><li>ทานยาความดัน</li></ul>
         </div>
         <div className="bg-white rounded-[24px] p-5 shadow-md border border-slate-100">
            <h3 className="text-[20px] font-extrabold mb-3 flex items-center gap-2" style={{ color: THEME.primary }}><FileText size={18}/> บันทึก</h3>
            <ul className="text-[13px] font-bold text-slate-600 list-disc pl-4 space-y-2 leading-snug"><li>20/07 อาการเวียนหัว</li></ul>
         </div>
      </div>

      <div className="flex flex-col items-center mt-6 mb-2">
         <button 
           onPointerDown={startPress} onPointerUp={endPress} onPointerLeave={endPress} 
           className={`w-[140px] h-[140px] rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-300 select-none
             ${isPressing ? 'scale-90 bg-red-800' : 'hover:scale-105 active:scale-95'}
             ${(status && status !== 'resolved') ? 'bg-orange-500 animate-pulse' : 'bg-[#d9342b]'}`}
           style={{ touchAction: 'none' }}
         >
            <Bell size={50} className={`mb-1 ${isPressing ? 'animate-bounce' : ''}`} strokeWidth={3} />
            <span className="text-[28px] font-black tracking-widest mt-[-2px]">SOS</span>
         </button>
         <p className="mt-4 font-bold text-[15px] tracking-wide text-center" style={{ color: THEME.danger }}>
           {isPressing ? 'กำลังขอความช่วยเหลือ...' : 'กดค้าง 1 วินาทีเพื่อขอความช่วยเหลือ'}
         </p>
      </div>
    </div>
  );
};

const ElderAssistant = () => {
  const [chat, setChat] = useState([{ sender: 'ai', text: 'สวัสดีจ้า มีอะไรให้ฉันช่วยไหม? เลือกคำถามด้านล่างได้เลยจ้า' }]);
  const chatEndRef = useRef(null);
  const sendMsg = (msg, reply) => {
    setChat(prev => [...prev, { sender: 'user', text: msg }]);
    setTimeout(() => { setChat(prev => [...prev, { sender: 'ai', text: reply }]); chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, 600);
  };
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-[28px] font-extrabold mb-4 flex items-center gap-2" style={{ color: THEME.primary }}><Mic/> ผู้ช่วยส่วนตัว (AI)</h3>
      <div className="flex-1 overflow-y-auto bg-slate-100/50 rounded-[28px] p-4 mb-4 flex flex-col gap-3 shadow-inner">
        {chat.map((msg, i) => (
          <div key={i} className={`max-w-[85%] p-4 rounded-2xl text-[16px] font-bold shadow-sm ${msg.sender === 'ai' ? 'bg-white text-slate-800 rounded-tl-none self-start border border-slate-100' : 'text-white rounded-tr-none self-end'}`} style={msg.sender === 'user' ? { backgroundColor: THEME.primary } : {}}>{msg.text}</div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="grid grid-cols-1 gap-3">
        <button onClick={() => sendMsg('วันนี้ฉันต้องกินยาอะไรบ้าง?', 'วันนี้มียาความดันหลังอาหารเช้า 1 เม็ดจ้า')} className="bg-white border-2 border-slate-100 text-slate-700 py-4 px-5 rounded-2xl text-[18px] font-bold text-left active:bg-slate-50 shadow-sm">💊 วันนี้ต้องกินยาอะไรบ้าง?</button>
        <button onClick={() => sendMsg('โทรหาลูกสาวให้หน่อย', 'กำลังเตรียมโทรหา "ลูกแพรว" รอสักครู่นะจ๊ะ...')} className="bg-white border-2 border-slate-100 text-slate-700 py-4 px-5 rounded-2xl text-[18px] font-bold text-left active:bg-slate-50 shadow-sm">📞 โทรหาลูกสาว</button>
      </div>
    </div>
  );
};

const ElderCommunity = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([
    { sender: 'other', text: 'สวัสดีตอนเช้าครับทุกคน วันนี้อากาศดีมาก', name: 'ลุงสมหมาย' },
    { sender: 'me', text: 'สวัสดีจ้าลุงสมหมาย' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const handleSend = () => {
    if(!input.trim()) return;
    setMessages(prev => [...prev, { sender: 'me', text: input }]);
    setInput('');
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  if (activeChat) {
    return (
      <div className="h-full flex flex-col -mx-5 pt-0 mt-[-48px] bg-slate-50">
        <div className="text-white px-4 py-5 flex items-center gap-3 shadow-md z-10 sticky top-0 pt-12" style={{ backgroundColor: THEME.primary }}>
          <button onClick={() => setActiveChat(null)} className="p-2 bg-black/10 rounded-full active:scale-95"><ChevronLeft size={24}/></button>
          <div className="text-2xl bg-white/20 w-10 h-10 rounded-full flex items-center justify-center">{activeChat.icon}</div>
          <h3 className="font-bold text-xl">{activeChat.name}</h3>
        </div>
        <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
           {messages.map((m, i) => (
             m.sender === 'other' ? 
               <div key={i} className="self-start bg-white p-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm border border-slate-200">
                 <p className="text-[12px] font-extrabold mb-1" style={{ color: THEME.primary }}>{m.name}</p>
                 <p className="font-medium text-slate-800">{m.text}</p>
               </div>
             :
               <div key={i} className="self-end text-white font-medium p-3 rounded-2xl rounded-tr-none max-w-[80%] shadow-md" style={{ backgroundColor: THEME.primary }}>
                 <p>{m.text}</p>
               </div>
           ))}
           <div ref={chatEndRef} />
        </div>
        <div className="p-4 bg-white border-t border-slate-200 flex gap-2 pb-8">
          <input type="text" value={input} onChange={(e)=>setInput(e.target.value)} onKeyPress={(e)=>e.key==='Enter' && handleSend()} placeholder="พิมพ์ข้อความ..." className="flex-1 bg-slate-100 rounded-full px-5 py-3 text-lg font-medium outline-none" />
          <button onClick={handleSend} className="w-12 h-12 text-white rounded-full flex items-center justify-center active:scale-95 shadow-md" style={{ backgroundColor: THEME.primary }}><Send size={20}/></button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-[28px] font-extrabold mb-4 flex items-center gap-2" style={{ color: THEME.primary }}><Users/> ชุมชนของฉัน</h3>
      <div className="flex flex-col gap-4">
        {[
          { id: 1, icon: '🌳', name: 'ชมรมคนรักต้นไม้', msg: 'มีข้อความใหม่ 3 ข้อความ' },
          { id: 2, icon: '🧘‍♂️', name: 'ออกกำลังกายยามเช้า', msg: 'คุยล่าสุด: เมื่อวานนี้' },
          { id: 3, icon: '🙏', name: 'สนทนาธรรม', msg: 'กิจกรรมสวดมนต์เย็นนี้' }
        ].map(g => (
          <button key={g.id} onClick={() => setActiveChat(g)} className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-4 active:scale-95 text-left transition-transform">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-inner" style={{ backgroundColor: THEME.secondary }}>{g.icon}</div>
            <div className="flex-1">
              <h4 className="text-xl font-extrabold text-slate-800">{g.name}</h4>
              <p className="text-slate-500 font-bold text-[14px] mt-1">{g.msg}</p>
            </div>
            <ChevronRight className="text-slate-400"/>
          </button>
        ))}
      </div>
    </div>
  );
};

const ElderSettings = ({ elderSettings }) => (
  <div className="h-full flex flex-col">
    <h3 className="text-[28px] font-extrabold mb-4 flex items-center gap-2" style={{ color: THEME.primary }}><Settings/> การตั้งค่าระบบ</h3>
    
    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <Info size={24} className="text-blue-500" />
        <h4 className="font-bold text-slate-800 text-lg">จัดการโดย Family App</h4>
      </div>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed">
        เพื่อให้การใช้งานง่ายที่สุด การตั้งค่าเหล่านี้ถูกล็อคไว้ หากต้องการเปลี่ยนแปลง กรุณาให้ลูกหลานปรับตั้งค่าผ่าน Family App
      </p>

      <div className="space-y-4 border-t border-slate-100 pt-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-slate-700">ขนาดตัวอักษรหน้าจอ</span>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">
            {elderSettings.fontSize === 'normal' ? 'ขนาดปกติ' : 'ขนาดใหญ่'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-slate-700">ระดับเสียงเตือน SOS</span>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">
            ดังที่สุด (Max)
          </span>
        </div>
      </div>
    </div>
  </div>
);

const NavBtn = ({ icon, label, active, onClick }) => {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-[72px] h-[72px] rounded-[22px] transition-all duration-300 active:scale-95 ${active ? 'shadow-lg text-white' : 'text-slate-400 bg-transparent hover:bg-slate-50'}`} style={active ? { backgroundColor: THEME.primary } : {}}>
      <div className={`mb-1 ${active ? 'scale-110' : ''} transition-transform`}>{React.cloneElement(icon, { size: active ? 28 : 24, strokeWidth: active ? 2.5 : 2 })}</div>
      <span className={`text-[12px] font-bold tracking-wide ${active ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
    </button>
  );
};


// ==========================================
// 2. Watch Simulator (46mm)
// ==========================================
const WatchSim = ({ vitals, status, countdown, onCancel, onConfirm }) => {
  const isPostLife = status === 'post_life_executed';

  return (
    <div className="flex flex-col items-center drop-shadow-2xl">
      <div className="mb-4 font-bold text-slate-500">Smart Watch (ขนาด 46 มม.)</div>
      <div className="w-[320px] h-[320px] rounded-full bg-slate-800 p-3 shadow-2xl relative flex items-center justify-center border-[6px] border-slate-700">
        <div className="w-full h-full rounded-full bg-black overflow-hidden relative text-white flex flex-col items-center justify-center font-sans">
          
          {isPostLife ? (
             <div className="w-full h-full bg-black"></div> 
          ) : status === 'countdown' ? (
            <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center animate-pulse" style={{ backgroundColor: THEME.danger }}>
              <ShieldAlert size={40} className="text-white mb-1" />
              <h2 className="text-lg font-black mb-1">ยืนยัน SOS?</h2>
              <div className="text-6xl font-black mb-3">{countdown}</div>
              <div className="flex gap-2 w-full px-2">
                 <button onClick={onCancel} className="flex-1 py-3 bg-black/40 rounded-full font-bold text-sm">ยกเลิก</button>
                 <button onClick={onConfirm} className="flex-1 py-3 bg-white text-red-600 rounded-full font-black text-sm">ยืนยัน</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-between w-full h-full py-8 bg-gradient-to-b from-slate-900 to-black">
              <div className="text-[54px] font-light tracking-wider mt-8">14:30</div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 font-medium" style={{ color: THEME.secondary }}><Heart size={20} className="animate-pulse" fill="currentColor" /><span className="text-4xl font-bold text-white">{vitals.hr}</span><span className="text-sm opacity-70">bpm</span></div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <button onDoubleClick={onConfirm} className="w-16 py-2 rounded-full font-black text-white shadow-lg active:scale-90" style={{ backgroundColor: THEME.danger }}>SOS</button>
              </div>
            </div>
          )}
        </div>
        <div className="absolute right-[-14px] top-[140px] w-3.5 h-14 bg-slate-600 rounded-r-lg border-y border-r border-slate-500"></div>
      </div>
    </div>
  );
};


// ==========================================
// 3. Family App (myHealthCare - Family)
// ==========================================
const FamilyApp = ({ vitals, status, patientData, globalChat, sendGlobalMessage, elderSettings, setElderSettings }) => {
  const [navTab, setNavTab] = useState('home');
  const isPostLife = status === 'post_life_executed';

  if (isPostLife) return (
    <div className="h-full bg-slate-900 flex flex-col text-white p-6 relative z-50 overflow-y-auto">
      <div className="flex items-center gap-3 mb-8 pt-8">
        <Lock size={32} className="text-purple-400"/>
        <h2 className="text-2xl font-bold text-purple-300">Memory Vault & Asset Transfer</h2>
      </div>
      <div className="bg-purple-900/30 p-5 rounded-2xl border border-purple-500/50 mb-4">
        <h3 className="font-bold text-purple-200 mb-2">มรดกและสินทรัพย์ (Smart Contract)</h3>
        <p className="text-sm text-slate-300 mb-4">ระบบดำเนินการโอนถ่ายสินทรัพย์ตามพินัยกรรมดิจิทัลเรียบร้อยแล้ว</p>
        <div className="bg-black/40 p-4 rounded-xl flex justify-between items-center">
           <span className="text-slate-400 text-sm">ยอดเงินโอนเข้าบัญชี</span>
           <span className="font-black text-xl text-green-400">5,000,000 THB</span>
        </div>
      </div>
      <div className="bg-purple-900/30 p-5 rounded-2xl border border-purple-500/50">
        <h3 className="font-bold text-purple-200 mb-2">วิดีโอสั่งลา (Memory Vault)</h3>
        <div className="w-full aspect-video bg-black rounded-xl flex items-center justify-center relative overflow-hidden mt-3 border border-slate-700">
           <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm z-10"><div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white border-b-8 border-b-transparent ml-1"></div></div>
           <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80" className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm" alt="Video cover" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900">
      <div className="pt-12 pb-4 px-6 text-white rounded-b-[32px] shadow-md flex justify-between items-center z-10 relative overflow-hidden" style={{ backgroundColor: THEME.primary }}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="relative z-10">
          <h2 className="text-[22px] font-extrabold tracking-wide">Family Care</h2>
          <p className="text-white/70 text-sm font-medium">ดูแล: คุณตาปิยชาญ</p>
        </div>
        <div className="relative z-10 bg-white/10 p-2 rounded-full">
          <Bell size={24} className="text-white" />
          {status && status !== 'resolved' && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping border-2 border-transparent"></div>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {navTab === 'home' && <FamilyHome vitals={vitals} status={status} />}
        {navTab === 'map' && <FamilyMap vitals={vitals} />}
        {navTab === 'service' && <FamilyService patientData={patientData} globalChat={globalChat} sendGlobalMessage={sendGlobalMessage} />}
        {navTab === 'settings' && <FamilySettings elderSettings={elderSettings} setElderSettings={setElderSettings} />}
      </div>

      <div className="bg-white border-t border-slate-200 px-6 pt-4 pb-8 flex justify-between items-center rounded-t-[30px] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10">
        <NavBtnBase icon={<Home/>} label="หน้าหลัก" active={navTab==='home'} onClick={()=>setNavTab('home')} />
        <NavBtnBase icon={<MapPin/>} label="พิกัด" active={navTab==='map'} onClick={()=>setNavTab('map')} />
        <NavBtnBase icon={<HeadphonesIcon/>} label="บริการ" active={navTab==='service'} onClick={()=>setNavTab('service')} />
        <NavBtnBase icon={<Settings/>} label="ตั้งค่า" active={navTab==='settings'} onClick={()=>setNavTab('settings')} />
      </div>
    </div>
  );
};

const FamilyHome = ({ vitals, status }) => {
  const getTimelineIndex = () => {
    return FAMILY_TIMELINE.findIndex(step => step.id === status);
  };
  const activeIndex = getTimelineIndex();
  const isEmergencyActive = activeIndex >= 0 && status !== 'resolved';

  return (
    <div className="flex flex-col gap-5">
      {isEmergencyActive ? (
        <div className="bg-white rounded-[28px] shadow-lg border border-red-100 overflow-hidden">
          <div className="p-4 text-white flex items-center gap-2 font-bold text-lg animate-pulse" style={{ backgroundColor: THEME.danger }}>
            <AlertCircle /> เหตุฉุกเฉินกำลังดำเนินการ
          </div>
          <div className="p-5 flex flex-col gap-4 relative">
            <div className="absolute left-8 top-8 bottom-8 w-1 bg-slate-100 rounded-full"></div>
            {FAMILY_TIMELINE.map((step, idx) => {
              const isActive = idx === activeIndex;
              const isPast = idx < activeIndex;
              if (!isActive && !isPast && idx > activeIndex + 1) return null; 
              
              return (
                <div key={step.id} className={`flex items-start gap-4 relative z-10 ${!isActive && !isPast ? 'opacity-40' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] text-white shadow-sm transition-colors ${isActive ? 'bg-red-500 ring-4 ring-red-100' : isPast ? 'bg-green-500' : 'bg-slate-300'}`}>
                    {isPast ? <Check size={14}/> : (idx+1)}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className={`font-extrabold text-sm ${isActive ? 'text-red-600' : isPast ? 'text-green-700' : 'text-slate-500'}`}>{step.label}</p>
                    {isActive && <p className="text-[12px] text-slate-500 font-medium">ระบบอัปเดตสถานะแบบ Real-time</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-[28px] shadow-sm border border-slate-100 flex items-center justify-between">
          <div><h3 className="font-extrabold text-slate-800 text-[18px]">สถานะปัจจุบัน</h3><p className="text-slate-500 text-sm font-medium mt-1">อัปเดตล่าสุดเมื่อสักครู่</p></div>
          <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-xl flex items-center gap-2 font-bold text-sm border border-green-100"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> ปกติปลอดภัย</div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100">
           <p className="text-slate-500 text-[13px] font-bold mb-1">อัตราเต้นหัวใจ</p>
           <p className="text-[28px] font-black text-slate-800 flex items-center gap-2">{vitals.hr} <Heart size={20} className="text-red-500"/></p>
        </div>
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100">
           <p className="text-slate-500 text-[13px] font-bold mb-1">แบตเตอรี่นาฬิกา</p>
           <p className="text-[28px] font-black text-slate-800 flex items-center gap-2">{vitals.battery}% <Battery size={20} className="text-green-500"/></p>
        </div>
      </div>
    </div>
  );
};

const FamilyMap = ({ vitals }) => (
  <div className="h-full flex flex-col">
    <h3 className="font-extrabold text-slate-800 text-[22px] mb-4">พิกัดปัจจุบัน</h3>
    <div className="flex-1 bg-slate-200 rounded-[28px] relative overflow-hidden border border-slate-300 shadow-inner">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="text-white text-xs font-bold px-3 py-1.5 rounded-full mb-1 shadow-lg" style={{ backgroundColor: THEME.primary }}>คุณตาปิยชาญ</div>
        <MapPin size={48} className="drop-shadow-xl text-red-500" fill="#ef4444" />
        <div className="w-6 h-2 bg-black/30 rounded-[100%] mt-1 blur-[3px]"></div>
      </div>
    </div>
    <div className="mt-4 bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md" style={{ backgroundColor: THEME.primary }}><Home size={24} /></div>
      <div><p className="text-sm text-slate-500 font-bold">ที่อยู่ล่าสุด (GPS)</p><p className="font-extrabold text-slate-800 text-lg">{vitals.location}</p></div>
    </div>
  </div>
);

const FamilyService = ({ patientData, globalChat, sendGlobalMessage }) => {
  const [modalState, setModalState] = useState(null);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const handleSendChat = () => {
    if(!input.trim()) return;
    sendGlobalMessage('family', input);
    setInput('');
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <h3 className="font-extrabold text-slate-800 text-[22px] mb-2">บริการ & ข้อมูล</h3>
      
      <button onClick={() => alert('จำลองการโทร 1669 หรือ ศูนย์ส่วนกลาง')} className="p-5 rounded-[28px] shadow-md border border-red-100 flex items-center gap-4 text-left active:scale-95 transition-transform bg-white">
        <div className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"><Phone size={28} /></div>
        <div className="flex-1"><h4 className="font-extrabold text-red-600 text-[18px]">ติดต่อฉุกเฉินทันที</h4><p className="text-slate-500 text-sm font-medium">โทรด่วนศูนย์สั่งการ myHealthCare</p></div>
      </button>

      <div className="grid grid-cols-2 gap-3 mt-1">
        <button onClick={() => setModalState('chat')} className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center gap-3 active:scale-95 transition-transform hover:bg-slate-50">
          <MessageSquare size={32} style={{ color: THEME.primary }} />
          <span className="font-bold text-slate-700 text-[15px]">แชทส่วนกลาง</span>
        </button>
        <button onClick={() => setModalState('pay')} className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center gap-3 active:scale-95 transition-transform hover:bg-slate-50">
          <CreditCard size={32} style={{ color: THEME.primary }} />
          <span className="font-bold text-slate-700 text-[15px]">ชำระค่าบริการ</span>
        </button>
      </div>

      <button onClick={() => setModalState('will')} className="bg-white p-5 rounded-[28px] shadow-sm border border-slate-100 flex items-center justify-between text-left mt-2 active:scale-95 transition-transform hover:bg-slate-50">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl" style={{ backgroundColor: THEME.secondary, color: THEME.primary }}><FileText size={28} /></div>
          <div><h4 className="font-extrabold text-slate-800 text-[18px]">Digital Will</h4><p className="text-slate-500 text-[13px] font-bold">ข้อมูลสุขภาพล่วงหน้า</p></div>
        </div>
        <ChevronRight size={20} className="text-slate-400" />
      </button>

      <SimpleModal isOpen={modalState === 'pay'} onClose={() => setModalState(null)} title="ชำระค่าบริการ (รายเดือน)">
        <div className="text-center pt-4">
          <p className="text-[36px] font-black text-slate-800 mb-6">1,250 <span className="text-xl">THB</span></p>
          <button onClick={() => { alert('ชำระเงินสำเร็จ!'); setModalState(null); }} className="w-full text-white font-bold py-4 rounded-2xl active:scale-95 flex items-center justify-center gap-2 text-lg shadow-md" style={{ backgroundColor: THEME.primary }}><CheckCircle size={20}/> ยืนยันชำระเงิน</button>
        </div>
      </SimpleModal>

      <SimpleModal isOpen={modalState === 'chat'} onClose={() => setModalState(null)} title="แชทกับศูนย์บริการส่วนกลาง">
         <div className="h-64 bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 overflow-y-auto flex flex-col gap-3">
           {globalChat.map((m, i) => (
             m.sender === 'family' ?
               <div key={i} className="self-end text-white p-3 rounded-2xl rounded-tr-none max-w-[80%] text-[15px] font-medium shadow-sm" style={{ backgroundColor: THEME.primary }}>{m.text}</div>
             :
               <div key={i} className="self-start bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-[15px] font-medium text-slate-700 shadow-sm">{m.text}</div>
           ))}
           <div ref={chatEndRef}/>
         </div>
         <div className="flex gap-2">
           <input type="text" value={input} onChange={(e)=>setInput(e.target.value)} onKeyPress={(e)=>e.key==='Enter' && handleSendChat()} placeholder="พิมพ์ข้อความ..." className="flex-1 border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-[15px] font-medium outline-none" />
           <button onClick={handleSendChat} className="text-white px-4 rounded-xl shadow-md active:scale-95" style={{ backgroundColor: THEME.primary }}><Send size={20}/></button>
         </div>
      </SimpleModal>

      <SimpleModal isOpen={modalState === 'will'} onClose={() => setModalState(null)} title="ข้อมูล Digital Will">
         <div className="space-y-4 text-sm mt-2">
           <div><label className="text-[13px] text-slate-500 font-bold uppercase tracking-wider">โรคประจำตัว</label><input type="text" defaultValue={patientData.diseases} className="w-full border border-slate-200 rounded-xl p-3 mt-1 text-slate-800 font-bold bg-white" /></div>
           <div><label className="text-[13px] text-slate-500 font-bold uppercase tracking-wider">การแพ้ยา</label><input type="text" defaultValue={patientData.allergies} className="w-full border border-red-200 rounded-xl p-3 mt-1 text-red-600 font-bold bg-red-50" /></div>
           <div><label className="text-[13px] text-slate-500 font-bold uppercase tracking-wider">ประกันสุขภาพ</label><input type="text" defaultValue={patientData.insurance} className="w-full border border-slate-200 rounded-xl p-3 mt-1 text-slate-800 font-bold bg-white" /></div>
           <div><label className="text-[13px] text-slate-500 font-bold uppercase tracking-wider">ความประสงค์กรณีวิกฤต (Living Will)</label><textarea defaultValue={patientData.livingWill} className="w-full border border-slate-200 rounded-xl p-3 mt-1 h-24 text-slate-800 font-bold bg-white resize-none" /></div>
           <button onClick={() => { alert('บันทึกและซิงค์เข้าระบบส่วนกลางสำเร็จ'); setModalState(null); }} className="w-full text-white font-bold py-4 rounded-2xl mt-4 text-[16px] shadow-md active:scale-95" style={{ backgroundColor: THEME.primary }}>อัปเดตข้อมูล (Sync to API)</button>
         </div>
      </SimpleModal>
    </div>
  );
};

const FamilySettings = ({ elderSettings, setElderSettings }) => {
  const [toggles, setToggles] = useState({ hrAlert: true, locationAlert: false, weeklyReport: true });
  
  const ToggleBtn = ({ id, label, active, onClick }) => (
    <div className="p-5 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors border-b border-slate-100 last:border-0" onClick={onClick}>
      <span className="font-extrabold text-slate-700 text-[15px]">{label}</span>
      <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 shadow-inner ${active ? 'bg-[#00564E]' : 'bg-slate-200'}`}>
        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${active ? 'left-7' : 'left-1'}`}></div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h3 className="font-extrabold text-slate-800 text-[18px] mb-3">การตั้งค่าแจ้งเตือน (ในมือถือญาติ)</h3>
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
          <ToggleBtn id="hrAlert" label="แจ้งเตือนอัตราการเต้นหัวใจผิดปกติ" active={toggles.hrAlert} onClick={() => setToggles(p => ({...p, hrAlert: !p.hrAlert}))} />
          <ToggleBtn id="locationAlert" label="แจ้งเตือนออกนอกพื้นที่ (Geofencing)" active={toggles.locationAlert} onClick={() => setToggles(p => ({...p, locationAlert: !p.locationAlert}))} />
          <ToggleBtn id="weeklyReport" label="รับสรุปรายงานสุขภาพรายสัปดาห์ AI" active={toggles.weeklyReport} onClick={() => setToggles(p => ({...p, weeklyReport: !p.weeklyReport}))} />
        </div>
      </div>

      <div>
        <h3 className="font-extrabold text-slate-800 text-[18px] mb-3 flex items-center gap-2"><Sliders size={18} style={{ color: THEME.primary }}/> ควบคุมอุปกรณ์ผู้สูงอายุ (Remote Config)</h3>
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden p-5">
           <p className="text-sm text-slate-500 mb-4 font-bold">ปรับเปลี่ยนหน้าจอของ Elder App ทันที</p>
           
           <div className="flex justify-between items-center mb-4">
             <span className="font-bold text-slate-700 text-[15px]">ขนาดตัวอักษรหน้าจอ</span>
             <div className="flex bg-slate-100 rounded-lg p-1">
                <button 
                  onClick={() => setElderSettings(p => ({...p, fontSize: 'normal'}))}
                  className={`px-3 py-1.5 rounded-md text-sm font-bold ${elderSettings.fontSize === 'normal' ? 'bg-white shadow-sm text-[#00564E]' : 'text-slate-500'}`}
                >ปกติ</button>
                <button 
                  onClick={() => setElderSettings(p => ({...p, fontSize: 'large'}))}
                  className={`px-3 py-1.5 rounded-md text-sm font-bold ${elderSettings.fontSize === 'large' ? 'bg-white shadow-sm text-[#00564E]' : 'text-slate-500'}`}
                >ใหญ่</button>
             </div>
           </div>

           <div className="flex justify-between items-center border-t border-slate-100 pt-4">
             <span className="font-bold text-slate-700 text-[15px]">ระดับเสียงเตือน SOS</span>
             <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">ล็อกไว้ที่ดังสุด</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const NavBtnBase = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-20 h-[72px] rounded-2xl transition-all active:scale-95 ${active ? 'text-[#00564E] bg-[#b8d8d8]/30 shadow-inner' : 'text-slate-400 bg-transparent hover:bg-slate-50'}`}>
    <div className={`mb-1 ${active ? 'scale-110' : ''} transition-transform`}>{React.cloneElement(icon, { size: active ? 28 : 24, strokeWidth: active ? 2.5 : 2 })}</div>
    <span className="text-[12px] font-extrabold">{label}</span>
  </button>
);


// ==========================================
// 4. Admin Dashboard (Command Center)
// ==========================================
const AdminDashboard = ({ status, setStatus, vitals, patientData, globalChat, sendGlobalMessage }) => {
  const [activeMenu, setActiveMenu] = useState('board'); // board, truck, chat
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const stepIndex = ADMIN_STEPS.findIndex(step => step.id === status);
  const isHandedOver = ['hospital_handed_over', 'in_er', 'assessment', 'doctor_assigned', 'treatment', 'resolved', 'post_life_pending', 'post_life_executed'].includes(status);
  const isActive = stepIndex >= 0 || isHandedOver;
  const isPostLifePending = status === 'post_life_pending';

  const handleNextStep = () => {
    if (stepIndex >= 0 && stepIndex < ADMIN_STEPS.length - 1) {
      setStatus(ADMIN_STEPS[stepIndex + 1].id);
    }
  };
  const handlePrevStep = () => {
    if (stepIndex > 0) setStatus(ADMIN_STEPS[stepIndex - 1].id);
    else if (stepIndex === 0) setStatus(null);
  };

  const handleSendChat = () => {
    if(!input.trim()) return;
    sendGlobalMessage('admin', input);
    setInput('');
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="flex w-full h-full text-left bg-slate-50">
      {isPostLifePending && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl text-center shadow-2xl max-w-lg w-full">
               <AlertCircle size={80} className="text-purple-500 mx-auto mb-6 animate-pulse" />
               <h2 className="text-3xl font-bold text-white mb-2">Hospital Alert: Patient Deceased</h2>
               <p className="text-slate-400 mb-8">โรงพยาบาลส่งสถานะแจ้งการเสียชีวิตของผู้ป่วย ({patientData.name}) กรุณายืนยันเพื่อดำเนินการโอนถ่ายข้อมูลและสินทรัพย์ (Post-Life Protocol)</p>
               <div className="flex gap-4">
                  <button onClick={() => setStatus('resolved')} className="flex-1 py-3 text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold">ยกเลิก / ถอยกลับ</button>
                  <button onClick={() => setStatus('post_life_executed')} className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold">ยืนยัน (Execute Protocol)</button>
               </div>
            </div>
         </div>
      )}

      {/* Sidebar */}
      <div className="w-64 text-white flex flex-col p-4 border-r border-slate-800" style={{ backgroundColor: THEME.primary }}>
        <h2 className="font-black text-xl mb-6 flex items-center gap-2 mt-2"><Server /> Admin Node</h2>
        <nav className="flex flex-col gap-2">
          <button onClick={()=>setActiveMenu('board')} className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-colors ${activeMenu === 'board' ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}><ActivitySquare size={20}/> ระบบจัดการฉุกเฉิน</button>
          <button onClick={()=>setActiveMenu('truck')} className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-colors ${activeMenu === 'truck' ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}><Truck size={20}/> จัดการรถพยาบาล</button>
          <button onClick={()=>setActiveMenu('chat')} className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-colors ${activeMenu === 'chat' ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}><MessageSquare size={20}/> แชทกับญาติลูกบ้าน</button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-100">
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between shadow-sm z-10">
          <h1 className="text-[20px] font-extrabold text-slate-800">ศูนย์สั่งการส่วนกลาง (Central Command)</h1>
          <div className="flex items-center gap-2 text-sm font-bold text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-200">
             <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span> SYSTEM ONLINE
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {activeMenu === 'chat' ? (
             <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
               <h2 className="text-xl font-bold mb-4 border-b pb-2">ห้องแชท (ส่วนกลาง)</h2>
               <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-3">
                 {globalChat.map((m, i) => (
                   m.sender === 'admin' ?
                     <div key={i} className="self-end text-white p-3 rounded-2xl rounded-tr-none max-w-[60%] font-medium" style={{ backgroundColor: THEME.primary }}>{m.text}</div>
                   :
                     <div key={i} className="self-start bg-slate-100 border border-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[60%] font-medium text-slate-800">
                        <p className="text-[11px] font-bold text-slate-400 mb-1">Family App</p>
                        {m.text}
                     </div>
                 ))}
                 <div ref={chatEndRef}/>
               </div>
               <div className="flex gap-2">
                 <input type="text" value={input} onChange={(e)=>setInput(e.target.value)} onKeyPress={(e)=>e.key==='Enter' && handleSendChat()} className="flex-1 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#00564E]/50" placeholder="พิมพ์ตอบกลับญาติ..." />
                 <button onClick={handleSendChat} className="text-white px-6 rounded-xl font-bold transition-transform active:scale-95" style={{ backgroundColor: THEME.primary }}>ส่ง (Send)</button>
               </div>
             </div>
          ) : activeMenu === 'truck' ? (
             // AMBULANCE FLEET MANAGEMENT VIEW
             <div className="flex flex-col h-full">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[24px] font-extrabold text-slate-800 flex items-center gap-2"><Truck style={{ color: THEME.primary }}/> Fleet Management (ระบบสั่งการรถพยาบาล)</h2>
               </div>
               
               {!isActive ? (
                 <div className="flex-1 bg-white rounded-[28px] border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                    <Truck size={80} className="mb-4 opacity-20"/>
                    <p className="text-xl font-bold">รถพยาบาลทุกคัน Standby ที่ฐาน</p>
                 </div>
               ) : (
                 <div className="flex gap-6 h-full">
                   <div className="flex-1 bg-white rounded-[28px] border border-slate-200 p-6 flex flex-col">
                      <div className="flex justify-between items-start mb-6 border-b pb-4">
                        <div>
                           <h3 className="text-2xl font-black text-slate-800">AMBULANCE 01 (ALS)</h3>
                           <p className="text-slate-500 font-bold mt-1">คนขับ: สมชาย สายซิ่ง | พยาบาลประจำรถ: พญ.สมฤดี</p>
                        </div>
                        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-200 text-sm font-bold animate-pulse">
                           Dispatched to Case: E-9942
                        </div>
                      </div>

                      {/* Fleet specific Map/Info Mockup */}
                      <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 mb-6 flex items-center justify-center relative overflow-hidden">
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10"></div>
                         <div className="text-center z-10">
                           <Navigation size={48} className="mx-auto mb-2" style={{ color: THEME.primary }}/>
                           <p className="font-bold text-slate-600 text-lg">GPS Tracking (Live)</p>
                           <p className="text-slate-500 text-sm">ระยะทาง: 2.5 กม. | ETA: 8 นาที</p>
                         </div>
                      </div>

                      {/* Ambulance Specific Controls (Syncs with global status) */}
                      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                         <button onClick={handlePrevStep} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-200 rounded-xl transition-colors">ย้อนสถานะ</button>
                         
                         <div className="text-center flex-1">
                           <p className="text-sm font-bold text-slate-500 mb-1">สถานะปัจจุบัน (Syncing with Main Board)</p>
                           <p className="text-lg font-black" style={{ color: THEME.primary }}>
                             {stepIndex >= 0 ? ADMIN_STEPS[stepIndex].label : 'Standby'}
                           </p>
                         </div>

                         {!isHandedOver ? (
                           <button onClick={handleNextStep} className="text-white px-8 py-3 rounded-xl font-black shadow-md flex items-center gap-2 active:scale-95 transition-transform" style={{ backgroundColor: THEME.primary }}>
                             {stepIndex < ADMIN_STEPS.length - 1 ? `ถัดไป: ${ADMIN_STEPS[stepIndex + 1].label}` : 'ส่งมอบให้ รพ.'} <ChevronRight size={20} />
                           </button>
                         ) : (
                           <span className="text-green-600 font-bold px-8 py-3">ส่งมอบ รพ. แล้ว กลับฐาน</span>
                         )}
                      </div>
                   </div>
                 </div>
               )}
             </div>
          ) : !isActive ? (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
               <Server size={80} className="mb-4 opacity-20" />
               <h2 className="text-[28px] font-extrabold text-slate-500">Standby Mode</h2>
               <p className="font-medium text-lg mt-2">รอรับแจ้งเหตุฉุกเฉินจากอุปกรณ์ผู้สูงอายุ</p>
             </div>
          ) : (
            <div className="flex gap-6 h-full">
              {/* Left Col: Workflow */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="bg-red-50 border-l-8 border-red-500 p-6 rounded-2xl shadow-sm">
                  <h2 className="text-red-700 font-black text-[26px] flex items-center gap-2 mb-1"><AlertCircle className="animate-pulse" /> E-9942: สัญญาณฉุกเฉิน (SOS/ล้ม)</h2>
                  <p className="text-red-600 font-bold text-lg">ผู้ป่วย: {patientData.name}</p>
                </div>

                <div className="bg-white p-8 rounded-[28px] shadow-sm border border-slate-200 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-800 mb-8 border-b pb-4 text-xl flex justify-between items-center">
                       กระดานควบคุมสถานะ (Workflow)
                       {isHandedOver && <span className="text-sm font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">ส่งมอบโรงพยาบาลสำเร็จแล้ว</span>}
                    </h3>
                    
                    {/* Main Admin Stepper */}
                    <div className="flex justify-between relative px-2 mb-10">
                      <div className="absolute top-6 left-12 right-12 h-1.5 bg-slate-100 z-0"></div>
                      <div className="absolute top-6 left-12 h-1.5 z-0 transition-all duration-500" style={{ width: `${Math.min((stepIndex / (ADMIN_STEPS.length - 1)) * 100, 100)}%`, maxWidth: 'calc(100% - 96px)', backgroundColor: THEME.primary }}></div>
                      
                      {ADMIN_STEPS.map((step, idx) => {
                        const isActiveStep = idx === stepIndex || (isHandedOver && idx === ADMIN_STEPS.length - 1);
                        const isPastStep = idx < stepIndex || isHandedOver;
                        return (
                          <div key={step.id} className="relative z-10 flex flex-col items-center gap-3 w-28 text-center">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md transition-colors ${isActiveStep ? 'ring-4 ring-[#b8d8d8]' : isPastStep ? 'opacity-90' : 'bg-slate-200 text-slate-400 shadow-none'}`} style={isActiveStep || isPastStep ? { backgroundColor: THEME.primary } : {}}>
                               {isPastStep && !isActiveStep ? <Check size={24}/> : step.icon}
                            </div>
                            <span className={`text-[13px] font-extrabold ${isActiveStep ? '' : isPastStep ? 'text-[#00564E]' : 'text-slate-400'}`} style={isActiveStep ? { color: THEME.primary } : {}}>{step.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Sub-status (Hospital tracking) */}
                    {isHandedOver && (
                       <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                          <h4 className="font-bold text-slate-600 mb-4 text-sm uppercase tracking-widest flex items-center gap-2"><Activity size={16}/> สถานะการรักษา (Live Tracking)</h4>
                          <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                             {HOSPITAL_STEPS.map(hs => {
                               const hsActive = status === hs.id;
                               return (
                                 <span key={hs.id} className={hsActive ? "text-blue-600 bg-blue-50 px-2 py-1 rounded" : ""}>
                                   {hsActive ? `▶ ${hs.label}` : hs.label}
                                 </span>
                               );
                             })}
                          </div>
                       </div>
                    )}
                  </div>

                  {/* Actions */}
                  {!isHandedOver && (
                    <div className="flex justify-between border-t pt-6 mt-6">
                      <button onClick={handlePrevStep} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">ย้อนกลับสเตป (Undo)</button>
                      <button onClick={handleNextStep} className="text-white px-10 py-4 rounded-2xl font-black shadow-lg flex items-center gap-2 text-[18px] active:scale-95 transition-transform" style={{ backgroundColor: THEME.primary }}>
                        {stepIndex < ADMIN_STEPS.length - 1 ? `ดำเนินการต่อไป: ${ADMIN_STEPS[stepIndex + 1].label}` : 'ยืนยันการส่งมอบ'}
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Col: Tracking & Data */}
              <div className="w-[420px] flex flex-col gap-5">
                <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700">
                  <h3 className="font-extrabold text-slate-300 mb-4 flex items-center gap-2 text-lg"><MapPin className="text-red-400"/> พิกัด & ชีพจรสด (Live Data)</h3>
                  <div className="bg-black/60 p-4 rounded-xl mb-4 border border-white/10">
                    <p className="text-green-400 font-mono text-[15px] mb-1 font-bold">{vitals.location}</p>
                    <p className="text-slate-400 font-mono text-xs">GPS: 13.7563, 100.5018</p>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                     <span className="text-slate-300 font-bold">Heart Rate</span>
                     <span className="text-4xl font-black text-red-400 flex items-center gap-1">{vitals.hr} <span className="text-sm font-normal text-slate-400">bpm</span></span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-extrabold mb-4 flex items-center gap-2 text-lg" style={{ color: THEME.primary }}><Users/> ข้อมูลส่งต่อ (Digital Will API)</h3>
                  <div className="text-[15px] text-slate-700 space-y-3 font-medium">
                     <p><span className="text-slate-400 block text-xs font-bold uppercase mb-0.5">ชื่อ-นามสกุล</span> {patientData.name}</p>
                     <p><span className="text-slate-400 block text-xs font-bold uppercase mb-0.5">โรคประจำตัว</span> {patientData.diseases}</p>
                     <p className="bg-red-50 text-red-700 p-2 rounded-lg border border-red-100 font-bold"><span className="text-red-400 block text-xs uppercase mb-0.5">แพ้ยา (Allergies)</span> {patientData.allergies}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 5. Hospital Dashboard (Medical Node)
// ==========================================
const HospitalDashboard = ({ status, setStatus, vitals, patientData }) => {
  const [activeMenu, setActiveMenu] = useState('er'); // er, his

  const stepIndex = HOSPITAL_STEPS.findIndex(step => step.id === status);
  const isActive = stepIndex >= 0;
  const isPending = ['sos_triggered', 'admin_acknowledged', 'ambulance_dispatched', 'on_scene', 'in_transit'].includes(status);
  const isPostLife = ['post_life_pending', 'post_life_executed'].includes(status);

  const handleNextStep = () => {
    if (stepIndex >= 0 && stepIndex < HOSPITAL_STEPS.length - 1) setStatus(HOSPITAL_STEPS[stepIndex + 1].id);
  };
  const handlePrevStep = () => {
    if (stepIndex > 0) setStatus(HOSPITAL_STEPS[stepIndex - 1].id);
    else if (stepIndex === 0) setStatus('in_transit'); 
  };

  const MOCK_HIS_PATIENTS = [
    { id: 'HN-9421', name: patientData.name, age: 75, bed: 'ER-1', status: 'EMERGENCY', dx: 'Fall / High BP' },
    { id: 'HN-1024', name: 'นายสมชาย ใจดี', age: 62, bed: 'Ward 4', status: 'ADMIT', dx: 'Post-op' },
    { id: 'HN-8832', name: 'นางวันดี ศรีสุข', age: 80, bed: 'ICU-2', status: 'CRITICAL', dx: 'Sepsis' },
    { id: 'HN-4411', name: 'น.ส.มาลี รักษ์โลก', age: 45, bed: 'OPD', status: 'WAITING', dx: 'Fever' },
    { id: 'HN-9902', name: 'นายวิทยา รักษาดี', age: 55, bed: 'ER-2', status: 'OBSERVATION', dx: 'Chest Pain' },
    { id: 'HN-5510', name: 'นางนภา สดใส', age: 71, bed: 'Ward 3', status: 'DISCHARGE', dx: 'Recovered' }
  ];

  return (
    <div className="flex w-full h-full text-left bg-slate-50">
      <div className="w-64 bg-slate-100 flex flex-col p-4 border-r border-slate-200">
        <h2 className="font-black text-2xl mb-8 flex items-center gap-2 mt-2" style={{ color: THEME.primary }}><Cross className="text-red-600" fill="currentColor"/> HIS Node</h2>
        <nav className="flex flex-col gap-2">
          <button onClick={()=>setActiveMenu('er')} className={`flex items-center gap-3 p-3 font-bold rounded-xl transition-all ${activeMenu === 'er' ? 'bg-white shadow-sm text-[#00564E]' : 'text-slate-500 hover:bg-slate-200'}`}><ActivitySquare size={20}/> ER Monitor</button>
          <button onClick={()=>setActiveMenu('his')} className={`flex items-center gap-3 p-3 font-bold rounded-xl transition-all ${activeMenu === 'his' ? 'bg-white shadow-sm text-[#00564E]' : 'text-slate-500 hover:bg-slate-200'}`}><Users size={20}/> ทะเบียนผู้ป่วย (HIS)</button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden bg-white">
        <div className="h-16 border-b border-slate-200 flex items-center px-6 justify-between shadow-sm z-10 bg-white">
          <h1 className="text-[20px] font-extrabold text-slate-800">ระบบสั่งการโรงพยาบาล (Hospital ER API)</h1>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-full border">
             Connected to Central Dispatch
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
          {activeMenu === 'his' ? (
             <div className="h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
               <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                 <h2 className="font-bold text-lg text-slate-800">รายชื่อผู้ป่วย (Hospital Information System)</h2>
                 <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-1.5"><Search size={16} className="text-slate-400"/><input type="text" placeholder="ค้นหา HN..." className="outline-none text-sm w-32"/></div>
               </div>
               <table className="w-full text-left border-collapse">
                 <thead><tr className="bg-slate-100 text-slate-500 text-xs uppercase tracking-wider"><th className="p-4 font-bold">HN</th><th className="p-4 font-bold">ชื่อ-นามสกุล</th><th className="p-4 font-bold">อายุ</th><th className="p-4 font-bold">เตียง</th><th className="p-4 font-bold">Diagnosis</th><th className="p-4 font-bold">สถานะ</th></tr></thead>
                 <tbody>
                   {MOCK_HIS_PATIENTS.map((p, i) => (
                     <tr key={i} className={`border-b border-slate-100 ${p.status === 'EMERGENCY' ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
                       <td className="p-4 font-mono font-bold text-sm">{p.id}</td>
                       <td className="p-4 font-bold text-slate-800">{p.name}</td>
                       <td className="p-4 text-slate-600">{p.age}</td>
                       <td className="p-4 text-slate-600 font-medium">{p.bed}</td>
                       <td className="p-4 text-slate-600">{p.dx}</td>
                       <td className="p-4"><span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${p.status === 'EMERGENCY' ? 'bg-red-600 text-white' : p.status === 'CRITICAL' ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'}`}>{p.status}</span></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          ) : (!isActive && !isPending && !isPostLife) ? (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
               <Stethoscope size={80} className="mb-4 opacity-20" />
               <h2 className="text-[28px] font-extrabold text-slate-500">ER STANDBY</h2>
             </div>
          ) : isPending ? (
             <div className="flex flex-col items-center justify-center h-full bg-yellow-50/50 rounded-3xl border-2 border-yellow-300 border-dashed">
               <AlertCircle size={80} className="mb-6 text-yellow-500 animate-pulse" />
               <h2 className="text-[36px] font-black text-yellow-700 mb-2">เตรียมรับผู้ป่วยฉุกเฉิน (Inbound)</h2>
               <p className="text-xl text-yellow-800 font-bold">รถพยาบาลกำลังเดินทางมา โปรดเตรียมทีม ER</p>
             </div>
          ) : isPostLife ? (
             <div className="flex flex-col items-center justify-center h-full text-purple-800 bg-purple-50 rounded-3xl border border-purple-200">
               <ShieldAlert size={80} className="mb-4 text-purple-600" />
               <h2 className="text-3xl font-black mb-2">เคสถูกส่งเข้าสู่กระบวนการ Post-Life แล้ว</h2>
               <p className="font-bold">รอการยืนยันและการจัดการสินทรัพย์จากส่วนกลาง</p>
             </div>
          ) : (
            <div className="flex gap-6 h-full">
              {/* Left Col: Medical Workflow */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="bg-red-600 text-white p-6 rounded-2xl shadow-md flex justify-between items-center">
                  <div>
                    <h2 className="font-black text-[26px] flex items-center gap-2 mb-1">🔥 ER CODE RED: ผู้ป่วยถึง รพ.</h2>
                    <p className="font-bold text-red-100 text-lg">HN: New | ผู้ป่วย: {patientData.name}</p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[28px] shadow-sm border border-slate-200 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold mb-8 border-b pb-4 text-xl" style={{ color: THEME.primary }}>ขั้นตอนทางการแพทย์ (Medical Workflow)</h3>
                    
                    {/* Stepper */}
                    <div className="flex justify-between relative px-2 mb-10">
                      <div className="absolute top-6 left-12 right-12 h-1.5 bg-slate-100 z-0"></div>
                      <div className="absolute top-6 left-12 h-1.5 bg-red-500 z-0 transition-all duration-500" style={{ width: `${(stepIndex / (HOSPITAL_STEPS.length - 1)) * 100}%`, maxWidth: 'calc(100% - 96px)' }}></div>
                      
                      {HOSPITAL_STEPS.map((step, idx) => {
                        const isActiveStep = idx === stepIndex;
                        const isPastStep = idx < stepIndex;
                        return (
                          <div key={step.id} className="relative z-10 flex flex-col items-center gap-3 w-28 text-center">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md transition-colors ${isActiveStep ? 'bg-red-600 ring-4 ring-red-100' : isPastStep ? 'bg-green-500' : 'bg-slate-200 text-slate-400 shadow-none'}`}>{isPastStep ? <Check size={24}/> : step.icon}</div>
                            <span className={`text-[13px] font-extrabold ${isActiveStep ? 'text-red-600' : isPastStep ? 'text-green-600' : 'text-slate-400'}`}>{step.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between border-t pt-6 mt-6">
                    <button onClick={handlePrevStep} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl">ย้อนกลับสเตป</button>
                    {stepIndex < HOSPITAL_STEPS.length - 1 ? (
                      <button onClick={handleNextStep} className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-black shadow-lg flex items-center gap-2 text-[18px] active:scale-95">
                        ดำเนินการขั้นต่อไป: {HOSPITAL_STEPS[stepIndex + 1].label} <ChevronRight size={24} />
                      </button>
                    ) : (
                      <button onClick={() => setStatus('post_life_pending')} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg flex items-center gap-2 text-[18px] active:scale-95">
                        แจ้งเสียชีวิต (Trigger Post-Life Protocol) <Lock size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Col: Medical Records (Digital Will Integration) */}
              <div className="w-[450px] flex flex-col gap-5">
                <div className="bg-black text-green-400 p-6 rounded-2xl shadow-xl border-2 border-slate-800 font-mono">
                  <h3 className="text-white mb-3 flex items-center gap-2 font-bold"><Activity size={18}/> ER VITAL MONITOR</h3>
                  <div className="grid grid-cols-2 gap-4 bg-slate-900 p-5 rounded-xl border border-slate-700">
                    <div><p className="text-slate-500 text-[11px] font-bold">HR (bpm)</p><p className="text-5xl font-black text-green-500 mt-1">{vitals.hr}</p></div>
                    <div><p className="text-slate-500 text-[11px] font-bold">BP (mmHg)</p><p className="text-3xl font-black text-blue-400 mt-2">{vitals.bloodPressure}</p></div>
                  </div>
                </div>

                <div className="bg-red-50 p-6 rounded-2xl border border-red-200 shadow-sm flex-1">
                  <h3 className="font-black text-red-800 mb-5 flex items-center gap-2 text-[20px]"><FileText size={22}/> Digital Will API</h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border-l-8 border-red-600 shadow-sm">
                      <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mb-1">การแพ้ยา (Allergies) !!!</p>
                      <p className="font-black text-red-600 text-xl">{patientData.allergies}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-l-8 border-orange-500 shadow-sm">
                      <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mb-1">โรคประจำตัว (Diseases)</p>
                      <p className="font-bold text-slate-800 text-[15px]">{patientData.diseases}</p>
                    </div>
                    <div className="bg-slate-800 p-5 rounded-xl border-l-8 border-purple-500 shadow-sm text-white">
                      <p className="text-purple-300 text-[11px] font-black uppercase tracking-widest mb-2 flex items-center gap-1"><ShieldAlert size={14}/> พินัยกรรมชีวิต (Living Will)</p>
                      <p className="font-bold text-lg leading-snug">{patientData.livingWill}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};