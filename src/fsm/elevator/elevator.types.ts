import { Elevator } from './elevator.class.js';
import { ElevatorEvent, ElevatorSignal, ElevatorState, Floor } from './elevator.enums.js';

export type ElevatorStrategies = Map<ElevatorState, ElevatorStateStrategy>;

export interface ElevatorConfig {
    initialState: ElevatorState;
    currentFloor: Floor;
    strategies: ElevatorStrategies;
}

export interface ElevatorStateStrategy {
    handle(
        elevator: Elevator,
        event: ElevatorEvent,
        payload?: { targetFloor?: Floor }
    ): ElevatorSignal;
}
