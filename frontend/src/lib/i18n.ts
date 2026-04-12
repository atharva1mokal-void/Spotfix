import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Define resources
const resources = {
  en: {
    translation: {
      // Common & Nav
      "SpotFix": "SpotFix",
      "Home": "Home",
      "Features": "Features",
      "How It Works": "How It Works",
      "Impact": "Impact",
      "Building Better Cities Together": "Building Better Cities Together",
      "स्वच्छ भारत, सुंदर भारत": "स्वच्छ भारत, सुंदर भारत",
      "hero_desc": "Report civic issues instantly. Track progress in real-time. Create cleaner, safer communities through transparent governance.",
      "Citizen Portal": "Citizen Portal",
      "Authority Portal": "Authority Portal",
      "Admin Portal": "Admin Portal",
      "Language": "Language",

      // Citizen Login
      "Citizen Login": "Citizen Login",
      "Enter your credentials": "Enter your credentials to access your account",
      "Mobile Number": "Mobile Number *",
      "10 digit mobile": "10 digit mobile number",
      "Password": "Password *",
      "Enter password": "Enter your password",
      "Remember me": "Remember me",
      "Forgot password?": "Forgot password?",
      "Login": "Login",
      "Don't have an account?": "Don't have an account?",
      "Register": "Register",
      "or": "or",
      "Login with OTP": "Login with OTP",
      "Secure & Trusted": "Secure & Trusted Platform",
      "Please fill all fields": "Please fill all fields",
      "Welcome!": "Welcome!",
      "Login failed": "Login failed",

      // Authority Login
      "Authority Login": "Authority Login",
      "Authorized Access": "Authorized Government Personnel Access",
      "Employee ID": "Employee ID or Email *",
      "Department": "Department *",
      "Select Department": "Select your department",
      "Secure Login": "Secure Login",
      "Logging in": "Logging in...",
      "Login with Signature": "Login with Digital Signature",
      "Secure Connection": "Secure Connection",
      "Communications encrypted": "All communications are encrypted and monitored for security",
      "Auth Personnel Only": "Authorized Personnel Only - Access restricted to government officials and municipal authorities",

      // Admin Login
      "System Administrator": "System Administrator",
      "System Access": "System Control Access",
      "Admin Email": "Admin Email / Username *",
      "Secret Key": "Secret Key *",
      "Enter Admin Email": "admin@gov.in",
      "Enter Security Key": "Enter 2FA Token or Security Key",
      "Login to Dashboard": "Login to Dashboard",
      "System Security": "High Security System Access",
      "Administrator Portal": "Administrator Portal",
      "Admin Login": "Admin Login",
      "High-Level Security": "High-Level Security Administrator Access",
      "Admin ID or Email": "Admin ID or Email *",
      "Secret Key label": "Secret Key *",
      "Admin unique key": "Enter your unique administrator secret key",
      "Secure session": "Secure session",
      "Reset credentials": "Reset credentials",
      "Multi-factor auth": "Multi-factor authentication required after login",
      "Secure Access": "Secure Access",
      "Biometric Auth": "Biometric Auth",
      "Maximum Security Level": "Maximum Security Level",
      "Admin activities logged": "All admin activities are logged, encrypted, and audited."
    }
  },
  hi: {
    translation: {
      // Common & Nav
      "SpotFix": "स्पॉटफिक्स",
      "Home": "मुख्य पृष्ठ",
      "Features": "विशेषताएं",
      "How It Works": "यह कैसे काम करता है",
      "Impact": "प्रभाव",
      "Building Better Cities Together": "बेहतर शहर, एक साथ",
      "स्वच्छ भारत, सुंदर भारत": "स्वच्छ भारत, सुंदर भारत",
      "hero_desc": "नागरिक समस्याओं की तुरंत रिपोर्ट करें। रीयल-टाइम में प्रगति ट्रैक करें। पारदर्शी प्रशासन के माध्यम से स्वच्छ और सुरक्षित समाज बनाएँ।",
      "Citizen Portal": "नागरिक पोर्टल",
      "Authority Portal": "प्राधिकरण पोर्टल",
      "Admin Portal": "व्यवस्थापक पोर्टल",
      "Language": "भाषा",

      // Citizen Login
      "Citizen Login": "नागरिक लॉगिन",
      "Enter your credentials": "अपने खाते तक पहुंचने के लिए विवरण दर्ज करें",
      "Mobile Number": "मोबाइल नंबर *",
      "10 digit mobile": "10 अंकों का मोबाइल नंबर",
      "Password": "पासवर्ड *",
      "Enter password": "पासवर्ड दर्ज करें",
      "Remember me": "मुझे याद रखें",
      "Forgot password?": "पासवर्ड भूल गए?",
      "Login": "लॉगिन करें",
      "Don't have an account?": "खाता नहीं है?",
      "Register": "रजिस्टर करें",
      "or": "या",
      "Login with OTP": "OTP से लॉगिन करें",
      "Secure & Trusted": "सुरक्षित और विश्वसनीय प्लेटफॉर्म",
      "Please fill all fields": "कृपया सभी फ़ील्ड भरें",
      "Welcome!": "स्वागत है!",
      "Login failed": "लॉगिन विफल",

      // Authority Login
      "Authority Login": "प्राधिकरण लॉगिन",
      "Authorized Access": "अधिकृत सरकारी कर्मचारी प्रवेश",
      "Employee ID": "कर्मचारी आईडी या ईमेल *",
      "Department": "विभाग *",
      "Select Department": "अपना विभाग चुनें",
      "Secure Login": "सुरक्षित लॉगिन",
      "Logging in": "प्रवेश हो रहा है...",
      "Login with Signature": "डिजिटल हस्ताक्षर से लॉगिन",
      "Secure Connection": "सुरक्षित कनेक्शन",
      "Communications encrypted": "सुरक्षा के लिए सभी संचार एन्क्रिप्टेड और मॉनिटर किए जाते हैं",
      "Auth Personnel Only": "केवल अधिकृत कर्मचारी - सरकारी अधिकारियों और नगरपालिका अधिकारियों तक पहुंच सीमित",

      // Admin Login
      "System Administrator": "व्यवस्थापक प्रवेश",
      "System Access": "सिस्टम नियंत्रण पहुँच",
      "Admin Email": "व्यवस्थापक ईमेल / उपयोगकर्ता नाम *",
      "Secret Key": "सुरक्षा कुंजी / टोकन *",
      "Enter Admin Email": "admin@gov.in",
      "Enter Security Key": "2FA टोकन या सुरक्षा कुंजी दर्ज करें",
      "Login to Dashboard": "डैशबोर्ड में लॉगिन करें",
      "System Security": "उच्च सुरक्षा प्रणाली पहुँच",
      "Administrator Portal": "व्यवस्थापक पोर्टल",
      "Admin Login": "व्यवस्थापक लॉगिन",
      "High-Level Security": "उच्च-स्तरीय सुरक्षा व्यवस्थापक पहुँच",
      "Admin ID or Email": "व्यवस्थापक आईडी या ईमेल *",
      "Secret Key label": "गुप्त कुंजी *",
      "Admin unique key": "अपनी अद्वितीय व्यवस्थापक गुप्त कुंजी दर्ज करें",
      "Secure session": "सुरक्षित सत्र",
      "Reset credentials": "क्रेडेंशियल रीसेट करें",
      "Multi-factor auth": "लॉगिन के बाद मल्टी-फैक्टर ऑथेंटिकेशन आवश्यक है",
      "Secure Access": "सुरक्षित प्रवेश",
      "Biometric Auth": "बायोमेट्रिक प्रमाणीकरण",
      "Maximum Security Level": "अधिकतम सुरक्षा",
      "Admin activities logged": "सभी व्यवस्थापक गतिविधियाँ लॉग की जाती हैं।"
    }
  },
  mr: {
    translation: {
      // Common & Nav
      "SpotFix": "स्पॉटफिक्स",
      "Home": "मुख्य पृष्ठ",
      "Features": "वैशिष्ट्ये",
      "How It Works": "हे कसे कार्य करते",
      "Impact": "परिणाम",
      "Building Better Cities Together": "एकत्र चांगले शहरे घडवूया",
      "स्वच्छ भारत, सुंदर भारत": "स्वच्छ भारत, सुंदर भारत",
      "hero_desc": "नागरी समस्यांची त्वरित तक्रार करा. रिअल-टाइममध्ये प्रगतीचा मागोवा घ्या. पारदर्शक प्रशासनाद्वारे स्वच्छ आणि सुरक्षित समुदाय तयार करा.",
      "Citizen Portal": "नागरिक पोर्टल",
      "Authority Portal": "प्राधिकरण पोर्टल",
      "Admin Portal": "प्रशासक पोर्टल",
      "Language": "भाषा",

      // Citizen Login
      "Citizen Login": "नागरिक लॉगिन",
      "Enter your credentials": "तुमच्या खात्यात प्रवेश करण्यासाठी तपशील प्रविष्ट करा",
      "Mobile Number": "मोबाईल नंबर *",
      "10 digit mobile": "10 अंकी मोबाईल नंबर",
      "Password": "पासवर्ड *",
      "Enter password": "पासवर्ड प्रविष्ट करा",
      "Remember me": "माझी आठवण ठेवा",
      "Forgot password?": "पासवर्ड विसरलात?",
      "Login": "लॉगिन करा",
      "Don't have an account?": "खाते नाही?",
      "Register": "रजिस्टर करा",
      "or": "किंवा",
      "Login with OTP": "OTP सह लॉगिन करा",
      "Secure & Trusted": "सुरक्षित आणि विश्वसनीय प्लॅटफॉर्म",
      "Please fill all fields": "कृपया सर्व फील्ड भरा",
      "Welcome!": "स्वागत आहे!",
      "Login failed": "लॉगिन अयशस्वी",

      // Authority Login
      "Authority Login": "प्राधिकरण लॉगिन",
      "Authorized Access": "अधिकृत सरकारी कर्मचारी प्रवेश",
      "Employee ID": "कर्मचारी आयडी किंवा ईमेल *",
      "Department": "विभाग *",
      "Select Department": "तुमचा विभाग निवडा",
      "Secure Login": "सुरक्षित लॉगिन",
      "Logging in": "प्रवेश होत आहे...",
      "Login with Signature": "डिजिटल स्वाक्षरीसह लॉगिन",
      "Secure Connection": "सुरक्षित कनेक्शन",
      "Communications encrypted": "सुरक्षेसाठी सर्व संप्रेषण एन्क्रिप्ट केलेले आणि मॉनिटर केलेले आहे",
      "Auth Personnel Only": "केवळ अधिकृत कर्मचारी - सरकारी अधिकारी आणि महानगरपालिका अधिकाऱ्यांपर्यंत प्रवेश मर्यादित",

      // Admin Login
      "System Administrator": "प्रशासक प्रवेश",
      "System Access": "सिस्टम नियंत्रण प्रवेश",
      "Admin Email": "प्रशासक ईमेल / वापरकर्ता नाव *",
      "Secret Key": "सुरक्षा की / टोकन *",
      "Enter Admin Email": "admin@gov.in",
      "Enter Security Key": "2FA टोकन किंवा सुरक्षा की प्रविष्ट करा",
      "Login to Dashboard": "डॅशबोर्डवर लॉगिन करा",
      "System Security": "उच्च सुरक्षा प्रणाली प्रवेश",
      "Administrator Portal": "प्रशासक पोर्टल",
      "Admin Login": "प्रशासक लॉगिन",
      "High-Level Security": "उच्च-स्तरीय सुरक्षा प्रशासक प्रवेश",
      "Admin ID or Email": "प्रशासक आयडी किंवा ईमेल *",
      "Secret Key label": "गुप्त की *",
      "Admin unique key": "तुमची अद्वितीय प्रशासक गुप्त की प्रविष्ट करा",
      "Secure session": "सुरक्षित सत्र",
      "Reset credentials": "क्रेडेन्शियल्स रीसेट करा",
      "Multi-factor auth": "लॉगिननंतर मल्टी-फॅक्टर ऑथेंटिकेशन आवश्यक आहे",
      "Secure Access": "सुरक्षित प्रवेश",
      "Biometric Auth": "बायोमेट्रिक ऑथ",
      "Maximum Security Level": "कमाल सुरक्षा स्तर",
      "Admin activities logged": "सर्व प्रशासक क्रिया लॉग केल्या जातात, एन्क्रिप्ट केल्या जातात आणि ऑडिट केल्या जातात."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Set default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React escapes automatically
    }
  });

export default i18n;
