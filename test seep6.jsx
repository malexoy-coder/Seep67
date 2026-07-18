import { useState, useRef, useEffect } from "react";

const DIALECTS = {
  central: { name: "ภาษากลาง", greeting: "สวัสดีจ้า! ครูพร้อมสอนหนูแล้วนะ อยากเรียนเรื่องอะไรดีจ๊ะ 😊", encourage: "เก่งมากเลยจ้า!", ask: "ลองตอบดูนะจ๊ะ" },
  isan: { name: "ภาษาอีสาน", greeting: "สบายดีบ่จ้า! ครูพร้อมสอนหนูแล้วเด้อ อยากเฮียนเรื่องหยังดีน้อ 😊", encourage: "เก่งหลายเด้อลูก!", ask: "ลองตอบเบิ่งเด้อ" },
  north: { name: "ภาษาเหนือ", greeting: "สวัสดีเจ้า! ครูพร้อมสอนหนูแล้วเน่อ อยากเฮียนเรื่องอะหยังดีเจ้า 😊", encourage: "เก่งขนาดเลยเจ้า!", ask: "ลองตอบผ่อเน่อ" },
  south: { name: "ภาษาใต้", greeting: "หวัดดีหนิ! ครูพร้อมสอนหนูแล้วนิ อยากเรียนเรื่องไหรดีหนิ 😊", encourage: "เก่งจังหู้!", ask: "ลองตอบดูตะ" },
};

const LESSONS = [
  { id: 1, subject: "การอ่าน", icon: "📖", title: "อ่านจับใจความ ระดับ 1", desc: "ฝึกอ่านนิทานสั้นและตอบคำถาม", progress: 80, color: "bg-orange-500", light: "bg-orange-100", text: "text-orange-600" },
  { id: 2, subject: "การอ่าน", icon: "📝", title: "คำศัพท์ในชีวิตประจำวัน", desc: "เรียนรู้คำศัพท์จากสิ่งรอบตัว", progress: 45, color: "bg-orange-500", light: "bg-orange-100", text: "text-orange-600" },
  { id: 3, subject: "คณิตศาสตร์", icon: "🔢", title: "บวกลบเลขไม่เกิน 100", desc: "ฝึกบวกลบผ่านโจทย์สถานการณ์จริง", progress: 60, color: "bg-blue-500", light: "bg-blue-100", text: "text-blue-600" },
  { id: 4, subject: "คณิตศาสตร์", icon: "🍎", title: "โจทย์ปัญหาในตลาด", desc: "คณิตศาสตร์จากการซื้อขายของ", progress: 20, color: "bg-blue-500", light: "bg-blue-100", text: "text-blue-600" },
];

const MATH_QUESTIONS = [
  { q: "แม่ให้เงินไปโรงเรียน 20 บาท ซื้อขนม 8 บาท เหลือเงินกี่บาทจ๊ะ?", a: "12" },
  { q: "มีมะม่วง 15 ลูก แบ่งให้เพื่อน 6 ลูก เหลือมะม่วงกี่ลูก?", a: "9" },
  { q: "7 + 8 เท่ากับเท่าไหร่จ๊ะ?", a: "15" },
];

