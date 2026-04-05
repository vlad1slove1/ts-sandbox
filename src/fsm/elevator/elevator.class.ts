import { ElevatorEvent, ElevatorSignal, ElevatorState, Floor } from './elevator.enums.js';
import { ElevatorConfig, ElevatorStrategies } from './elevator.types.js';

export class Elevator {
    private currentFloor: Floor;
    private destinationFloor: Floor | null;
    private floorQueue: Floor[];
    private strategies: ElevatorStrategies;
    private state: ElevatorState;

    private readonly MAX_SIMULATION_STEPS: number = 100;
    private readonly FLOOR_TRAVEL_DELAY_MS: number = 1_000;

    constructor(config: ElevatorConfig) {
        this.state = config.initialState;
        this.currentFloor = config.currentFloor;
        this.destinationFloor = null;
        this.floorQueue = [];
        this.strategies = config.strategies;
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

        if (this.floorQueue.includes(floor)) {
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

    openDoorsAtCurrentFloor(): void {
        this.changeStateTo(ElevatorState.IdleDoorOpen);
        console.log(`Doors opening at floor ${this.currentFloor}`);
    }

    onArrivedAtDestination(): void {
        this.destinationFloor = null;
        this.openDoorsAtCurrentFloor();
    }

    removeFloorFromQueue(): Floor | undefined {
        return this.floorQueue.shift();
    }

    changeStateTo(next: ElevatorState): void {
        this.state = next;
    }

    async transit(targetFloor: Floor): Promise<ElevatorSignal> {
        const signal: ElevatorSignal = this.dispatch(ElevatorEvent.RequestFloor, { targetFloor });
        await this.simulateTransition();

        return signal;
    }

    private dispatch(event: ElevatorEvent, payload?: { targetFloor?: Floor }): ElevatorSignal {
        const strategy = this.strategies[this.state];

        if (!strategy) {
            throw new Error(`No strategy registered for state ${ElevatorState[this.state]}`);
        }

        return strategy.handle(this, event, payload);
    }

    private delayOneFloor(): Promise<void> {
        if (this.FLOOR_TRAVEL_DELAY_MS <= 0) {
            return Promise.resolve();
        }

        return new Promise<void>((resolve: () => void) => {
            setTimeout(resolve, this.FLOOR_TRAVEL_DELAY_MS);
        });
    }

    private async simulateTransition(): Promise<void> {
        let steps: number = 0;

        while (steps < this.MAX_SIMULATION_STEPS) {
            steps = steps + 1;

            if (this.state === ElevatorState.Moving) {
                await this.delayOneFloor();
                this.dispatch(ElevatorEvent.MovedOneFloor);
                continue;
            }

            if (this.state === ElevatorState.IdleDoorOpen) {
                this.dispatch(ElevatorEvent.DoorsFullyClosed);
                continue;
            }

            break;
        }
    }
}
