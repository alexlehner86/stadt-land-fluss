import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import BrushIcon from '@material-ui/icons/Brush';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import FlipCameraAndroidIcon from '@material-ui/icons/FlipCameraAndroid';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import StarIcon from '@material-ui/icons/Star';
import ThumbDownRoundedIcon from '@material-ui/icons/ThumbDownRounded';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import ToDashboardButton from '../../components/ToDashboardButton/ToDashboardButton';
import { EXTRA_POINTS, GAME_OPTION_LABEL, STANDARD_POINTS } from '../../constants/game.constant';
import styles from './GameManual.module.css';

class GameManual extends Component<RouteComponentProps> {
    public render() {
        return (
            <div className="main-content-wrapper">
                <div className="material-card-style slf-article-container">
                    <SectionHeader text="Spielanleitung"></SectionHeader>
                    <p>
                        Willkommen bei{' '}
                        <RouterLink to="/about">Stadt-Land-Fluss (MALEX-Edition)</RouterLink>,
                        einer modernen Version des{' '}
                        <a
                            href="https://de.wikipedia.org/wiki/Stadt,_Land,_Fluss"
                            target="_blank"
                            rel="noopener noreferrer"
                        >Spiele-Klassikers</a>
                        {' '}mit neuen, lustigen Kategorien.
                    </p>
                    <h3>Allgemeines</h3>
                    <p>
                        Im Dashboard (Startseite) kann man über <span>Neues Spiel</span> ein neues Spiel erstellen bzw. über <span>Spiel
                        beitreten</span> einem bereits erstellten Spiel beitreten. Die Webseite bietet fünf verschiedene Designs zur
                        Auswahl. Das aktuelle Design kann über den <BrushIcon fontSize="small" className={styles.inline_icon} />
                        <span className="sr-only">Design ändern</span>-Button (rechts oben im zentralen Bild) geändert werden.
                        Die Design-Auswahl sowie der zuletzt gewählte Spielername werden vom Browser gespeichert.
                    </p>
                    <h3>Neues Spiel</h3>
                    <p>
                        Um ein neues Spiel zu erstellen, muss der Nutzer einen Spielernamen eingeben, die Anzahl der zu spielenden
                        Runden festlegen, einen Spielmodus auswählen und mindestens drei Kategorien bestimmen.
                    </p>
                    <p>
                        Es stehen 45 Kategorien zur Auswahl, darunter Klassiker wie <span>Stadt</span>, <span>Land</span> und{' '}
                        <span>Fluss/Gewässer</span>, jedoch auch neue Kategorien wie <span>Könnte ein Trump-Tweet sein</span>.
                        Der <FlipCameraAndroidIcon fontSize="small" className={styles.inline_icon} />
                        <span className="sr-only">Kategorien zufällig auswählen</span>-Button öffnet einen Dialog, über den eine
                        Zufallsauswahl an Kategorien erstellt werden kann.
                        Über den <AddCircleOutlineIcon fontSize="small" className={styles.inline_icon} />
                        <span className="sr-only">Eigene Kategorie definieren</span>-Button am Ende der <span>Ausgewählte Kategorien</span>-Liste
                        lässt sich auch jede beliebige, weitere Kategorie definieren und für das Spiel auswählen.
                    </p>
                    <p>
                        Standardmäßig ist die Option vorausgewählt, dass eine Runde von allen Spielenden gemeinsam beendet wird.
                        Das bedeutet, dass jeder Spieler manuell seine Antworten abschicken muss, damit die aktuelle Runde endet.
                        Beim Spielmodus <span>Schnellster Spieler</span> wird eine Runde von jenem Spieler beendet, der als erstes
                        alle Kategorien beantwortet hat und diese abschickt. Bei der dritten Option <span>Countdown</span> wird
                        eine fixe Rundendauer in Sekunden gewählt.
                    </p>
                    <p>
                        Im Bereich <span>Weitere Optionen</span> können optional weitere Einstellungen vorgenommen werden.
                        Der Nutzer kann bestimmen, welche Buchstaben ausgeschlossen werden sollen. Standardmäßig sind
                        hier Q, X und Y ausgewählt. Weiters stehen drei zusätzliche <span>Regeln für die Punktevergabe</span> zur
                        Auswahl, die standardmäßig ausgewählt sind:
                    </p>
                    <ul>
                        <li>{GAME_OPTION_LABEL.checkForDuplicates}</li>
                        <li>{GAME_OPTION_LABEL.onlyPlayerWithValidAnswer}</li>
                        <li>{GAME_OPTION_LABEL.creativeAnswersExtraPoints}</li>
                    </ul>
                    <p>
                        Nach einem Klick auf <span>Spiel erstellen</span> gelangt der Nutzer zur Spiel-Übersicht, wo alle Einstellungen
                        für das erstellte Spiel sowie die bisher dem Spiel beigetretenen Mitspieler sichtbar sind. Zu Beginn ist nur der
                        Nutzer, der das Spiel erstellt hat, als Administrator in der Mitspieler-Liste sichtbar. Es müssen mindestens zwei
                        Spieler an einem Spiel teilnehmen, damit dieses starten kann. Unten auf der Seite wird dem Administrator ein Link
                        zum Teilen mit Freunden angeboten. Ein Klick auf den <FileCopyIcon fontSize="small" className={styles.inline_icon} />
                        <span className="sr-only">Link zum Spiel kopieren</span>-Button rechts vom Link kopiert diesen in die Zwischenablage.
                        Über diesen Link gelangen andere Mitspieler direkt zur <span>Spiel beitreten</span>-Seite, wo das Feld Spiel-ID
                        bereits vorausgefüllt wird.
                    </p>
                    <h3>Spiel beitreten</h3>
                    <p>
                        Um einem bereits erstellten Spiel beizutreten, muss der Nutzer einen Spielernamen sowie die Spiel-ID eingeben.
                        Die Spiel-ID erhält der Nutzer von einem anderen Mitspieler bzw. sie wird von der Webseite automatisch in das
                        Feld eingetragen, wenn der Nutzer dem Link des Administrators gefolgt ist.
                    </p>
                    <h3>Spielablauf</h3>
                    <p>
                        Nachdem der Spiel-Administrator das Spiel gestartet hat, läuft jede Runde folgendermaßen ab:
                    </p>
                    <ol>
                        <li>Eine kurze Animation offenbart den Buchstaben für die neue Runde.</li>
                        <li>
                            Die Runde startet: Jeder Spieler sieht eine Liste an Eingabefeldern, eines pro Kategorie,
                            zum Eintragen der Begriffe bzw. Phrasen.
                        </li>
                        <li>
                            Abhängig vom gewählten Spielmodus endet die Runde, sobald alle Spieler bzw. der erste Spieler auf den Abschicken-Button
                            rechts unten auf der Seite geklickt hat oder wenn die festgelegte Rundendauer abgelaufen ist.
                        </li>
                        <li>
                            Nachdem die Runde beendet ist, wird jedem Spieler eine Übersicht aller Antworten aller Spieler pro
                            Kategorie angezeigt. Folgende Informationen und Aktionen stehen zur Verfügung:
                            <ul className={styles.nested_list}>
                                <li>
                                    Zu jeder Antwort wird die aktuell ermittelte Punktzahl angezeigt. Grundsätzlich zählt eine gültige
                                    Antwort {STANDARD_POINTS} Punkte, außer die gewählten Regeln besagen etwas anderes. Falls ein
                                    Spieler in ein Feld nichts eingetragen hat, wird dieses automatisch als 0 Punkte gewertet.
                                </li>
                                <li>
                                    Der <SearchIcon fontSize="small" className={styles.inline_icon} />
                                    <span className="sr-only">Begriff nachschlagen</span>-Link öffnet die Suchmaschine Ecosia in einem
                                    neuen Tab und führt automatisch eine Suche nach der Kategorie plus Antwort des Spielers durch.
                                </li>
                                <li>
                                    Mit dem <StarIcon fontSize="small" className={styles.inline_icon} />
                                    <span className="sr-only">Kreativ-Stern verleihen</span>-Button können Antworten von Mitspielern
                                    als besonders kreativ ausgezeichnet werden. Die dadurch verliehenen Kreativ-Sterne werden addiert
                                    und bringen zusätzlich {EXTRA_POINTS} Punkte pro Stern, falls diese Regel aktiv ist.
                                </li>
                                <li>
                                    Über den <ThumbDownRoundedIcon fontSize="small" className={styles.inline_icon} />
                                    <span className="sr-only">Antwort ablehnen</span>-Button können die Spieler konkrete Antworten
                                    ablehnen. Abhängig von der Spieleranzahl führt dies dazu, dass der jeweilige Spieler keine Punkte
                                    für die Antwort erhält. Bei zwei bis drei Spielern reicht die Ablehnung durch einen Mitspieler aus.
                                    Bei mehr als drei Spielern müssen mindesten zwei Spieler eine Antwort ablehnen. Die Ablehnung einer
                                    Antwort kann durch erneutes Klicken auf den Button wieder zurückgezogen werden.
                                </li>
                            </ul>
                        </li>
                        <li>
                            Über den Bestätigen-Button rechts unten auf der Seite muss ein Spieler signalisieren, dass sie oder er
                            mit der Analyse der Antworten fertig und bereit für die nächste Runde ist. Erst wenn alle Spieler den
                            Button geklickt haben, startet die nächste Runde (siehe Schritt 1) bzw. endet das Spiel.
                        </li>
                    </ol>
                    <p>
                        Hinweis für Screenreader-Nutzer: Das Spiel ist so gestaltet, dass man mithilfe der Tabulatortaste schnell
                        navigieren und die wichtigsten Elemente erreichen kann. Das trifft einerseits auf die Eingabefelder und
                        Schaltflächen zu, aber auch auf die einzelnen Antworten in der Auswertungsphase einer Runde. Wenn ein
                        Nutzer mit der Tabulatortaste zu einer Antwort springt, wird der Spielername, die Antwort, ihr aktueller
                        Status (akzeptiert oder abgelehnt) sowie die Punktezahl vorgelesen.
                    </p>
                    <h3>Weitere Optionen</h3>
                    <p>
                        Falls ein Mitspieler aus irgendeinem Grund (Browserabsturz, Akku leer etc.) aus dem Spiel fliegt, kann
                        sie oder er über den <span>Zurück ins laufende Spiel-Button</span> wieder ins Spiel zurückkehren. Dieser findet
                        sich auf der Startseite.
                        </p>
                    <p>
                        Der oder die Administrator/in hat in einem laufenden Spiel die Möglichkeit, über
                        den <SettingsIcon fontSize="small" className={styles.inline_icon} />
                        <span className="sr-only">Administrator-Optionen</span>-Button (rechts oben bzw. auf Mobilgeräten ganz unten)
                        andere Spieler aus dem Spiel zu werfen. Das ist natürlich nur als letztes Mittel gedacht, um ein begonnenes
                        Spiel beenden zu können. Darüber hinaus kann über die Menü-Option &bdquo;Gleiche Antworten markieren&rdquo;
                        ein Dialog geöffnet werden, der die manuelle Markierung von gleichen Antworten pro Kategorie ermöglicht.
                    </p>
                    <h3>Spielende</h3>
                    <p>
                        Am Ende des Spiels gelangt der Nutzer auf die <span>Ergebnisseite</span>, wo ein Ranking der Mitspieler nach
                        erzielten Punkten sowie die Details zum Spiel (Buchstaben, Anzahl Runden, Kategorien etc.) dargestellt werden.
                    </p>
                    <p>
                        Der Button <span>Alle Runden im Detail</span> öffnet einen Dialog, in dem alle Runden des beendeten Spiels
                        im Detail (Antworten, Punkte etc.) dargestellt werden. Falls während des Spiels einzelne Antworten als besonders
                        kreativ ausgezeichnet wurden, so kann man über den <span>Hall of Fame</span>-Button einen Dialog öffnen,
                        der eine Liste mit allen Antworten anzeigt.
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

export default GameManual;
