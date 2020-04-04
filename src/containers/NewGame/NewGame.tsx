import './NewGame.css';
import React, { ChangeEvent, Component } from 'react';

interface NewGameState {
    inputText: string;
}

export class NewGame extends Component<any, NewGameState> {
    public state: NewGameState = {
        inputText: ''
    };

    public render() {
        return (
            <div>
                <p>Einem Spiel beitreten</p>
                <input type="text" value={this.state.inputText} onChange={this.inputChangeHandler} />
            </div>
        );
    }

    private inputChangeHandler = (event: ChangeEvent) => {
        this.setState({ inputText: (event.target as any).value });
    }
}
