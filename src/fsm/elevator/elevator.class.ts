import { ElevatorEvent, ElevatorSignal, ElevatorState, Floor } from './elevator.enums.js';
import { ElevatorConfig, ElevatorStrategies } from './elevator.types.js';

export class Elevator {
    private currentFloor: Floor;
    private destinationFloor: Floor | null;
    private floorQueue: Floor[];
    private strategies: ElevatorStrategies;
    private state: ElevatorState;

    constructor(config: ElevatorConfig) {
        this.state = config.initialState;
        this.currentFloor = config.currentFloor;
        this.destinationFloor = null;
        this.floorQueue = [];
        this.strategies = config.strategies;
    }

    transit(targetFloor: Floor): ElevatorSignal {
        return this.dispatch(ElevatorEvent.RequestFloor, { targetFloor });
    }

    getCurrentFloor(): Floor {
        return this.currentFloor;
    }

    getDestinationFloor(): Floor | null {
        return this.destinationFloor;
    }

    startMovingTo(targetFloor: Floor): void {
        this.destinationFloor = targetFloor;
        this.changeStateTo(ElevatorState.Moving);
        console.log(`Moving to floor ${targetFloor}`);
    }

    addFloorToQueue(floor: Floor): void {
        if (this.destinationFloor !== null && floor === this.destinationFloor) {
            return;
        }

        this.floorQueue = [...this.floorQueue, floor];
        console.log(`Queued floor ${floor}`);
    }

    isMoving(): boolean {
        return this.destinationFloor !== null;
    }

    hasArrived(): boolean {
        return this.destinationFloor !== null && this.currentFloor === this.destinationFloor;
    }

    moveOneFloor(): void {
        if (this.destinationFloor === null) {
            return;
        }

        if (this.currentFloor < this.destinationFloor) {
            this.currentFloor = this.currentFloor + 1;
        } else if (this.currentFloor > this.destinationFloor) {
            this.currentFloor = this.currentFloor - 1;
        }

        console.log(`At floor ${this.currentFloor}`);
    }

    useNextItemFromQueue(): void {
        const nextDestination = this.floorQueue.shift();

        if (nextDestination !== undefined) {
            this.destinationFloor = nextDestination;
            console.log(`Arrived; next floor is: ${nextDestination}`);
            return;
        }

        this.destinationFloor = null;
        this.changeStateTo(ElevatorState.IdleDoorClosed);
        console.log('Arrived');
    }

    removeFloorFromQueue(): Floor | undefined {
        return this.floorQueue.shift();
    }

    changeStateTo(next: ElevatorState): void {
        this.state = next;
    }

    private dispatch(event: ElevatorEvent, payload?: { targetFloor?: Floor }): ElevatorSignal {
        const strategy = this.strategies.get(this.state);

        if (!strategy) {
            throw new Error(`No strategy registered for state ${ElevatorState[this.state]}`);
        }

        return strategy.handle(this, event, payload);
    }
}
