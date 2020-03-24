import './App.css';
import PubNub from 'pubnub';
import { PubNubConsumer, PubNubProvider } from 'pubnub-react';
import React, { useState } from 'react';
import { PUBNUB_CONFIG } from './config/pubnub.config';

const pubNubClient = new PubNub(PUBNUB_CONFIG);
const channels = ['awesomeChannel12345'];

const sendGameData = () => {
    pubNubClient.publish(
        {
            channel: channels[0],
            message: 'Infos über SLF-Spielerunde',
        }
    );
}

function App() {
    const [messages, addMessage] = useState<string[]>([]);
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
    return (
        <PubNubProvider client={pubNubClient}>
            <div className="app-container">
                <PubNubConsumer>
                    {client => {
                        client.addListener({
                            status: statusEvent => {
                                console.log('statusEvent', statusEvent);
                                if (statusEvent.category === 'PNConnectedCategory') {
                                    var newState = {
                                        name: 'presence-tutorial-user-' + (Math.random() * 5000),
                                        timestamp: new Date()
                                    };
                                    pubNubClient.setState(
                                        {
                                            channels,
                                            state: newState
                                        }
                                    );
                                }
                            },
                            message: messageEvent => {
                                addMessage([...messages, messageEvent.message]);
                            },
                            presence: presenceEvent => {
                                console.log('presenceEvent', presenceEvent);
                                if (presenceEvent.action === 'join') {
                                    pubNubClient.history(
                                        {
                                            channel: channels[0],
                                            count: 10
                                        },
                                        (status, response) => {
                                            console.log('Aktueller Status:', status);
                                            console.log('Bisherige Messages:', response);
                                        }
                                    );
                                }
                            }
                        });
                        client.subscribe({ channels, withPresence: true });
                        return '';
                    }}
                </PubNubConsumer>
                <header className="app-header">
                    <h1>Stadt-Land-Fluss (Malex-Edition)</h1>
                </header>
                <main className="app-main">
                    Content...
                    <button
                        onClick={e => {
                            e.preventDefault();
                            sendGameData();
                        }}
                    >
                        Send Game Data
                    </button>
                </main>
            </div>
        </PubNubProvider>
    );
}

export default App;

// <div
//     style={{
//         width: '500px',
//         height: '300px',
//         border: '1px solid black',
//     }}
// >
//     <div style={{ backgroundColor: 'grey' }}>React Chat Example</div>
//     <div
//         style={{
//             backgroundColor: 'white',
//             height: '260px',
//             overflow: 'scroll',
//         }}
//     >
//         {messages.map((message, messageIndex) => {
//             return (
//                 <div
//                     key={`message-${messageIndex}`}
//                     style={{
//                         display: 'inline-block',
//                         float: 'left',
//                         backgroundColor: '#eee',
//                         color: 'black',
//                         borderRadius: '20px',
//                         margin: '5px',
//                         padding: '8px 15px',
//                     }}
//                 >
//                     {message}
//                 </div>
//             );
//         })}
//     </div>
//     <div
//         style={{
//             display: 'flex',
//             height: '40px',
//             backgroundColor: 'lightgrey',
//         }}
//     >
//         <input
//             type="text"
//             style={{
//                 borderRadius: '5px',
//                 flexGrow: 1,
//                 fontSize: '18px',
//             }}
//             placeholder="Type your message"
//             value={message}
//             onChange={e => console.log(e)}
//         // onChange={e => setMessage(e.target.value)}
//         />
//         <button
//             style={{
//                 backgroundColor: 'blue',
//                 color: 'white',
//                 borderRadius: '5px',
//                 fontSize: '16px',
//             }}
//             onClick={e => {
//                 e.preventDefault();
//                 sendMessage(message);
//             }}
//         >
//             Send Message
//         </button>
//     </div>
// </div>