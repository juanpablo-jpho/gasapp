import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore.service';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { Subscription } from 'rxjs';
import { Pedido } from '../../models';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {

  nuevosSuscriber: Subscription;
  culmidadosSuscriber: Subscription;
  pedidos: Pedido[] = [];
  pedidosEntregados: Pedido[] = [];

  nuevos = true;

  constructor(public menucontroler: MenuController,
    public firestoreService: FirestoreService,
    public firebaseauthService: FirebaseauthService) { }
  
   ngOnInit() {
       this.getPedidosNuevos();
   }

   openMenu() {
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }

  changeSegment(ev: any) {
    //  console.log('changeSegment()', ev.detail.value);
     const opc = ev.detail.value;
     if (opc === 'culminados') {
       this.nuevos = false;
       this.getPedidosCulminados();
     }
     if (opc === 'nuevos') {
          this.nuevos = true;
          this.getPedidosNuevos();
    }
  }

  async getPedidosNuevos() {
    console.log('getPedidosNuevos()');
    const path = 'pedidos';
    let startAt = null;
    if (this.pedidos.length) {
        startAt = this.pedidos[this.pedidos.length - 1].fecha
    }
    this.nuevosSuscriber = this.firestoreService.getCollectionAll<Pedido>(path, 'estado', '==', 'enviado', startAt).subscribe( res => {
          if (res.length) {
                console.log('getPedidosNuevos() -> res ', res);
                res.forEach( pedido => {
                      this.pedidos.push(pedido);
                });
          }
    });

  }

  async getPedidosCulminados() {
    console.log('getPedidosCulminados()');
    const path = 'pedidos';
    let startAt = null;
    if (this.pedidosEntregados.length) {
        startAt = this.pedidosEntregados[this.pedidosEntregados.length - 1].fecha
    }
    this.nuevosSuscriber = this.firestoreService.getCollectionAll<Pedido>(path, 'estado', '==', 'entregado', startAt).subscribe( res => {
          if (res.length) {
                console.log('getPedidosCulminados() -> res ', res);
                res.forEach( pedido => {
                      this.pedidosEntregados.push(pedido);
                });
          }
    });

  }

  

  cargarMas() {
      if (this.nuevos) {
        this.getPedidosNuevos();
      } else {
        this.getPedidosCulminados();
      }
  }

}
