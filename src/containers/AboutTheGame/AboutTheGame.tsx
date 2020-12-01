import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';

import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import ToDashboardButton from '../../components/ToDashboardButton/ToDashboardButton';

class AboutTheGame extends Component<RouteComponentProps> {
    public render() {
        return (
            <div className="main-content-wrapper">
                <div className="material-card-style slf-article-container">
                    <SectionHeader text="Über das Spiel"></SectionHeader>
                    <p>
                        Das Spiel <span>Stadt-Land-Fluss (MALEX-Edition)</span> ist ein Kind des ersten Corona-Lockdowns im Frühjahr 2020.
                        Quasi in den eigenen vier Wänden eingesperrt hielten mein Partner und ich den Kontakt zu Freunden und Familie
                        online aufrecht. Da wir mit dem Angebot an Online-Versionen von Stadt-Land-Fluss unzufrieden waren, habe ich
                        einfach eine eigene Version programmiert.
                    </p>
                    <p>
                        Der Zusatz <span>MALEX-Edition</span> ist eine Wortverschränkung von
                        „Martin“ (der Name meines Partners) und „Alex“ (mein Name). Danke Hase für deine tollen Ideen, deine Unterstützung
                        und Geduld. Ohne dich würde es das Spiel nicht geben!
                    </p>
                </div>
                <ToDashboardButton onReturnToDashboard={this.returnToDashboard} />
            </div>
        );
    }

    private returnToDashboard = () => {
        this.props.history.push('/');
    }
}

export default AboutTheGame;
