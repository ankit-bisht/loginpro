import {Component, ViewChild} from '@angular/core';

import {FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent} from 'ng2-facebook-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [
    '.container { max-width: 700px; background: #f7f7f7; margin: 50px auto; padding: 30px; border-radius: 15px; }',
    'h2 { margin-bottom: 20px; }',
    'h4 { margin-top: 40px; margin-bottom: 10px; }'
  ]
})
export class AppComponent {

  @ViewChild(FBVideoComponent) video: FBVideoComponent;

  constructor(
    private fb: FacebookService
  ) {

    console.log('Initializing Facebook');

    fb.init({
      appId: '1890104357926489',
      version: 'v2.9'
    });

  }
 token:any;
 id_fb:any;
 no_fri:any;
 fb_name:any;
 fb_email:any;
 fb_gender:any;
 img:string;
 fb_logout=' ';
  /**
   * Login with minimal permissions. This allows you to see their public profile only.
   */
   login() {
       const loginOptions: LoginOptions = {
         enable_profile_selector: true,
         return_scopes: true,
         scope: 'public_profile,user_friends,email,pages_show_list'
       };
       this.fb.login(loginOptions)
         .then((res: LoginResponse) => {
           console.log('Logged in', res);
          this.token=res.authResponse.accessToken;
          this.id_fb=res.authResponse.userID;
          this.getFriends();
          this.getProfile();
          this.getEmail();
         })
         .catch(this.handleError);
        // this.getLoginStatus();

     }


  getFriends() {
    this.fb.api('/'+this.id_fb+'/friends/?access_token=' + this.token )
      .then((res: any) => {
        console.log('Got the users friends', res);
        this.no_fri=res.summary.total_count;
        console.log(this.no_fri);
      })
      .catch(this.handleError);
  }

  getProfile() {
    this.fb.api('/me')
      .then((res: any) => {
        console.log('Got the users profile', res);
        this.fb_name=res.name;
      })
      .catch(this.handleError);
  }

  getEmail(){
  this.fb.api('/me?fields=gender,first_name,last_name,email,picture')
    .then((res: any) => {
      console.log('Got the users profile', res);
      this.fb_email=res.email;
      this.fb_gender=res.gender;
      this.img=res.picture.data.url;

    })
    .catch(this.handleError);
  }

  logout(){
    this.fb.logout();
    console.log('logged out');
    this.fb_logout='Logged Out Successfully';
    }

  private handleError(error) {
    console.error('Error processing action', error);
  }

}
