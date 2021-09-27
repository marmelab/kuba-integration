# Kuba Console

Play the game of Kuba on the console ([rules](https://regle.escaleajeux.fr/akiba_rg.pdf)).

## Requirements

- Node.js

## Installation

```
yarn
```

Do not forget to fulfill the .env files in API, ADMIN and CLIENT folders

### Playing

in order to launch the API and Admin parts :

```bash
CURRENT_UID=$(id -u):$(id -g) docker-compose up
```

then, to launch a game, in the client folder :

```bash
yarn start:development
```

### Running Unit Tests

```
yarn test
```

### Board JSON Format

```
{
    "board": [
        [1, 2],
        [0, 3]
    ]
}
```
