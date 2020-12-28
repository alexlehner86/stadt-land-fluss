import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import ToDashboardButton from '../../components/ToDashboardButton/ToDashboardButton';

class AboutTheGame extends Component<RouteComponentProps> {
    public render() {
        return (
            <div className="main-content-wrapper">
                <div className="material-card-style slf-article-container">
                    <SectionHeader text="Über das Spiel"></SectionHeader>
                    <h3>Vorgeschichte</h3>
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
                    <h3>Über den Autor</h3>
                    <p>
                        Ich bin ein Web-Developer aus Wien und spiele leidenschaftlich gerne Spiele, seien es Karten-, Brett- oder
                        Videospiele. Als <span lang="en">Certified Web Accessibility Expert</span> beschäftige ich mich intensiv mit
                        dem Thema Barrierefreiheit. Daher war es mir ein Anliegen, diese Online-Version von Stadt-Land-Fluss so
                        barrierefrei wie möglich zu gestalten. Mehr über mich und meine Projekte erfahrt ihr auf meiner{' '}
                        <a
                            href="https://github.com/alexlehner86"
                            target="_blank"
                            rel="noopener noreferrer"
                        >Github-Seite</a>.
                    </p>
                    <h3>Barrierefreiheit</h3>
                    <p>
                        Siehe <RouterLink to="/accessibility">Barrierefreiheitserklärung</RouterLink>.
                    </p>
                    <h3>Datenschutz</h3>
                    <p>
                        Es werden keine personenbezogenen Daten verarbeitet und generell keine Cookies gespeichert.
                        Die Design-Auswahl, der zuletzt gewählte Spielername sowie die Daten eines laufenden Spiels
                        (Spieleinstellungen, Antworten der Spieler etc.) werden im{' '}
                        <a
                            href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"
                            target="_blank"
                            rel="noopener noreferrer"
                            lang="en"
                        >Local Storage</a>
                        {' '}des Browsers gespeichert. Letzteres dient dazu, ein laufendes Spiel wiederherstellen zu
                        können, falls der Nutzer z.B. das Browserfenster schließt.
                    </p>
                    <h3>Copyright-Hinweise</h3>
                    <ul>
                        <li>
                            <a
                                href="https://www.vecteezy.com/vector-art/830131-river-city-landscape-with-buildings-hills-and-trees"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Illustration „Stadt-Land-Fluss“ von pikgura – www.vecteezy.com
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.vecteezy.com/vector-art/276920-abstract-seamless-pattern-with-tropical-leaves"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Design „Grün/Wald“ von NadiaGrapes – www.vecteezy.com
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.freepik.com/free-photos-vectors/background"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Design „Blau/Meer“ von macrovector – www.freepik.com
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.vecteezy.com/vector-art/460735-seashell-sand-seamless-pattern"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Design „Orange/Strand“ von Macrovector – www.vecteezy.com
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.vecteezy.com/vector-art/454258-music-seamless"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Design „Pink/Musik“ von Macrovector – www.vecteezy.com
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.vecteezy.com/vector-art/662038-cat-and-bat-pattern"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Design „Schwarz/Goth“ von Patipat Paipew – www.vecteezy.com
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.vecteezy.com/vector-art/92765-first-place-trophy-vector-icons"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Spielergebnis/Pokal-Illustrationen von Miguel Angel – www.vecteezy.com
                            </a>
                        </li>
                    </ul>
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
