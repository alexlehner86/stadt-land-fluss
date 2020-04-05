import './Dashboard.css';
import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';

export class Dashboard extends Component {
    public render() {
        return (
            <div className="dashboard-container material-card-style">
                <SectionHeader text="Dashboard"></SectionHeader>
                <div className="link-container">
                    <Link component={RouterLink} to="/newgame">Neues Spiel starten</Link>
                    <Link component={RouterLink} to="/joingame">Spiel beitreten</Link>
                </div>
            </div>
        );
    }
}
