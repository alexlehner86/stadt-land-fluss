import './JoinGame.css';
import React, { ChangeEvent, Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';

interface JoinGameState {
    idInput: string;
    nameInput: string;
}

export class JoinGame extends Component<RouteComponentProps, JoinGameState> {
    public state: JoinGameState = {
        idInput: '',
        nameInput: ''
    };

    public render() {
        return (
            <div className="join-game-container material-card-style">
                <SectionHeader text="Spiel beitreten"></SectionHeader>
                ID des Spiels:&nbsp;
                <input type="text" value={this.state.idInput} onChange={this.idInputChangeHandler} />
                Dein Name:&nbsp;
                <input type="text" value={this.state.nameInput} onChange={this.nameInputChangeHandler} />
            </div>
        );
    }

    public componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        if (query.has('id')) {
            this.setState({ idInput: query.get('id') as string });
        }
    }

    private idInputChangeHandler = (event: ChangeEvent) => {
        this.setState({ idInput: (event.target as any).value });
    }

    private nameInputChangeHandler = (event: ChangeEvent) => {
        this.setState({ nameInput: (event.target as any).value });
    }
}
