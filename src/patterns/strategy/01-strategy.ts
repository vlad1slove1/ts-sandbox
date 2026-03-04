enum ConnectionStatus {
    Open,
    Closed,
}

enum Action {
    Connect,
    Disconnect,
}

interface ConnectionStrategy {
    transition(current: ConnectionStatus, action: Action): ConnectionStatus;
}

class DefaultConnectionStrategy implements ConnectionStrategy {
    transition(current: ConnectionStatus, action: Action): ConnectionStatus {
        switch (action) {
            case Action.Connect: {
                if (current === ConnectionStatus.Closed) {
                    console.log('Connection opened');
                }

                return ConnectionStatus.Open;
            }

            case Action.Disconnect: {
                if (current === ConnectionStatus.Open) {
                    console.log('Connection closed');
                }

                return ConnectionStatus.Closed;
            }

            default: {
                throw new Error(`Unexpected action: ${action}`);
            }
        }
    }
}

class Connection {
    private status: ConnectionStatus = ConnectionStatus.Closed;
    private strategy: ConnectionStrategy;

    constructor(strategy: ConnectionStrategy) {
        this.strategy = strategy;
    }

    getStatus(): ConnectionStatus {
        return this.status;
    }

    connect(): void {
        this.status = this.strategy.transition(this.status, Action.Connect);
    }

    disconnect(): void {
        this.status = this.strategy.transition(this.status, Action.Disconnect);
    }
}

const connection: Connection = new Connection(new DefaultConnectionStrategy());
connection.connect();
console.log(connection.getStatus());

connection.disconnect();
console.log(connection.getStatus());
