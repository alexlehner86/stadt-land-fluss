import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import BrushIcon from '@material-ui/icons/Brush';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
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
import {
    AVAILABLE_CATEGORIES,
    EXTRA_POINTS,
    GAME_OPTION_LABEL,
    STANDARD_CATEGORIES,
    STANDARD_POINTS,
} from '../../constants/game.constant';
import { ALL_PLAYERS_TOGETHER, FASTEST_PLAYER } from '../../constants/text.constant';
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
                    <h3>Neues Spiel erstellen</h3>
                    <p>
                        Um ein neues Spiel zu erstellen, muss man einen Spielernamen eingeben, die Anzahl der zu spielenden
                        Runden festlegen, einen Spielmodus auswählen und mindestens drei Kategorien bestimmen.
                    </p>
                    <p>
                        Es stehen {STANDARD_CATEGORIES.length + AVAILABLE_CATEGORIES.length} Kategorien zur Auswahl, darunter
                        Klassiker wie <span>Stadt</span>, <span>Land</span> und <span>Fluss/Gewässer</span>, jedoch auch neue
                        Kategorien wie <span>Scheidungsgrund</span>.
                        Der <FlipCameraAndroidIcon fontSize="small" className={styles.inline_icon} />
                        <span className="sr-only">Kategorien zufällig auswählen</span>-Button öffnet einen Dialog, über den eine
                        Zufallsauswahl an Kategorien erstellt werden kann.
                        Über den <AddCircleOutlineIcon fontSize="small" className={styles.inline_icon} />
                        <span className="sr-only">Eigene Kategorie definieren</span>-Button am Ende der <span>Ausgewählte Kategorien</span>-Liste
                        lässt sich auch jede beliebige, weitere Kategorie definieren und für das Spiel auswählen.
                    </p>
                    <p>
                        Standardmäßig ist die Option <span>{ALL_PLAYERS_TOGETHER}</span> vorausgewählt. Das bedeutet, dass alle
                        manuell ihre Antworten abschicken müssen, damit die aktuelle Runde endet.
                        Beim Spielmodus <span>{FASTEST_PLAYER}</span> wird eine Runde von jener Person beendet, die als erste
                        alle Kategorien beantwortet hat und diese abschickt. Bei der dritten Option <span>Countdown</span> wird
                        eine fixe Rundendauer in Sekunden gewählt.
                    </p>
                    <p>
                        Im Bereich <span>Weitere Optionen</span> können optionale Einstellungen vorgenommen werden. Man kann bestimmen,
                        welche Buchstaben ausgeschlossen werden sollen (Q, X und Y sind vorausgewählt). Weiters stehen drei
                        vorausgewählte <span>Regeln für die Punktevergabe</span> zur Auswahl:
                    </p>
                    <ul>
                        <li>{GAME_OPTION_LABEL.checkForDuplicates}</li>
                        <li>{GAME_OPTION_LABEL.onlyPlayerWithValidAnswer}</li>
                        <li>{GAME_OPTION_LABEL.creativeAnswersExtraPoints}</li>
                    </ul>
                    <p>
                        Nach einem Klick auf <span>Spiel erstellen</span> gelangt man zur Spiel-Übersicht, wo alle Einstellungen für das
                        erstellte Spiel sowie die bisher beigetretenen Spielerinnen und Spieler sichtbar sind. Zu Beginn scheint man
                        nur selbst, gekennzeichnet als Admin, in der Liste auf. Es müssen mindestens zwei Personen an einem
                        Spiel teilnehmen, damit dieses starten kann.
                    </p>
                    <h3>Spiel beitreten</h3>
                    <p>
                        Um einem bereits erstellten Spiel beizutreten, muss man einen Spielernamen sowie die Spiel-ID eingeben. Diese ID
                        wird automatisch generiert, wenn jemand ein neues Spiel erstellt. Die Teilnahme ist nur dann möglich, wenn das
                        Spiel noch nicht gestartet wurde.
                    </p>
                    <p>
                        Als Admin sollte man die Spiel-ID oder den angezeigten Link teilen, um Freunde ins Spiel einzuladen.
                        Ein Klick auf den <FileCopyIcon fontSize="small" className={styles.inline_icon} />
                        <span className="sr-only">Link zum Spiel kopieren</span>-Button kopiert den Link in die Zwischenablage.
                        Über diesen Link gelangt man direkt zur <span>Spiel beitreten</span>-Seite, wo die Spiel-ID von der
                        Webseite automatisch in das Eingabefeld eingetragen wird.
                    </p>
                    <h3>Spielablauf</h3>
                    <p>
                        Nur die Administratorin oder der Administrator kann das Spiel starten. Jede Runde läuft folgendermaßen ab:
                    </p>
                    <ol>
                        <li>Eine kurze Animation offenbart den Buchstaben für die neue Runde.</li>
                        <li>
                            Es erscheint eine Liste an Eingabefeldern, eines pro Kategorie, zum Eintragen der Begriffe bzw.
                            Phrasen.
                        </li>
                        <li>
                            Die Runde endet abhängig vom gewählten Spielmodus (siehe oben).
                        </li>
                        <li>
                            In der Auswertungsphase wird den Spielenden eine Übersicht aller Antworten sortiert nach Kategorie
                            angezeigt. Folgende Informationen und Aktionen stehen zur Verfügung:
                            <ul className={styles.nested_list}>
                                <li>
                                    Zu jeder Antwort wird die aktuell ermittelte Punktzahl angezeigt. Eine gültige Antwort
                                    zählt {STANDARD_POINTS} Punkte, außer die gewählten Regeln besagen etwas anderes. Falls eine
                                    Person in ein Feld nichts eingetragen hat, wird dieses automatisch als 0 Punkte gewertet.
                                </li>
                                <li>
                                    Der <SearchIcon fontSize="small" className={styles.inline_icon} />
                                    <span className="sr-only">Begriff nachschlagen</span>-Link öffnet die Suchmaschine Ecosia in einem
                                    neuen Tab und führt automatisch eine Suche nach der Kategorie plus Antwort durch.
                                </li>
                                <li>
                                    Mit dem <StarIcon fontSize="small" className={styles.inline_icon} />
                                    <span className="sr-only">Kreativ-Stern verleihen</span>-Button können Antworten von anderen Personen
                                    als besonders kreativ ausgezeichnet werden. Die dadurch verliehenen Kreativ-Sterne werden addiert
                                    und bringen zusätzlich {EXTRA_POINTS} Punkte pro Stern, falls diese Regel aktiv ist.
                                </li>
                                <li>
                                    Über den <ThumbDownRoundedIcon fontSize="small" className={styles.inline_icon} />
                                    <span className="sr-only">Antwort ablehnen</span>-Button können die Spielerinnen und Spieler konkrete
                                    Antworten ablehnen. Abhängig von der Anzahl der Spielenden führt dies dazu, dass die betroffene Person keine
                                    Punkte für ihre Antwort erhält. Bei zwei bis drei Spielenden reicht die Ablehnung durch eine Person aus.
                                    Bei mehr als drei Spielenden müssen mindesten zwei Personen eine Antwort ablehnen. Die Ablehnung einer
                                    Antwort kann durch erneutes Klicken auf den Button wieder zurückgezogen werden.
                                </li>
                            </ul>
                        </li>
                        <li>
                            Über den <CheckCircleIcon fontSize="small" className={styles.inline_icon} />
                            <span className="sr-only">Bestätigen</span>-Button rechts unten auf der Seite bestätigen die Spielenden die
                            Auswertung der Antworten. Erst wenn alle Spielerinnen und Spieler bestätigt haben, startet die nächste Runde
                            (siehe Schritt 1) bzw. endet das Spiel.
                        </li>
                    </ol>
                    <h3>Spielende</h3>
                    <p>
                        Am Ende des Spiels gelangt man auf die <span>Ergebnisseite</span>, wo ein Ranking der Spielenden nach
                        erzielten Punkten dargestellt werden. Bei gleicher Punktzahl belegen Spielende denselben Platz.
                    </p>
                    <p>
                        Der Button <span>Alle Runden im Detail</span> öffnet einen Dialog, in dem alle Runden des beendeten Spiels
                        tabellarisch dargestellt werden. Falls während des Spiels einzelne Antworten als besonders kreativ ausgezeichnet
                        wurden, kann man über den <span lang="en">Hall of Fame</span>-Button einen Dialog öffnen, der eine Liste mit
                        allen Antworten anzeigt.
                    </p>
                    <h3>Weitere Optionen</h3>
                    <p>
                        Falls eine Person aus irgendeinem Grund (Browserabsturz, Akku leer etc.) aus dem Spiel fliegt, kann
                        sie über den <span>Zurück ins laufende Spiel-Button</span> wieder ins Spiel zurückkehren. Dieser findet
                        sich auf der Startseite.
                    </p>
                    <p>
                        Die Person, die ein Spiel erstellt, kann als Admin im laufenden Spiel auf weitere Optionen über
                        den <SettingsIcon fontSize="small" className={styles.inline_icon} />
                        <span className="sr-only">Admin-Optionen</span>-Button zugreifen (rechts oben bzw. auf Mobilgeräten unten).
                        Die Menü-Option <span>Gleiche Antworten markieren</span> öffnet einen Dialog, der die manuelle Markierung
                        von gleichen Antworten pro Kategorie ermöglicht. Darüber hinaus kann man als Admin andere Spielerinnen und
                        Spieler rauswerfen. Das ist natürlich nur als letztes Mittel gedacht, um ein laufendes Spiel beenden zu können.
                    </p>
                    <h3>Tastaturbedienung und Screenreader-Unterstützung</h3>
                    <p>
                        Das Spiel ist so gestaltet, dass man mithilfe der Tabulatortaste schnell navigieren und die wichtigsten Elemente
                        erreichen kann. Das trifft einerseits auf die Eingabefelder und Schaltflächen zu, aber auch auf die einzelnen
                        Antworten in der Auswertungsphase einer Runde.
                    </p>
                    <p>
                        Wenn man mit der Tabulatortaste zu einer Antwort springt, lesen Screenreader den Spielernamen, die Antwort, ihren
                        aktuellen Status (akzeptiert oder abgelehnt, etc.) sowie die Punktzahl vor. Informationen über den Spielablauf
                        (z.B. der nächste Buchstabe in der neuen Runde) werden sowohl visuell als auch in Form von Statusnachrichten
                        für Screenreader ausgegeben.
                    </p>
                    <p>
                        Beim Spielmodus <span>Countdown</span> zeigt in jeder Runde ein sichtbarer Countdown die noch verbleibende Zeit an.
                        Um Spielende nicht vom Eingeben der Antworten abzulenken, wird in diesem Fall nur 10 Sekunden vor dem Ende einer
                        Runde eine Statusnachricht ausgegeben.
                    </p>
                    <h3>Allgemeines</h3>
                    <p>
                        Die Webseite bietet fünf verschiedene Designs zur Auswahl. Das aktuelle Design kann auf der Startseite
                        (Dashboard) über den <BrushIcon fontSize="small" className={styles.inline_icon} />
                        <span className="sr-only">Design ändern</span>-Button (rechts oben im zentralen Bild) geändert werden.
                        Die Design-Auswahl sowie der zuletzt gewählte Spielername werden vom Browser gespeichert.
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
