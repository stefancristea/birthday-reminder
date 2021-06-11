import { Component, OnInit } from '@angular/core';
import { FriendsService } from '../../_services';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.less']
})
export class UpcomingComponent implements OnInit {

  constructor(private friendsService: FriendsService) {
    this.friendsService.getUpcomingBirthDay().subscribe(data => {
      this.birthDay = data;
    });
  }

  birthDay;

  ngOnInit(): void {
  }

}
