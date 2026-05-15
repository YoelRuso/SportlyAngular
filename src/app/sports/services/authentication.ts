import { Injectable } from '@angular/core';
import { User, Auth, signInWithEmailAndPassword, authState, signOut, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Authentication {
  user$: Observable<User | null>;
  profile$: Observable<any>;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.user$ = authState(this.auth);
    this.profile$ = this.user$.pipe(
      switchMap(user => {
        if (!user) {
          console.log('Authentication: No user logged in, profile$ is null');
          return of(null);
        }
        console.log('Authentication: Fetching profile for UID:', user.uid);
        
        const userDocRef = doc(this.firestore, 'users', user.uid);
        
        return new Observable(subscriber => {
          const unsubscribe = onSnapshot(userDocRef, 
            (snap: any) => {
              const data = snap.data();
              console.log('Authentication: Profile data received:', data);
              subscriber.next(data);
            },
            (error: any) => {
              console.error('Authentication: Error in onSnapshot:', error);
              subscriber.error(error);
            }
          );
          return () => unsubscribe();
        });
      })
    );
  }

  login(email: string, password: string): Promise<User> {
    return signInWithEmailAndPassword(this.auth, email, password).
    then(cred => cred.user);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  register(email: string, password: string): Promise<User> {
    return createUserWithEmailAndPassword(this.auth, email, password).
    then(cred => cred.user);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}
