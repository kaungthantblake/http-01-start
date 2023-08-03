import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { post } from '../post.model';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Subject,throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private http: HttpClient) {}

  error = new Subject<string>();

  createAndStorePost(title: string, content: string) {
    const postData: post = { title: title, content: content };
    this.http
      .post<{ name: String }>(
        'https://ng-complete-guide-95ee4-default-rtdb.firebaseio.com/post.json',
        postData
      )
      .subscribe((ResponseData) => {
        console.log(ResponseData);
      }, 
      error =>{
        this.error.next(error.message)
      });
  }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: post }>('https://ng-complete-guide-95ee4-default-rtdb.firebaseio.com/post.json')
      .pipe(
        map((responseData) => {
          const postArray: post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
        );
  }
  clearPost(){
    return this.http.delete('https://ng-complete-guide-95ee4-default-rtdb.firebaseio.com/post.json')
    
  }


}

  


