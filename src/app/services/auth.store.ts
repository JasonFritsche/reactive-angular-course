import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../model/user";

@Injectable({
  providedIn: "root",
})
export class AuthStore {
  userr$: Observable<User>;
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  login(email: string, password: string): Observable<User> {
    throw new Error("Method not implemented.");
  }

  logout(): void {}
}
