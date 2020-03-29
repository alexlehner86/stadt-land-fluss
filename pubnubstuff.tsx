// const sendGameData = () => {
//     pubNubClient.publish(
//         {
//             channel: channels[0],
//             message: 'Infos über SLF-Spielerunde',
//         }
//     );
// }

/* <button
onClick={e => {
    e.preventDefault();
    sendGameData();
}}
>
Send Game Data
</button> */

// const [messages, addMessage] = useState<string[]>([]);
// const [message, setMessage] = useState<string>('');

// const sendMessage = (message: string) => {
//     pubNubClient.publish(
//         {
//             channel: channels[0],
//             message,
//         },
//         () => setMessage('')
//     );
// };

// <PubNubConsumer>
//     {client => {
//         client.addListener({
//             status: statusEvent => {
//                 console.log('statusEvent', statusEvent);
//                 if (statusEvent.category === 'PNConnectedCategory') {
//                     var newState = {
//                         name: 'presence-tutorial-user-' + (Math.random() * 5000),
//                         timestamp: new Date()
//                     };
//                     pubNubClient.setState(
//                         {
//                             channels,
//                             state: newState
//                         }
//                     );
//                 }
//             },
//             // message: messageEvent => {
//             //     addMessage([...messages, messageEvent.message]);
//             // },
//             presence: presenceEvent => {
//                 console.log('presenceEvent', presenceEvent);
//                 if (presenceEvent.action === 'join') {
//                     pubNubClient.history(
//                         {
//                             channel: channels[0],
//                             count: 10
//                         },
//                         (status, response) => {
//                             console.log('Aktueller Status:', status);
//                             console.log('Bisherige Messages:', response);
//                         }
//                     );
//                 }
//             }
//         });
//         client.subscribe({ channels, withPresence: true });
//         return '';
//     }}
// </PubNubConsumer>