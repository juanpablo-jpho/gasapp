import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestorageService {

  constructor(public storage: AngularFireStorage) { }


  uploadImage(file: any, path: string, nombre: string): Promise<string> {
      return new Promise(  resolve => {
          const filePath = path + '/' + nombre;
          const ref = this.storage.ref(filePath);
          const task = ref.put(file);
          task.snapshotChanges().pipe(
            finalize(  () => {
                  ref.getDownloadURL().subscribe( res => {
                    const downloadURL = res;
                    resolve(downloadURL);
                    return;
                  });
            })
         )
        .subscribe();
      });
  }


}
