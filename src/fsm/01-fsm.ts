export type Floor = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export enum Action {
    Up,
    Down,
    Idle,
}

export enum DoorStatus {
    Open,
    Closed,
}

export interface ElevatorConfig {
    currentFloor: Floor;
    door: Door;
}

export class Door {
    private status: DoorStatus;

    constructor(initStatus: DoorStatus = DoorStatus.Closed) {
        this.status = initStatus;
    }

    getStatus(): DoorStatus {
        return this.status;
    }

    open(): boolean {
        if (this.status === DoorStatus.Open) {
            console.log('Door is already open');
            return false;
        }

        this.status = DoorStatus.Open;
        console.log('Door is now open');
        return true;
    }

    close(): boolean {
        if (this.status === DoorStatus.Closed) {
            console.log('Door is already closed');
            return false;
        }

        this.status = DoorStatus.Closed;
        console.log('Door is now closed');
        return true;
    }

    toggle(): DoorStatus {
        if (this.status === DoorStatus.Closed) {
            this.open();
        } else {
            this.close();
        }

        return this.status;
    }
}

export class Elevator {
    private currentFloor: Floor;
    private door: Door;
    private history: Floor[] = [];

    constructor(initConfig: ElevatorConfig) {
        this.currentFloor = initConfig.currentFloor;
        this.door = initConfig.door;
        this.history = [initConfig.currentFloor];
    }

    getCurrentFloor(): Floor {
        return this.currentFloor;
    }

    getDoorStatus(): DoorStatus {
        return this.door.getStatus();
    }

    transit(targetFloor: Floor): void {
        if (this.door.getStatus() === DoorStatus.Open) {
            this.door.close();
        }

        const action: Action = this.getActionFor(targetFloor);

        switch (action) {
            case Action.Idle: {
                console.log('Elevator is already at the requested floor');

                if (this.door.getStatus() === DoorStatus.Closed) {
                    this.door.open();
                }

                return;
            }

            case Action.Up: {
                while (this.currentFloor < targetFloor) {
                    this.currentFloor = ((this.currentFloor as number) + 1) as Floor;
                    this.history.push(this.currentFloor);
                    console.log(`Going up. Current floor: ${this.currentFloor}`);
                }

                break;
            }

            case Action.Down: {
                while (this.currentFloor > targetFloor) {
                    this.currentFloor = ((this.currentFloor as number) - 1) as Floor;
                    this.history.push(this.currentFloor);
                    console.log(`Going down. Current floor: ${this.currentFloor}`);
                }

                break;
            }
        }

        this.door.open();
    }

    private getActionFor(targetFloor: Floor): Action {
        if (this.currentFloor === targetFloor) {
            return Action.Idle;
        }

        if (this.currentFloor < targetFloor) {
            return Action.Up;
        }

        return Action.Down;
    }
}
