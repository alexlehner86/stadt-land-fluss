import { Tooltip } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import StarIcon from '@material-ui/icons/Star';
import React from 'react';
import { GameConfig, GameRound, PlayerInput } from '../../models/game.interface';
import { PlayerInfo } from '../../models/player.interface';

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            maxWidth: '8rem',
        },
        body: {
            fontSize: 14,
            maxWidth: '8rem',
        },
    }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }),
)(TableRow);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tableContainer: {
            borderRadius: 0,
        },
        table: {
            maxWidth: '80vw',
        },
        firstColumn: {
            fontWeight: 'bold',
        },
        invalidInput: {
            color: 'crimson',
            textDecoration: 'line-through',
        },
        creativeAnswerStarIcon: {
            fontSize: '1rem',
            verticalAlign: 'text-top',
        }
    })
);

interface GameRoundsTableProps {
    gameConfig: GameConfig;
    round: GameRound;
    sortedPlayers: PlayerInfo[];
}
const GameRoundsTable: React.FunctionComponent<GameRoundsTableProps> = props => {
    const classes = useStyles();
    const { gameConfig, round, sortedPlayers } = props;

    const veryCreativeAnswer = (playerInput: PlayerInput): JSX.Element => (
        <React.Fragment>
            <span>{playerInput.text} (+{playerInput.points},&nbsp;</span>
            <Tooltip
                title="Als besonders kreativ markiert"
                placement="bottom"
            >
                <StarIcon className={classes.creativeAnswerStarIcon} color="secondary" />
            </Tooltip>
            <span>)</span>
        </React.Fragment>
    );
    const createTableRowForCategory = (category: string, categoryIndex: number): JSX.Element => {
        return (
            <StyledTableRow key={`slf-table-row-for-category-${categoryIndex}`}>
                <StyledTableCell component="th" scope="row" className={classes.firstColumn}>{category}</StyledTableCell>
                {sortedPlayers.map((player, playerIndex) => {
                    const playerInput = (round.get(player.id) as PlayerInput[])[categoryIndex];
                    return (
                        <StyledTableCell
                            key={`slf-table-cell-for-category-${categoryIndex}-player-${playerIndex}`}
                            className={!playerInput.valid ? classes.invalidInput : ''}
                            align="right"
                        >
                            {playerInput.valid && playerInput.star ? veryCreativeAnswer(playerInput) : null}
                            {playerInput.valid && !playerInput.star ? `${playerInput.text} (+${playerInput.points})` : null}
                            {!playerInput.valid ? playerInput.text : null}
                        </StyledTableCell>
                    );
                })}
            </StyledTableRow>
        );
    };
    return (
        <TableContainer component={Paper} className={classes.tableContainer}>
            <Table className={classes.table} aria-label="Die Spielrunde im Detail">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Kategorie</StyledTableCell>
                        {sortedPlayers.map((player, playerIndex) => (
                            <StyledTableCell
                                key={`slf-table-head-cell-for-player-${playerIndex}`}
                                align="right"
                            >{player.name}</StyledTableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {gameConfig.categories.map(createTableRowForCategory)}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default GameRoundsTable;
