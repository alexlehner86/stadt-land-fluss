import './SectionHeader.css';
import { Divider } from '@material-ui/core';
import React from 'react';

interface SectionHeaderProps {
    showDivider: boolean;
    text: string;
}

export const SectionHeader: React.FunctionComponent<SectionHeaderProps> = props => (
    <React.Fragment>
        <h2 className="section-header">{props.text}</h2>
        {props.showDivider ? <Divider /> : null}
    </React.Fragment>
);
