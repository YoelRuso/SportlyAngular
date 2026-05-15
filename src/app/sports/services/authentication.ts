import { Injectable } from '@angular/core';
import { User, Auth, signInWithEmailAndPassword, authState, signOut, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Authentication {
  user$: Observable<User | null>;
  user;

  constructor(private auth: Auth) {
    this.user$ = authState(this.auth);
    this.user = toSignal(this.user$, { initialValue: null });
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
