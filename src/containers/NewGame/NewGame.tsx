import './NewGame.css';
import React, { ChangeEvent, Component } from 'react';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';

interface NewGameState {
    inputText: string;
}

export class NewGame extends Component<any, NewGameState> {
    public state: NewGameState = {
        inputText: ''
    };

    public render() {
        return (
            <div className="new-game-container material-card-style">
                <SectionHeader text="Neues Spiel starten"></SectionHeader>
                Dein Name:&nbsp;
                <input type="text" value={this.state.inputText} onChange={this.inputChangeHandler} />
                <br />
                Kategorien auswählen: (TODO)
            </div>
        );
    }

    private inputChangeHandler = (event: ChangeEvent) => {
        this.setState({ inputText: (event.target as any).value });
    }
}
