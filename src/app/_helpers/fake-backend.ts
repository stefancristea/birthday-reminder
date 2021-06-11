import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

let users = JSON.parse(localStorage.getItem('users')) || [];
let tokens_to_user = JSON.parse(localStorage.getItem('tokens')) || {};
let friends = JSON.parse(localStorage.getItem('friends')) || {};

@Injectable() export class FakeBackendInterceptor implements HttpInterceptor
{
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    const { url, method, headers, body } = request;

    return of(null)
        .pipe(mergeMap(handleRoute))
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());

    function handleRoute()
    {
      try
      {
        switch (true)
        {
            case url.endsWith('/users/authenticate') && method === 'POST':
                return authenticate();
            case url.endsWith('/users/register') && method === 'POST':
                return register();
            case url.endsWith('/friends') && method === 'GET':
              return getFriends();
            case url.endsWith('/friend/add') && method === 'POST':
              return addFriend();
            case url.endsWith('/friend/delete') && method === 'POST':
                return deleteFriend();
            case url.endsWith('/friend/upcoming') && method === 'GET':
                return getUpcomingBirthDay();
            default:
              return next.handle(request);
        }
      }
      catch(error)
      {
        console.log(error);
      }
    }

      function authenticate()
      {
          const { username, password } = body;
          const user = users.find(x => x.username === username && x.password === password);

          if (!user)
            return error('Username or password is incorrect');

          return ok ({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            token: user.token,
          });
      }

      function register()
      {
          const user = body

          if (users.find(x => x.username === user.username))
          {
            return error('Username "' + user.username + '" is already taken')
          }

          user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
          user.token = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 15);

          users.push(user);
          tokens_to_user[user.token] = user.id;

          localStorage.setItem('users', JSON.stringify(users));
          localStorage.setItem('tokens', JSON.stringify(tokens_to_user));

          return ok ();
      }

      function getFriends()
      {
        if (!isLoggedIn())
          return unauthorized();

        const userId = getUserId();

        if (friends.hasOwnProperty(`user-${userId}`))
          return ok(friends[`user-${userId}`]);
        else
          return ok([]);
      }

      function addFriend()
      {
        if (!isLoggedIn())
          return unauthorized();

        const userId = getUserId();
        const friend = body;

        if (friends.hasOwnProperty(`user-${userId}`))
          friends[`user-${userId}`].push(friend);
        else
          friends[`user-${userId}`] = [friend];

        localStorage.setItem('friends', JSON.stringify(friends));
        return ok({});
      }

      function deleteFriend()
      {
        if (!isLoggedIn())
          return unauthorized();

        const userId = getUserId();
        const friend = body;

        if (!friends.hasOwnProperty(`user-${userId}`))
          return ok({});

        const friend_index = friends[`user-${userId}`].indexOf(friend);

        if (friend_index != -1)
        {
          friends[`user-${userId}`].splice(friend_index, 1);
          localStorage.setItem('friends', JSON.stringify(friends));
        }

        return ok({});
      }

      function getUpcomingBirthDay()
      {
        if (!isLoggedIn())
          return unauthorized();

        const userId = getUserId();
        const userFriends = JSON.parse(JSON.stringify(friends[`user-${userId}`]));

        if (!userFriends)
          return ok({});

        const friends_sorted = [];
        const current_date = new Date();

        for (let friend of userFriends)
        {
          const friend_bday = new Date(friend.birthday);
          friend.this_year_timestamp = new Date(current_date.getFullYear(), friend_bday.getMonth(), friend_bday.getUTCDate()).getTime();
          friend.age = current_date.getFullYear() - friend_bday.getFullYear();

          if (friend.this_year_timestamp < current_date.getTime())
            continue;

          friends_sorted.push(friend);
        }

        friends_sorted.sort((a, b) => {
          return a.this_year_timestamp - b.this_year_timestamp;
        });

        return ok(friends_sorted[0]);
      }

      function ok(body?)
      {
          return of(new HttpResponse({ status: 200, body }))
      }

      function error(message)
      {
          return throwError({ error: { message } });
      }

      function unauthorized()
      {
          return throwError({ status: 401, error: { message: 'Unauthorised' } });
      }

      function isLoggedIn()
      {
        const authorization = headers.get('Authorization');

        if (!authorization.startsWith('Bearer'))
          return false;

        const token = authorization.substr(7, 15);
        return tokens_to_user.hasOwnProperty(token);
      }

      function getUserId()
      {
        const authorization = headers.get('Authorization');
        const token = authorization.substr(7, 15);
        return tokens_to_user[token];
      }
  }
}

export const fakeBackendProvider =
{
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
