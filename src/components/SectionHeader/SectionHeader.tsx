import { Divider } from '@material-ui/core';
import React from 'react';

import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
    isH3: boolean;
    showDivider: boolean;
    text: string;
}

export const SectionHeader: React.FunctionComponent<SectionHeaderProps> = props => {
    const h2Element = <h2 className={styles.section_header}>{props.text}</h2>;
    const h3Element = <h3 className={styles.section_header}>{props.text}</h3>;
    return (
        <React.Fragment>
            {props.isH3 ? h3Element : h2Element}
            {props.showDivider ? <Divider /> : null}
        </React.Fragment>
    );
};
