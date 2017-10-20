const header = `
| Yahoo 10-man Standard ||
|:-|:-:|
`;
const footer = `
&nbsp;
`;

export default {
    // players: array of objects { name: 'name', matchup: '@ Cin' }
    template: (players) => {
        let template ='';

        template += header;
        players.forEach((player) => {
            template += `| ${player.name} | ${player.matchup} |
            `
        });
        template += footer;
        return template;
    }
}