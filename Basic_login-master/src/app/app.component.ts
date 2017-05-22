import { Component,OnInit } from '@angular/core';
import { FacebookService, InitParams,LoginResponse, LoginOptions} from 'ngx-facebook';
import { LocalStorageService } from 'angular-2-local-storage';
declare var cb:any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular Login Page';
  ap;
  img;
  frnd;
  result;
  auth;
  tweet=[];
  pa;
  constructor(private fb: FacebookService,private localStorageService: LocalStorageService) {
 
    let initParams: InitParams = {
      appId: '1411172165617274',
      version: 'v2.9'
    };
    fb.init(initParams);
  }
  ngOnInit(){
      cb.setConsumerKey("s9P3RckFoHSiTBur0p0ToGgIE", "pvTUIc9L7wlqTGK93n62OAw0cSYZH8oOCt8mAmIUbMwVy5euJO");
      cb.__call(
    
       "oauth_requestToken",
      {oauth_callback: "oob"}//Redirects to enter the pin generated
    ,(res)=>{
      //console.log(res.oauth_token+"I am twitter");
      cb.setToken(res.oauth_token, res.oauth_token_secret);
      console.log(cb)
    })
  }
  login() {
    const loginOptions: LoginOptions = {
      enable_profile_selector: true,
      return_scopes: true,
      scope: 'public_profile,user_friends,email,pages_show_list'
    };
    this.fb.login(loginOptions)
      .then((res: LoginResponse) => {
        console.log('Logged in', res);
       // this.data=res.authResponse.userID
        this.localStorageService.set('userID',res.authResponse.userID);
       // this.token=res.authResponse.accessToken;
        this.localStorageService.set('token',res.authResponse.accessToken);
        
      })
      .catch(this.handleError);
     // this.getLoginStatus();

  }
  private handleError(error) {
    console.error('Error processing action', error);
  }
  getLoginStatus() {
    console.log(this.localStorageService.get('userID'));
    console.log(this.localStorageService.get('token'));
    var ID=this.localStorageService.get('userID');
    var oauth=this.localStorageService.get('token');
    this.ap='/'+ID+'/friends'+'/?access_token='+oauth;
    console.log(this.ap+"I am API")
    this.fb.api(this.ap).then((response)=>{
        console.log(response+"second")
        this.frnd=response.summary.total_count;
    })
    //API to get more fields 
    // this.fb.api('/me?fields=gender,first_name,last_name,email')
    //   .then((res: any) => {
    //     // console.log('Got the users profile', res);
    //     this.img=res;
    //     console.log(this.img)
    //   })
    //   .catch(this.handleError);
    this.fb.api('/me'+'/?access_token='+oauth)
      .then((res: any) => {
        // console.log('Got the users profile', res);
        this.img=res.name;
      })
      .catch(this.handleError);
  }
  // logout(){
  // this.fb.logout().then((res) => console.log(res
  // ));
  // }
  //TWITTER API 
  tweetapi()
  {
    //console.log(cb);
    cb.__call("oauth_authorize",{},(auth_url)=>{
                
                console.log(auth_url)
                this.auth=window.open(auth_url);
                console.log(this.auth+"I am auth");
            })
      var flag=0;
      this.localStorageService.set('flag',flag);      
  }

   getdetails(password)
   {
     
     var flag=this.localStorageService.get('flag');
     if(flag==0)
     {
     this.localStorageService.set('pass',password);
     //this.pa=this.localStorageService.get('pass');
     //console.log("flag "+flag);
     flag=1;
     this.localStorageService.set('flag',flag);
     //console.log("flag second "+flag);
    }
    this.pa=this.pa=this.localStorageService.get('pass');
     cb.__call("oauth_accessToken",{oauth_verifier: this.pa},(reply)=>{ 
                // store the authenticated token, which may be different from the request token (!)
                this.localStorageService.set('oauth',reply.oauth_token);
                this.localStorageService.set('secret',reply.oauth_token_secret);
                var token = this.localStorageService.get('oauth');
                var secret = this.localStorageService.get('secret');
                cb.setToken(token, secret);
                console.log(cb);
              } )  
      cb.__call("oauth2_token",{},(reply)=>{
        this.localStorageService.set('access',reply.access_token);
        var bearer_token = this.localStorageService.get('access');
        console.log(bearer_token+ "Before b Token");
        cb.setBearerToken("bearer_token"); 
        //console.log(cb+ "after b Token");
     })         
    
   }
   getdet()
   {
      cb.__call("account_verifyCredentials",{},(reply)=>{
        console.log(reply);
        //console.log(cb)
        this.tweet=reply;
      }
    );            
   }
}
