import './App.css';
import PubNub from 'pubnub';
import { PubNubConsumer, PubNubProvider } from 'pubnub-react';
import React, { useState } from 'react';
import { PUBNUB_CONFIG } from './config/pubnub.config';

const pubNubClient = new PubNub(PUBNUB_CONFIG);
const channels = ['awesomeChannel'];

function App() {
    const [messages, addMessage] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');

    const sendMessage = (message: string) => {
        pubNubClient.publish(
            {
                channel: channels[0],
                message,
            },
            () => setMessage('')
        );
    };
    return (
        <PubNubProvider client={pubNubClient}>
            <div className="app-container">
                <header className="app-header">
                    <h1>Stadt-Land-Fluss (Malex-Edition)</h1>
                    <PubNubConsumer>
                        {client => {
                            client.addListener({
                                message: messageEvent => {
                                    addMessage([...messages, messageEvent.message]);
                                },
                            });
                            client.subscribe({ channels });
                            return '';
                        }}
                    </PubNubConsumer>
                </header>
                <main className="app-main">
                    <div
                        style={{
                            width: '500px',
                            height: '300px',
                            border: '1px solid black',
                        }}
                    >
                        <div style={{ backgroundColor: 'grey' }}>React Chat Example</div>
                        <div
                            style={{
                                backgroundColor: 'white',
                                height: '260px',
                                overflow: 'scroll',
                            }}
                        >
                            {messages.map((message, messageIndex) => {
                                return (
                                    <div
                                        key={`message-${messageIndex}`}
                                        style={{
                                            display: 'inline-block',
                                            float: 'left',
                                            backgroundColor: '#eee',
                                            color: 'black',
                                            borderRadius: '20px',
                                            margin: '5px',
                                            padding: '8px 15px',
                                        }}
                                    >
                                        {message}
                                    </div>
                                );
                            })}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                height: '40px',
                                backgroundColor: 'lightgrey',
                            }}
                        >
                            <input
                                type="text"
                                style={{
                                    borderRadius: '5px',
                                    flexGrow: 1,
                                    fontSize: '18px',
                                }}
                                placeholder="Type your message"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                            />
                            <button
                                style={{
                                    backgroundColor: 'blue',
                                    color: 'white',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                }}
                                onClick={e => {
                                    e.preventDefault();
                                    sendMessage(message);
                                }}
                            >
                                Send Message
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </PubNubProvider>
    );
}

export default App;
