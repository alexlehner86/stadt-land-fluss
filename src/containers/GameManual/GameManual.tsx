import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import BrushIcon from '@material-ui/icons/Brush';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import SettingsIcon from '@material-ui/icons/Settings';
import StarIcon from '@material-ui/icons/Star';
import ThumbDownRoundedIcon from '@material-ui/icons/ThumbDownRounded';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import ToDashboardButton from '../../components/ToDashboardButton/ToDashboardButton';
import { GAME_OPTION_LABEL } from '../../constants/game.constant';
import styles from './GameManual.module.css';

class GameManual extends Component<RouteComponentProps> {
    public render() {
        return (
            <div className="main-content-wrapper">
                <div className={'material-card-style ' + styles.slf_game_manual}>
                    <SectionHeader showDivider={true} text="Spielanleitung"></SectionHeader>
                    <p>
                        Willkommen bei <span>Stadt-Land-Fluss (MALEX-Edition)</span>, einer modernen Version des{' '}
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
                        beitreten</span> einem bereits erstellten Spiel beitreten. Die Website bietet fünf verschiedene Themes zur
                        Auswahl. Das aktuelle Theme kann über den <BrushIcon fontSize="small" className={styles.inline_icon} />-Button
                        (rechts oben im zentralen Bild) geändert werden. Die Theme-Auswahl sowie der zuletzt gewählte Spielername wird im{' '}
                        <a
                            href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"
                            target="_blank"
                            rel="noopener noreferrer"
                        >Local Storage</a>
                        {' '}des Browsers gespeichert.
                    </p>
                    <h3>Neues Spiel</h3>
                    <p>
                        Um ein neues Spiel zu erstellen, muss der Nutzer einen Spielernamen eingeben, die Anzahl der zu spielenden
                        Runden festlegen und mindestens drei Kategorien auswählen. Es stehen 45 Kategorien zur Auswahl, darunter
                        Klassiker wie <span>Stadt</span>, <span>Land</span> und <span>Fluss/Gewässer</span>, jedoch auch
                        neue Kategorien wie <span>Könnte ein Trump-Tweet sein</span>. Über
                        den <AddCircleOutlineIcon fontSize="small" className={styles.inline_icon} />-Button am Ende der Kategorien-Liste
                        lässt sich auch jede beliebige, weitere Kategorie hinzufügen und für das Spiel auswählen.
                    </p>
                    <p>
                        Im Bereich <span>Weitere Optionen</span> können optional weitere Einstellungen vorgenommen werden.
                        Normalerweise wird eine Spielrunde von jenem Spieler beendet, der als erstes alle Kategorien beantwortet
                        hat. Alternativ kann über die Option <span>Countdown</span> eine fixe Rundendauer gewählt werden.
                        Der Nutzer kann auch bestimmen, welche Buchstaben ausgeschlossen werden sollen. Standardmäßig sind
                        hier Q, X und Y ausgewählt. Weiters stehen drei zusätzliche <span>Regeln für die Punktevergabe</span> zur
                        Auswahl, von denen die ersten beiden vorausgewählt sind:
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
                        -Button rechts vom Link kopiert diesen in die Zwischenablage. Über diesen Link gelangen andere Mitspieler direkt
                        zur <span>Spiel beitreten</span>-Seite, wo das Feld Spiel-ID bereits vorausgefüllt wird.
                    </p>
                    <h3>Spiel beitreten</h3>
                    <p>
                        Um einem bereits erstellten Spiel beizutreten, muss der Nutzer einen Spielernamen sowie die Spiel-ID eingeben.
                        Die Spiel-ID erhält der Nutzer von einem anderen Mitspieler bzw. sie wird von der Website automatisch in das
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
                            Abhängig vom gewählten Spielmodus endet die Runde, sobald der erste Spieler auf den Abschicken-Button
                            rechts unten auf der Seite geklickt hat oder wenn die festgelegte Rundendauer abgelaufen ist.
                        </li>
                        <li>
                            Nachdem die Runde beendet ist, wird jedem Spieler eine Übersicht aller Begriffe aller Spieler pro
                            Kategorie angezeigt. Grundsätzlich zählt ein gültiger Begriff 10 Punkte, außer die gewählten Regeln besagen
                            etwas anderes. Falls ein Spieler in ein Feld nichts eingetragen hat, wird dieses automatisch als 0 Punkte
                            gewertet. Über den <ThumbDownRoundedIcon fontSize="small" className={styles.inline_icon} />-Button
                            können die Spieler konkrete Antworten ablehnen. Abhängig von der Spieleranzahl führt dies dazu, dass
                            der jeweilige Spieler keine Punkte für die Antwort erhält. Bei zwei bis drei Spielern reicht die Ablehnung
                            durch einen Mitspieler aus. Bei mehr als drei Spielern müssen mindesten zwei Spieler eine Antwort ablehnen.
                            Die Ablehnung einer Antwort kann durch erneutes Klicken auf den Button wieder zurückgezogen werden.
                            Mit dem <StarIcon fontSize="small" className={styles.inline_icon} />-Button können Begriffe von Mitspielern
                            als besonders kreativ oder lustig ausgezeichnet werden.
                        </li>
                        <li>
                            Über den Bestätigen-Button rechts unten auf der Seite muss ein Spieler signalisieren, dass sie oder er
                            mit der Analyse der Antworten fertig und bereit für die nächste Runde ist. Erst wenn alle Spieler den
                            Button geklickt haben, startet die nächste Runde (siehe Schritt 1) bzw. endet das Spiel.
                        </li>
                    </ol>
                    <p>
                        Hinweis: Falls ein Mitspieler aus irgendeinem Grund (Browserabsturz, Akku leer etc.) aus dem Spiel fliegt, kann
                        sie oder er über den <span>Zurück ins laufende Spiel-Button</span> wieder ins Spiel zurückkehren. Dieser findet
                        sich auf der Startseite. Darüber hinaus hat der Administrator in einem laufenden Spiel die Möglichkeit, über
                        den <SettingsIcon fontSize="small" className={styles.inline_icon} />-Button (rechts oben, unterhalb des Headers)
                        andere Spieler aus dem Spiel zu werfen. Natürlich nur in Notfällen ;)
                    </p>
                    <h3>Spielende</h3>
                    <p>
                        Am Ende des Spiels gelangt der Nutzer auf die <span>Ergebnisseite</span>, wo ein Ranking der Mitspieler nach
                        erzielten Punkten sowie die Details zum Spiel (Buchstaben, Anzahl Runden, Kategorien etc.) dargestellt werden.
                    </p>
                    <p>
                        Der Button <span>Alle Runden im Detail</span> öffnet einen Dialog, in dem alle Runden des beendeten Spiels
                        im Detail (Antworten, Punkte etc.) dargestellt werden. Falls während des Spiels einzelne Begriffe als besonders
                        kreativ oder lustig ausgezeichnet wurden, so kann man über den <span>Hall of Fame</span>-Button
                        einen Dialog öffnen, der eine Liste mit allen Begriffen anzeigt.
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
