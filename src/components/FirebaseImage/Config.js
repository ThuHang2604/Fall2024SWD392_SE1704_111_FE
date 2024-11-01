// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken } from 'firebase/messaging';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: 'AIzaSyBWUEQanLBeGpp6z5aNW8hcniFaFOVDfd8',
  authDomain: 'hair-salon-booking-391.firebaseapp.com',
  projectId: 'hair-salon-booking-391',
  storageBucket: 'hair-salon-booking-391.appspot.com',
  messagingSenderId: '448888339358',
  appId: '1:448888339358:web:7a2a7d9e087bb638f8748f',
  measurementId: 'G-36D9RFXBVJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const imageDb = getStorage(app);
export const messaging = getMessaging(app);
export const auth = getAuth(app);
// export const generateToken = async () => {
//   try {
//     const permission = await Notification.requestPermission();
//     if (permission === "granted") {
//       const token = await getToken(messaging, {
//         vapidKey:
//         "BMlqyj5Nejw6sc5cEkgMvk1F5ZZr7AxAfkRv_PYNpUQNFZvYa5ts18UN2UVStnb-sTSNbqIJr75IrJ7FWtzciag",
//       });
//     }
//   } catch (error) {
//     console.error("Error getting token:", error);
//   }
// };
// Hàm thiết lập reCAPTCHA
// export const setupRecaptcha = () => {
//   window.recaptchaVerifier = new RecaptchaVerifier(
//     'recaptcha-container',
//     {
//       size: 'invisible',
//       callback: (response) => {
//         console.log('reCAPTCHA verified successfully.');
//       },
//     },
//     auth,
//   );
// };
