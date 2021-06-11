import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../_services';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.less']
})

export class NavbarComponent implements OnInit
{
    currentUser: any;

    constructor(private router: Router, private authenticationService: AuthenticationService)
    {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    ngOnInit(): void
    {
    }

    logout()
    {
      this.authenticationService.logout();
      this.router.navigate(['/login']);
    }
}
