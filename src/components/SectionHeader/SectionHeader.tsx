import './SectionHeader.css';
import { Divider } from '@material-ui/core';
import React from 'react';

interface SectionHeaderProps {
    text: string;
}

export const SectionHeader: React.FunctionComponent<SectionHeaderProps> = props => (
    <React.Fragment>
        <h2 className="section-header">{props.text}</h2>
        <Divider />
    </React.Fragment>
);
