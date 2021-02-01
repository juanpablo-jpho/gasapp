import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const firestore = admin.firestore();


const uidAdmin = 'CHpQBloQ36ZRsLoGz9RmUwBAstR2';

const cors = require('cors')({
    origin: true,
});


exports.newPedido = functions.firestore
    .document('/Clientes/{userId}/pedidos/{pedidoId}')
    .onCreate( async (event) => {

        const pedido = event.data();
        console.log('newPedido ejecutado');



        const path = '/Clientes/' + uidAdmin;

        const docInfo = await firestore.doc(path).get();
        const dataUser = docInfo.data() as any;
        const token = dataUser.token;

        const registrationTokens = [token];

        const dataFcm = {
            enlace: '/pedidos',
        }

        const notification: INotification = {
            data: dataFcm,
            tokens: registrationTokens,
            notification: {
                title: pedido.cliente.nombre,
                body: 'Nuevo pedido: ' + pedido.precioTotal + '$'
            },
        }

        return sendNotification(notification);
   
        

});


exports.eventPedido = functions.firestore
    .document('/Clientes/{userId}/pedidos/{pedidoId}')
    .onUpdate( async (event, eventContext) => {



        const userUid = eventContext.params.userId;
        const pedido = event.after.data();
 
        const dataFcm = {
            enlace: '/mis-pedidos',
        }

        const path = '/Clientes/' + userUid;
        const docInfo = await  firestore.doc(path).get();
        const dataUser = docInfo.data() as any;
        const token = dataUser.token;
        const registrationTokens = [token];

        const notification: INotification = {
            data: dataFcm,
            tokens: registrationTokens,
            notification: {
                title: 'Seguimiento de tu pedido',
                body: 'Pedido ' +  pedido.estado,
            },
        }

        return  sendNotification(notification);
   
        

    });








const sendNotification = (notification: INotification) => {

        return new Promise((resolve) => {
    
            const message: admin.messaging.MulticastMessage = {
                data: notification.data,
                tokens: notification.tokens,
                notification: notification.notification,
                android: {
                    notification: {
                        icon: 'ic_stat_name',
                        color: '#EB9234',
                    } 
                },
                apns: {
                    payload: {
                        aps: {
                            sound: {
                                critical: true,
                                name: 'default',
                                volume: 1,
                            }
                        }
                    }
                }
            
            }
    
            console.log('List of tokens send', notification.tokens);
    
            admin.messaging().sendMulticast(message)
            .then((response) => {
                if (response.failureCount > 0) {
                    const failedTokens: any[] = [];
                    response.responses.forEach((resp, idx) => {
                        if (!resp.success) {
                        failedTokens.push(notification.tokens[idx]);
                        }
                    });
                    console.log('List of tokens that caused failures: ' + failedTokens);
                    // elimnar tokens 
                } else {
                    console.log('Send notification exitoso -> ')
                }
                resolve(true);
                return;
            }).catch( error => {
               console.log('Send fcm falló -> ', error)
               resolve(false);
               return;
            }); 
    
        });
     
} 


export const newNotification = functions.https.onRequest((request, response) => {

    
    return cors(request, response, async () => {

            if(request.body.data) {  
      
                const notification = request.body.data as INotification;
                await sendNotification(notification)
                const res: Res = {
                    respuesta: 'successieo',
                };
                response.status(200).send(res);    
            } else {
                const res = {
                    respuesta: 'error'
                };
                response.status(200).send(res);
            }

    });


});


exports.cadacincomin = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
    console.log('si cada 5 min!');
    
    return null;
});



interface Res {
    respuesta: string;
}


interface INotification {
    data: any;
    tokens: string[];
    notification: admin.messaging.Notification;
}
