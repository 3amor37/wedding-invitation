import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Heart,
  CalendarDays,
  MapPin,
  Clock3,
  Phone,
  Sparkles,
  ChevronDown,
  Camera,
  Music4,
  Send,
  CheckCircle2,
  PartyPopper,
  ExternalLink,
} from "lucide-react";

const eventDate = new Date("2026-06-26T19:00:00");
const MAP_URL = "https://www.google.com/maps?q=30.0556383,31.3701976&z=17&hl=en";
const WHATSAPP_URL = "https://wa.me/201550570155";
const PHONE = "01550570155";
const VENUE = "قاعة اللؤلؤة";

function getCountdown(targetDate) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

const sectionStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "24px",
};

const cardStyle = {
  background: "rgba(255,255,255,0.78)",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(255,255,255,0.7)",
  borderRadius: "28px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.3)",
  outline: "none",
  fontSize: "15px",
  boxSizing: "border-box",
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function App() {
  const [countdown, setCountdown] = useState(getCountdown(eventDate));
  const [musicOn, setMusicOn] = useState(true);
  const [audioReady, setAudioReady] = useState(false);
  const [showMusicHint, setShowMusicHint] = useState(false);

  const [guestForm, setGuestForm] = useState({
    name: "",
    guests: "",
    attendance: "غالبًا جاي",
  });
  const [guestSaved, setGuestSaved] = useState(false);

  const [form, setForm] = useState({ name: "", message: "" });
  const [messages, setMessages] = useState(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("wedding-messages")
        : null;

    return saved
      ? JSON.parse(saved)
      : [
          {
            name: "سارة",
            message: "ربنا يتمم لكم على خير ويجعل أيامكم كلها فرح وسعادة 🤍",
          },
          {
            name: "أحمد",
            message:
              "ألف مبروك يا عمرو ومريم، ربنا يكتب لكم حياة جميلة كلها حب وراحة.",
          },
        ];
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(eventDate));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wedding-messages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    const launched = sessionStorage.getItem("wedding-confetti");
    if (!launched) {
      const timeout = setTimeout(() => {
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.25 } });
        sessionStorage.setItem("wedding-confetti", "1");
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    const audio = document.getElementById("wedding-audio");
    if (!audio) return;

    audio.volume = 0;

    const tryPlay = async () => {
      try {
        await audio.play();
        setAudioReady(true);
        setMusicOn(true);
        setShowMusicHint(false);

        let volume = 0;
        const fade = setInterval(() => {
          volume += 0.04;
          if (volume >= 0.35) {
            audio.volume = 0.35;
            clearInterval(fade);
            return;
          }
          audio.volume = volume;
        }, 180);
      } catch {
        setShowMusicHint(true);
      }
    };

    tryPlay();

    const unlockAudio = async () => {
      try {
        await audio.play();
        audio.volume = 0.35;
        setAudioReady(true);
        setMusicOn(true);
        setShowMusicHint(false);
      } catch {}
    };

    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  useEffect(() => {
    const audio = document.getElementById("wedding-audio");
    if (!audio) return;

    if (musicOn) {
      audio.play().catch(() => setShowMusicHint(true));
    } else {
      audio.pause();
    }
  }, [musicOn]);

  const addMessage = () => {
    if (!form.name.trim() || !form.message.trim()) return;
    setMessages([{ name: form.name.trim(), message: form.message.trim() }, ...messages]);
    setForm({ name: "", message: "" });
  };

  const saveAttendance = () => {
    if (!guestForm.name.trim()) return;
    setGuestSaved(true);
  };

  const attendanceText = useMemo(() => {
    return `أهلاً، معاكم ${guestForm.name || "ضيف"}%0Aالحضور: ${
      guestForm.attendance
    }%0Aعدد الأفراد: ${
      guestForm.guests || "غير محدد"
    }%0Aبخصوص فرح عمرو ومريم.`;
  }, [guestForm]);

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        color: "#2b2523",
        fontFamily: "Tahoma, Arial, sans-serif",
        background:
          "radial-gradient(circle at top, rgba(255,255,255,0.98), rgba(255,247,250,1), rgba(255,241,236,1))",
      }}
    >
      <style>{`
        *{box-sizing:border-box}
        body{margin:0}
        a{text-decoration:none}
        button{font-family:inherit}
        .grid-two{display:grid;grid-template-columns:1.1fr .9fr;gap:32px}
        .grid-four{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
        .grid-half{display:grid;grid-template-columns:1fr 1fr;gap:24px}
        .grid-rsvp{display:grid;grid-template-columns:.95fr 1.05fr;gap:24px}
        @media(max-width:992px){
          .grid-two,.grid-four,.grid-half,.grid-rsvp{grid-template-columns:1fr}
        }
        .mainBtn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:16px 22px;border-radius:18px;border:none;background:#e85d8e;color:white;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 10px 30px rgba(232,93,142,.28)}
        .ghostBtn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:16px 22px;border-radius:18px;border:1px solid #e7dfe2;background:white;color:#3c2e31;font-size:16px;font-weight:700;cursor:pointer}
      `}</style>

      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <motion.div
          style={{
            position: "absolute",
            top: -80,
            right: 40,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(255,180,198,.35)",
            filter: "blur(60px)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          style={{
            position: "absolute",
            top: "33%",
            left: -70,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(255,221,176,.35)",
            filter: "blur(60px)",
          }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>

      <section style={{ ...sectionStyle, paddingTop: 34, paddingBottom: 12 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          style={{ ...cardStyle, padding: 18 }}
        >
          <div className="grid-two" style={{ alignItems: "center" }}>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 28,
                background: "#f3f0ef",
                boxShadow: "0 18px 40px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src="/couple.jpg"
                alt="عمرو ومريم"
                style={{
                  width: "100%",
                  height: "660px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,.5), rgba(0,0,0,.12), transparent)",
                }}
              />

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  left: 18,
                  top: 18,
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,.3)",
                  background: "rgba(255,255,255,.14)",
                  color: "white",
                  padding: "10px 16px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Camera size={16} /> ذكرى عمر كامل
                </span>
              </motion.div>

              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 24 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  style={{
                    maxWidth: 650,
                    borderRadius: 26,
                    border: "1px solid rgba(255,255,255,.2)",
                    background: "rgba(255,255,255,.12)",
                    color: "white",
                    padding: 22,
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: 13,
                      letterSpacing: 3,
                      color: "rgba(255,255,255,.8)",
                    }}
                  >
                    WEDDING INVITATION
                  </p>
                  <h1 style={{ margin: 0, fontSize: "clamp(38px,6vw,68px)" }}>
                    عمرو × مريم
                  </h1>
                  <p
                    style={{
                      margin: "14px 0 0",
                      fontSize: 18,
                      lineHeight: 1.9,
                      color: "rgba(255,255,255,.92)",
                    }}
                  >
                    بكل الحب والفرحة، مستنيينكم تشاركونا أحلى يوم في حياتنا
                  </p>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.8 }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 999,
                  border: "1px solid #f2c9d8",
                  background: "#fff3f7",
                  color: "#d84f82",
                  padding: "10px 16px",
                  fontSize: 14,
                  boxShadow: "0 6px 18px rgba(0,0,0,.05)",
                }}
              >
                <Sparkles size={16} />
                <span>دعوة فرح خاصة ومميزة</span>
              </div>

              {audioReady ? (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    borderRadius: 999,
                    border: "1px solid #b7e7c8",
                    background: "#effcf3",
                    color: "#18794e",
                    padding: "10px 16px",
                    fontSize: 14,
                    boxShadow: "0 6px 18px rgba(0,0,0,.05)",
                    marginTop: 12,
                  }}
                >
                  <Music4 size={16} />
                  <span>الموسيقى السينمائية شغالة</span>
                </div>
              ) : null}

              <h2
                style={{
                  margin: "18px 0 0",
                  fontSize: "clamp(34px,5vw,58px)",
                  lineHeight: 1.25,
                }}
              >
                يا أهلاً وسهلاً بيكم
                <span style={{ display: "block", marginTop: 8, color: "#e85d8e" }}>
                  في فرح عمرو ومريم
                </span>
              </h2>

              <p
                style={{
                  marginTop: 18,
                  fontSize: 18,
                  lineHeight: 2,
                  color: "#6a5b5e",
                }}
              >
                يومنا هيبقى أحلى بوجودكم، وفرحتنا هتكمل لما تكونوا معانا وسط
                الضحكة واللمة والدعوات الحلوة.
              </p>

              <div
                style={{
                  marginTop: 24,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <CountCard label="يوم" value={countdown.days} />
                <CountCard label="ساعة" value={countdown.hours} />
                <CountCard label="دقيقة" value={countdown.minutes} />
                <CountCard label="ثانية" value={countdown.seconds} />
              </div>

              <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 12 }}>
                <a className="mainBtn" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                  تواصل واتساب
                </a>
                <a className="ghostBtn" href={MAP_URL} target="_blank" rel="noreferrer">
                  افتح اللوكيشن
                </a>
                <button className="ghostBtn" onClick={() => setMusicOn((v) => !v)}>
                  <Music4 size={16} /> {musicOn ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
                </button>
              </div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  marginTop: 28,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#85797b",
                  fontSize: 14,
                }}
              >
                <span>انزل شوف التفاصيل</span>
                <ChevronDown size={16} />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <audio id="wedding-audio" loop preload="auto">
          <source src="/music.mp3" type="audio/mpeg" />
        </audio>

        {showMusicHint ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: "fixed",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 50,
              width: "92%",
              maxWidth: 420,
              borderRadius: 22,
              border: "1px solid rgba(255,255,255,.7)",
              background: "rgba(255,255,255,.88)",
              padding: 16,
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,.12)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.9, color: "#4a3d40" }}>
              علشان الموسيقى تبدأ، دوس أي مكان في الصفحة مرة واحدة 🎵
            </p>
          </motion.div>
        ) : null}
      </section>

      <section style={{ ...sectionStyle, paddingTop: 12, paddingBottom: 12 }}>
        <div className="grid-four">
          <InfoCard icon={<CalendarDays size={22} />} title="التاريخ" value="الجمعة 26 / 6 / 2026" />
          <InfoCard icon={<Clock3 size={22} />} title="الساعة" value="7:00 مساءً" />
          <InfoCard icon={<MapPin size={22} />} title="المكان" value={VENUE} />
          <InfoCard icon={<Phone size={22} />} title="رقم التواصل" value={PHONE} />
        </div>
      </section>

      <section style={{ ...sectionStyle, paddingTop: 18, paddingBottom: 18 }}>
        <div className="grid-half">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            style={{ ...cardStyle, padding: 30 }}
          >
            <p style={{ margin: 0, fontSize: 13, letterSpacing: 3, color: "#e85d8e" }}>
              تفاصيل اليوم
            </p>
            <h3 style={{ margin: "14px 0 0", fontSize: 38 }}>مستنيينكم وسطنا</h3>
            <p style={{ marginTop: 18, color: "#6a5b5e", lineHeight: 2 }}>
              الدعوة دي معمولالكم من القلب، ونفسنا تشاركونا فرحتنا في يوم مميز جدًا
              بالنسبة لينا. وجودكم هيضيف لليوم بهجة كبيرة وذكريات حلوة عمرها ما تتنسي.
            </p>
            <div style={{ display: "grid", gap: 14, marginTop: 22 }}>
              <MiniStrip bg="#fff2f7" text="استقبال الضيوف: من الساعة 6:30 مساءً" />
              <MiniStrip bg="#fff7e9" text="بداية الفرح: الساعة 7:00 مساءً" />
              <MiniStrip bg="#f6f5f5" text={`العنوان: ${VENUE}`} />
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.9 }}
            style={{
              background: "#171315",
              color: "white",
              borderRadius: 28,
              padding: 30,
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
            }}
          >
            <p style={{ margin: 0, fontSize: 13, letterSpacing: 3, color: "#ffc0d4" }}>
              اللوكيشن
            </p>
            <h3 style={{ margin: "14px 0 0", fontSize: 38 }}>مكان القاعة</h3>
            <p style={{ marginTop: 18, color: "#c9bdc2", lineHeight: 2 }}>
              تقدروا تفتحوا اللوكيشن مباشرة من الزرار أو تستخدموا الخريطة المدمجة دي
              للوصول بسهولة لقاعة اللؤلؤة.
            </p>
            <div
              style={{
                overflow: "hidden",
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,.08)",
                background: "rgba(255,255,255,.05)",
                marginTop: 18,
              }}
            >
              <iframe
                title="قاعة اللؤلؤة"
                src="https://www.google.com/maps?q=30.0556383,31.3701976&z=17&hl=en&output=embed"
                style={{ width: "100%", height: 320, border: "none" }}
                loading="lazy"
              />
            </div>
            <a
              className="mainBtn"
              style={{ marginTop: 18, width: "100%", background: "white", color: "#171315" }}
              href={MAP_URL}
              target="_blank"
              rel="noreferrer"
            >
              افتح في جوجل مابس <ExternalLink size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      <section style={{ ...sectionStyle, paddingTop: 18, paddingBottom: 18 }}>
        <div className="grid-rsvp">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            style={{
              background: "linear-gradient(135deg,#e85d8e,#ec6b9f,#f2ac63)",
              color: "white",
              borderRadius: 28,
              padding: 30,
              boxShadow: "0 20px 50px rgba(232,93,142,.22)",
            }}
          >
            <div
              style={{
                marginBottom: 18,
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(255,255,255,.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PartyPopper size={28} />
            </div>
            <h3 style={{ margin: 0, fontSize: 36 }}>تأكيد الحضور</h3>
            <p style={{ marginTop: 14, lineHeight: 2, color: "rgba(255,255,255,.92)" }}>
              املى البيانات بسرعة، وبعدها ابعت تأكيد الحضور على واتساب بشكل منظم وسهل.
            </p>
            <div style={{ display: "grid", gap: 14, marginTop: 22 }}>
              <input
                placeholder="اسمك"
                value={guestForm.name}
                onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                style={{ ...inputStyle, background: "rgba(255,255,255,.15)", color: "white" }}
              />
              <input
                placeholder="عدد الأفراد"
                value={guestForm.guests}
                onChange={(e) => setGuestForm({ ...guestForm, guests: e.target.value })}
                style={{ ...inputStyle, background: "rgba(255,255,255,.15)", color: "white" }}
              />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {["أكيد جاي", "غالبًا جاي", "مش هقدر"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setGuestForm({ ...guestForm, attendance: option })}
                    style={{
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,.25)",
                      padding: "12px 10px",
                      cursor: "pointer",
                      background:
                        guestForm.attendance === option ? "white" : "rgba(255,255,255,.1)",
                      color: guestForm.attendance === option ? "#22171b" : "white",
                      fontWeight: 700,
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <button
                  className="mainBtn"
                  style={{ background: "white", color: "#201417" }}
                  onClick={saveAttendance}
                >
                  حفظ البيانات
                </button>
                <a
                  className="ghostBtn"
                  style={{
                    borderColor: "rgba(255,255,255,.25)",
                    background: "rgba(255,255,255,.12)",
                    color: "white",
                  }}
                  href={`${WHATSAPP_URL}?text=${attendanceText}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  ابعت واتساب
                </a>
              </div>
              {guestSaved ? (
                <div
                  style={{
                    borderRadius: 18,
                    border: "1px solid rgba(255,255,255,.2)",
                    background: "rgba(255,255,255,.14)",
                    padding: 14,
                    fontSize: 14,
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={16} /> تم تجهيز بياناتك، تقدر تبعتها دلوقتي على واتساب.
                  </span>
                </div>
              ) : null}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.9 }}
            style={{ ...cardStyle, padding: 30 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <h3 style={{ margin: 0, fontSize: 36 }}>رسائل المحبة</h3>
              <div
                style={{
                  borderRadius: 999,
                  background: "#fff2f7",
                  color: "#d84f82",
                  padding: "8px 14px",
                  fontSize: 14,
                }}
              >
                {messages.length} رسالة
              </div>
            </div>

            <div
              style={{
                marginTop: 20,
                background: "rgba(255,242,247,.85)",
                borderRadius: 24,
                padding: 16,
              }}
            >
              <div style={{ display: "grid", gap: 12 }}>
                <input
                  placeholder="اسمك"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ ...inputStyle, background: "white", border: "1px solid #f2d5df" }}
                />
                <textarea
                  placeholder="اكتب رسالة حلوة لعمرو ومريم..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{
                    ...inputStyle,
                    minHeight: 120,
                    resize: "vertical",
                    background: "white",
                    border: "1px solid #f2d5df",
                  }}
                />
                <button className="mainBtn" onClick={addMessage}>
                  <Send size={16} /> أضف الرسالة
                </button>
              </div>
            </div>

            <div style={{ marginTop: 18, maxHeight: 380, overflow: "auto", display: "grid", gap: 14 }}>
              {messages.map((item, index) => (
                <motion.div
                  key={`${item.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  style={{
                    borderRadius: 20,
                    border: "1px solid #f6dfe7",
                    background: "white",
                    padding: 16,
                    boxShadow: "0 8px 24px rgba(0,0,0,.04)",
                  }}
                >
                  <div
                    style={{
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "#d84f82",
                      fontWeight: 700,
                    }}
                  >
                    <Heart size={16} fill="currentColor" />
                    <span>{item.name}</span>
                  </div>
                  <p style={{ margin: 0, lineHeight: 2, color: "#5f5254" }}>{item.message}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section style={{ ...sectionStyle, paddingTop: 12, paddingBottom: 42, textAlign: "center" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
          style={{ ...cardStyle, padding: 34 }}
        >
          <div
            style={{
              margin: "0 auto 14px",
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#fff2f7",
              color: "#e85d8e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heart size={30} fill="currentColor" />
          </div>
          <h3 style={{ margin: 0, fontSize: 40 }}>مستنيينكم تنورونا 🤍</h3>
          <p
            style={{
              margin: "16px auto 0",
              maxWidth: 680,
              fontSize: 18,
              lineHeight: 2,
              color: "#6a5b5e",
            }}
          >
            يوم 26 / 6 / 2026 — الساعة 7:00 مساءً — {VENUE}
          </p>
          <div
            style={{
              marginTop: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <a className="mainBtn" href={`tel:${PHONE}`}>
              اتصال مباشر
            </a>
            <a className="ghostBtn" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              تأكيد الحضور واتساب
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} style={{ ...cardStyle, padding: 24, textAlign: "center" }}>
      <div
        style={{
          width: 56,
          height: 56,
          margin: "0 auto 16px",
          borderRadius: "50%",
          background: "#fff2f7",
          color: "#e85d8e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <h4 style={{ margin: 0, fontSize: 20 }}>{title}</h4>
      <p style={{ margin: "10px 0 0", color: "#6a5b5e", lineHeight: 1.8 }}>{value}</p>
    </motion.div>
  );
}

function CountCard({ label, value }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      style={{
        borderRadius: 24,
        border: "1px solid rgba(255,255,255,.8)",
        background: "rgba(255,255,255,.88)",
        padding: 18,
        textAlign: "center",
        boxShadow: "0 12px 30px rgba(0,0,0,.05)",
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 800, color: "#2c2426" }}>
        {String(value).padStart(2, "0")}
      </div>
      <div style={{ marginTop: 8, color: "#85797b", fontSize: 14 }}>{label}</div>
    </motion.div>
  );
}

function MiniStrip({ bg, text }) {
  return (
    <div
      style={{
        borderRadius: 18,
        background: bg,
        padding: 16,
        color: "#4e4345",
        lineHeight: 1.9,
      }}
    >
      {text}
    </div>
  );
}