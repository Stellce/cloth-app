import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";

export const canActivate: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return !!authService.user;
}
