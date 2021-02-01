import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FirebaseauthService } from './services/firebaseauth.service';
import { NotificationsService } from './services/notifications.service';

import { Plugins, StatusBarStyle } from '@capacitor/core';

const { SplashScreen, StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  admin = false;

  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private firebaseauthService: FirebaseauthService,
    private notificationsService: NotificationsService) {
    this.initializeApp();
  }

  initializeApp() {
    
      this.platform.ready().then(() => {

        SplashScreen.hide();
        StatusBar.setBackgroundColor({color: '#ffffff'});
        StatusBar.setStyle({
          style: StatusBarStyle.Light
        });

        // this.statusBar.styleDefault();
        // this.splashScreen.hide();
        this.getUid();
      });
  }


  getUid() {
      this.firebaseauthService.stateAuth().subscribe( res => {
            if (res !== null) {
                if (res.uid === 'CHpQBloQ36ZRsLoGz9RmUwBAstR2')  {
                    this.admin = true;
                } else {
                   this.admin = false;
                }
            } else {
              this.admin = false;
            }
      });
  }
}






//   match /Productos/{documents=**} {
//     allow read;
//     allow write: if request.auth.uid == 'p9h09mCbbTOc6AsqBoIUdH0gTx93'
// }

// match /Clientes/{userId}/pedidos/{documents=**} {
// allow read;
// allow write: if request.auth.uid == userId
// }


//   rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if
//           request.time < timestamp.date(2020, 12, 28);
//     }
//   }
// }
