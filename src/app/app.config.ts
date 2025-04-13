import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from  '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), provideFirebaseApp(() => initializeApp({"projectId":"user-management-example-5173c","appId":"1:418691831657:web:b4024bacc93ce1ec4c0ff8","storageBucket":"user-management-example-5173c.firebasestorage.app","apiKey":"AIzaSyB2A2M_Q0lTDvgtHssQrrr4t8uE79aozjg","authDomain":"user-management-example-5173c.firebaseapp.com","messagingSenderId":"418691831657"})), provideFirestore(() => getFirestore()), provideFunctions(() => getFunctions()), providePerformance(() => getPerformance()), provideStorage(() => getStorage()), provideFirebaseApp(() => initializeApp({"projectId":"user-management-example-5173c","appId":"1:418691831657:web:b4024bacc93ce1ec4c0ff8","storageBucket":"user-management-example-5173c.firebasestorage.app","apiKey":"AIzaSyB2A2M_Q0lTDvgtHssQrrr4t8uE79aozjg","authDomain":"user-management-example-5173c.firebaseapp.com","messagingSenderId":"418691831657"})), provideFirestore(() => getFirestore())]
};
