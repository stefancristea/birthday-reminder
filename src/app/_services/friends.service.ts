import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class FriendsService
{
  constructor(private http: HttpClient) { }

  getFriends()
  {
    return this.http.get<any[]>(`${environment.apiUrl}/friends`);
  }

  addFriend(friend)
  {
    return this.http.post<any>(`${environment.apiUrl}/friend/add`, friend);
  }

  deleteFriend(friend)
  {
    return this.http.post<any>(`${environment.apiUrl}/friend/delete`, friend);
  }

  getUpcomingBirthDay()
  {
    return this.http.get<any>(`${environment.apiUrl}/friend/upcoming`);
  }
}
