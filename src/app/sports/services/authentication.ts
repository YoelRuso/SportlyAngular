import { Injectable, inject } from '@angular/core';
import { User, Auth, signInWithEmailAndPassword, authState, signOut, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable, switchMap, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

export interface UserProfile {
  nombre: string;
  apellidos: string;
  email: string;
  photoBase64: string | null;
  createdAt?: any;
}

@Injectable({
  providedIn: 'root',
})
export class Authentication {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  user$: Observable<User | null> = authState(this.auth);
  user = toSignal(this.user$, { initialValue: null });
  
  profile$: Observable<UserProfile | null> = this.user$.pipe(
    switchMap(user => {
      if (!user) return of(null);
      
      const userDocRef = doc(this.firestore, 'users', user.uid);
      
      return new Observable<UserProfile | null>(subscriber => {
        const unsubscribe = onSnapshot(userDocRef, 
          (snap) => {
            if (snap.exists()) {
              subscriber.next(snap.data() as UserProfile);
            } else {
              subscriber.next(null);
            }
          },
          (error) => {
            console.error('Authentication: Error fetching profile:', error);
            subscriber.error(error);
          }
        );
        return () => unsubscribe();
      });
    })
  );

  login(email: string, password: string): Promise<User> {
    return signInWithEmailAndPassword(this.auth, email, password).then(cred => cred.user);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  register(email: string, password: string): Promise<User> {
    return createUserWithEmailAndPassword(this.auth, email, password).then(cred => cred.user);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}
