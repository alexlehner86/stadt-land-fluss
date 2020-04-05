import './SectionHeader.css';
import React from 'react';

interface SectionHeaderProps {
    text: string;
}

export const SectionHeader: React.FunctionComponent<SectionHeaderProps> = props => (
    <React.Fragment>
        <h2 className="section-header">{props.text}</h2>
        <hr />
    </React.Fragment>
);
