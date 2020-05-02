import './Dashboard.css';
import Link from '@material-ui/core/Link';
import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import { connect } from 'react-redux';
import { AppState } from '../../store/app.reducer';

interface DashboardPropsFromStore {
    gameId: string | null;
}
class Dashboard extends Component<DashboardPropsFromStore> {
    public render() {
        return (
            <div className="main-content-wrapper">
                <div className="dashboard-container material-card-style">
                    <SectionHeader showDivider={true} text="Dashboard"></SectionHeader>
                    <div className="link-container">
                        <Link component={RouterLink} to="/newgame">Neues Spiel</Link>
                        <Link component={RouterLink} to="/joingame">Spiel beitreten</Link>
                        {this.props.gameId ? <Link component={RouterLink} to="/play">Zurück ins laufende Spiel</Link> : null}
                    </div>
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/city-country-river.jpg`}
                        alt="Stadt, Land, Fluss"
                        className="dashboard-slf-image"
                    />
                    <div className="img-copyright">
                        <h3>Credits/Bilder</h3>
                        <a href="https://www.vecteezy.com/vector-art/830131-river-city-landscape-with-buildings-hills-and-trees" target="_blank" rel="noopener noreferrer">Homepage/Stadt-Land-Fluss by pikgura – www.vecteezy.com</a>
                        <a href="https://www.vecteezy.com/vector-art/276920-abstract-seamless-pattern-with-tropical-leaves" target="_blank" rel="noopener noreferrer">Theme Grün/Wald by NadiaGrapes – www.vecteezy.com</a>
                        <a href="https://www.freepik.com/free-photos-vectors/background" target="_blank" rel="noopener noreferrer">Theme Blau/Meer by macrovector – www.freepik.com</a>
                        <a href="https://www.vecteezy.com/vector-art/460735-seashell-sand-seamless-pattern" target="_blank" rel="noopener noreferrer">Theme Orange/Strand by Macrovector – www.vecteezy.com</a>
                        <a href="https://www.vecteezy.com/vector-art/454258-music-seamless" target="_blank" rel="noopener noreferrer">Theme Pink/Musik by Macrovector – www.vecteezy.com</a>
                        <a href="https://www.vecteezy.com/vector-art/662038-cat-and-bat-pattern" target="_blank" rel="noopener noreferrer">Theme Schwarz/Goth by angyee – www.vecteezy.com</a>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState): DashboardPropsFromStore => {
    return {
        gameId: state.gameId
    };
}
export default connect(mapStateToProps)(Dashboard);
