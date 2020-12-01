import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';

import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import ToDashboardButton from '../../components/ToDashboardButton/ToDashboardButton';

class AccessibilityStatement extends Component<RouteComponentProps> {
    public render() {
        return (
            <div className="main-content-wrapper">
                <div className="material-card-style slf-article-container">
                    <SectionHeader text="Barrierefreiheitserklärung"></SectionHeader>
                    <h3>Erklärung zur Barrierefreiheit</h3>
                    <p>
                        Der Autor dieser Webseite ist bemüht, diese im Einklang mit den <span>Web Content Accessibility Guidelines (WCAG)</span> barrierefrei
                        zugänglich zu machen. Diese Erklärung zur Barrierefreiheit gilt für die Webseite alexlehner86.github.io/stadt-land-fluss/.
                    </p>
                    <h3>Stand der Vereinbarkeit mit den Anforderungen</h3>
                    <p>
                        Diese Webseite ist nach aktuellem Stand vollständig mit{' '}
                        <a
                            href="https://www.w3.org/TR/WCAG21/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >Konformitätsstufe AA der „Richtlinien für barrierefreie Webinhalte Web – WCAG 2.1“</a>
                        {' '}beziehungsweise mit dem geltenden Europäischen Standard EN 301 549 V2.1.2 (2018-08) vereinbar.
                    </p>
                    <h3>Nicht barrierefreie Inhalte</h3>
                    <p>
                        Nach aktuellem Stand sind keine Inhalte bekannt, die nicht barrierefrei sind.
                    </p>
                    <h3>Erstellung dieser Erklärung zur Barrierefreiheit</h3>
                    <p>
                        Diese Erklärung wurde am 1. Dezember 2020 erstellt.
                    </p>
                    <h3>Feedback und Kontaktangaben</h3>
                    <p>
                        Diese Webseite wird laufend verbessert und ausgebaut. Dabei ist mir die Bedienbarkeit und Zugänglichkeit ein großes Anliegen.
                        Wenn dir Barrieren auffallen, die dich beim Spielen von <span>Stadt-Land-Fluss (MALEX-Edition)</span> behindern, werde ich mich
                        um eine rasche Behebung des Problems bemühen.
                    </p>
                    <p>
                        Bei Fragen oder Problemen nutze bitte die Kontaktmöglichkeiten auf meiner{' '}
                        <a
                            href="https://github.com/alexlehner86"
                            target="_blank"
                            rel="noopener noreferrer"
                        >Github-Seite</a> oder schreibe mich auf{' '}<a
                            href="https://twitter.com/alexlehner42?lang=de"
                            target="_blank"
                            rel="noopener noreferrer"
                        >Twitter</a> an.
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

export default AccessibilityStatement;