function botReply(text, dialect, state) {
  const d = DIALECTS[dialect];
  const t = text.toLowerCase();

  if (state.waitingAnswer) {
    if (t.includes(state.waitingAnswer)) {
      return { text: `ถูกต้อง! ${d.encourage} 🎉 คำตอบคือ ${state.waitingAnswer} นั่นเอง อยากลองข้อต่อไปไหมจ๊ะ (พิมพ์ "คณิต" ได้เลย)`, waitingAnswer: null };
    }
    return { text: `ยังไม่ถูกนะจ๊ะ ไม่เป็นไร ลองคิดใหม่อีกครั้ง ${d.ask} 💪 (ใบ้ให้: ลองนับทีละขั้นดูนะ)`, waitingAnswer: state.waitingAnswer };
  }
  if (t.includes("คณิต") || t.includes("เลข") || t.includes("บวก")) {
    const q = MATH_QUESTIONS[Math.floor(Math.random() * MATH_QUESTIONS.length)];
    return { text: `ได้เลยจ้า! มาลองโจทย์นี้กัน 🔢\n\n"${q.q}"\n\n${d.ask}`, waitingAnswer: q.a };
  }
  if (t.includes("อ่าน") || t.includes("นิทาน")) {
    return { text: `มาฝึกอ่านกันจ้า 📖\n\n"กระต่ายน้อยวิ่งเล่นในทุ่งนา มันเจอเต่าตัวหนึ่งเดินช้า ๆ กระต่ายชวนเต่าวิ่งแข่ง"\n\nคำถาม: กระต่ายเจอสัตว์อะไรจ๊ะ? ${d.ask}`, waitingAnswer: "เต่า" };
  }
  if (t.includes("สวัสดี") || t.includes("หวัดดี") || t.includes("สบายดี")) {
    return { text: d.greeting, waitingAnswer: null };
  }
  return { text: `ครูช่วยหนูได้ 2 วิชานะจ๊ะ ✨\n\n📖 พิมพ์ "อ่าน" เพื่อฝึกอ่านจับใจความ\n🔢 พิมพ์ "คณิต" เพื่อฝึกโจทย์เลข\n\nอยากเรียนอะไรก่อนดีจ๊ะ?`, waitingAnswer: null };
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [dialect, setDialect] = useState("central");
  const [messages, setMessages] = useState([{ from: "bot", text: DIALECTS.central.greeting }]);
  const [input, setInput] = useState("");
  const [waitingAnswer, setWaitingAnswer] = useState(null);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((m) => [...m, { from: "user", text: userText }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = botReply(userText, dialect, { waitingAnswer });
      setWaitingAnswer(reply.waitingAnswer);
      setMessages((m) => [...m, { from: "bot", text: reply.text }]);
      setTyping(false);
    }, 800);
  };

  const changeDialect = (key) => {
    setDialect(key);
    setMessages((m) => [...m, { from: "bot", text: DIALECTS[key].greeting }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white font-sans flex flex-col">
      {/* Header */}
      <header className="bg-indigo-600 text-white px-6 py-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">🤖</div>
            <div>
              <h1 className="text-xl font-bold">ครู AI ประจำตัว</h1>
              <p className="text-xs text-indigo-200">ผู้ช่วยเรียนรู้ส่วนตัว พัฒนาจากโอเพนซอร์สของคนไทย</p>
            </div>
          </div>
          <span className="text-xs bg-indigo-500 px-3 py-1 rounded-full hidden sm:block">🇹🇭 Prototype</span>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex">
          {[
            { id: "home", label: "🏠 หน้าหลัก" },
            { id: "lessons", label: "📚 บทเรียน" },
            { id: "chat", label: "💬 แชทกับครู AI" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-indigo-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto w-full flex-1 p-4">
        {/* HOME */}
        {tab === "home" && (
          <div className="space-y-4">
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-indigo-200 text-sm">สวัสดี 👋</p>
              <h2 className="text-2xl font-bold mt-1">น้องข้าวหอม ชั้น ป.3</h2>
              <p className="text-sm mt-2 text-indigo-100">วันนี้เรียนต่อจากเมื่อวานกันเถอะ ครูรอหนูอยู่นะ!</p>
              <button onClick={() => setTab("chat")} className="mt-4 bg-white text-indigo-600 font-bold px-5 py-2 rounded-full text-sm hover:bg-indigo-100 transition-colors">
                เริ่มเรียนกับครู AI →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">📖</span>
                  <div>
                    <p className="text-xs text-gray-500">การอ่าน</p>
                    <p className="text-xl font-bold text-orange-600">62%</p>
                  </div>
                </div>
                <div className="mt-3 h-2 bg-orange-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: "62%" }}></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🔢</span>
                  <div>
                    <p className="text-xs text-gray-500">คณิตศาสตร์</p>
                    <p className="text-xl font-bold text-blue-600">40%</p>
                  </div>
                </div>
                <div className="mt-3 h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "40%" }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">🔥 ความต่อเนื่องการเรียน</h3>
              <div className="flex justify-between">
                {["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"].map((day, i) => (
                  <div key={day} className="flex flex-col items-center gap-1">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${i < 5 ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                      {i < 5 ? "✓" : "·"}
                    </div>
                    <span className="text-xs text-gray-500">{day}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-green-600 font-medium mt-3">เรียนต่อเนื่อง 5 วันแล้ว เก่งมาก! 🎉</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
              💡 <b>ครูแนะนำ:</b> คะแนนคณิตศาสตร์ยังต้องฝึกเพิ่ม ลองทำ "โจทย์ปัญหาในตลาด" วันนี้ดูนะจ๊ะ
            </div>
          </div>
        )}

        {/* LESSONS */}
        {tab === "lessons" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm text-sm text-gray-600">
              📌 บทเรียนถูกจัดลำดับให้เหมาะกับหนูโดยเฉพาะ เน้น<b className="text-orange-600">การอ่าน</b>และ<b className="text-blue-600">คณิตศาสตร์</b>เป็นพื้นฐานก่อน
            </div>
            {LESSONS.map((l) => (
              <div key={l.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setTab("chat")}>
                <div className={`w-14 h-14 ${l.light} rounded-xl flex items-center justify-center text-3xl shrink-0`}>{l.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${l.text}`}>{l.subject}</p>
                  <h3 className="font-bold text-gray-800">{l.title}</h3>
                  <p className="text-xs text-gray-500">{l.desc}</p>
                  <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${l.color} rounded-full`} style={{ width: `${l.progress}%` }}></div>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-400">{l.progress}%</span>
              </div>
            ))}
          </div>
        )}

        {/* CHAT */}
        {tab === "chat" && (
          <div className="bg-white rounded-2xl shadow-sm flex flex-col" style={{ height: "70vh" }}>
            <div className="p-3 border-b flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-xl">🤖</div>
                <div>
                  <p className="font-bold text-sm text-gray-800">ครู AI</p>
                  <p className="text-xs text-green-500">● ออนไลน์ (โหมดออฟไลน์ได้)</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 mr-1">ภาษา:</span>
                {Object.entries(DIALECTS).map(([key, d]) => (
                  <button
                    key={key}
                    onClick={() => changeDialect(key)}
                    className={`text-xs px-2 py-1 rounded-full transition-colors ${dialect === key ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-indigo-100"}`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-indigo-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl text-sm whitespace-pre-line shadow-sm ${
                    m.from === "user" ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white text-gray-800 rounded-bl-sm"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-sm text-sm text-gray-400 shadow-sm">ครูกำลังพิมพ์...</div>
                </div>
              )}
              <div ref={bottomRef}></div>
            </div>

            <div className="p-3 border-t">
              <div className="flex gap-2 mb-2 flex-wrap">
                {['อยากฝึกอ่าน 📖', 'อยากฝึกคณิต 🔢', 'สวัสดีครู 👋'].map((s) => (
                  <button key={s} onClick={() => { setInput(s.replace(/ .$/, "")); }} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="พิมพ์ข้อความถึงครู AI..."
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-indigo-400"
                />
                <button onClick={send} className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition-colors">
                  ส่ง
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-gray-400 py-3">
        ครู AI ประจำตัว — Prototype v0.1 | พัฒนาบนโมเดลภาษาไทยโอเพนซอร์ส (OpenThaiGPT / Typhoon)
      </footer>
    </div>
  );
}
