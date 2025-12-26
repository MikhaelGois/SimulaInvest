import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyBi1BWwl_DqSUW2s3cvIrNbBasXia9m-tk',
  authDomain: 'simulainvest-d6733.firebaseapp.com',
  projectId: 'simulainvest-d6733',
  storageBucket: 'simulainvest-d6733.firebasestorage.app',
  messagingSenderId: '67596016240',
  appId: '1:67596016240:web:7038ad50175cc07cdef2b5',
  measurementId: 'G-R8DFVF9QSN',
};

const app = initializeApp(firebaseConfig);

// Analytics só quando suportado e em ambiente de navegador
isSupported()
  .then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  })
  .catch(() => {
    // silencioso se não suportar
  });

export { app };
