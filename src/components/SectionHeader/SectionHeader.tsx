import { Divider } from '@material-ui/core';
import React from 'react';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
    showDivider: boolean;
    text: string;
}

export const SectionHeader: React.FunctionComponent<SectionHeaderProps> = props => (
    <React.Fragment>
        <h2 className={styles.section_header}>{props.text}</h2>
        {props.showDivider ? <Divider /> : null}
    </React.Fragment>
);
