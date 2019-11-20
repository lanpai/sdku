function GetTheme(theme) {
    switch (theme) {
        case 'blossom':
            return {
                name: 'blossom',
                background: '#F7EBEC',
                primary: '#DDBDD5',
                secondary: '#59656F',
                error: '#ED5858'
            };
        case 'midnight':
            return {
                name: 'midnight',
                background: '#1C2321',
                primary: '#7D98A1',
                secondary: '#EEF1EF',
                error: '#ED5858'
            };
        case 'ash':
            return {
                name: 'ash',
                background: '#56494C',
                primary: '#847E89',
                secondary: '#AFBFC0',
                error: '#ED5858'
            };
        case 'mocha':
            return {
                name: 'mocha',
                background: '#63474D',
                primary: '#FFA686',
                secondary: '#FEC196',
                error: '#ED5858'
            };
        case 'matcha':
            return {
                name: 'matcha',
                background: '#646165',
                primary: '#C8E087',
                secondary: '#DDFCAD',
                error: '#ED5858'
            };
    }
}

export default GetTheme;
