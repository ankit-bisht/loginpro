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
 fb_logout='';
 postdata='';
 fb_status='';
 no_post:any;
   login() {
       const loginOptions: LoginOptions = {
         enable_profile_selector: true,
         return_scopes: true,
         scope: 'publish_actions,public_profile,user_friends,email,pages_show_list'
       };
       this.fb.login(loginOptions)
         .then((res: LoginResponse) => {
           console.log('Logged in', res);
          this.token=res.authResponse.accessToken;
          this.id_fb=res.authResponse.userID;
          this.getFriends();
          this.getProfile();
          this.getEmail();
          this.getFeed();
          this.fb_logout='';
          var counter=0;
          counter++;
          if(counter=1)
          {
            document.getElementById('btn-login').style.visibility = 'hidden';
            document.getElementById('btn-logout').style.visibility = 'visible';
            document.getElementById('inp-login').style.visibility = 'visible';
          }
         })
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

  getFeed(){
  this.fb.api('/me/feed')
      .then((res:any) => {
         console.log('Total Post', res.data);
        this.no_post=res.data.length;
    })
  }

    post(postdata)
  {
   console.log(postdata)
   this.fb.api("/me/feed","post",{"message": postdata})
   .then((res)=>{
     console.log(res);
     this.fb_status='Status Posted Successfully';
   })
  }

  logout(){
    this.fb.logout();
    this.fb_logout='Logged Out Successfully';
    var counter=0;
    counter++;
    if(counter=1)
    {
      document.getElementById('btn-login').style.visibility = 'visible';
      document.getElementById('inp-login').style.visibility = 'hidden';
      document.getElementById('btn-logout').style.visibility = 'hidden';
    }
    }

  private handleError(error) {
    console.error('Error processing action', error);
  }

}
