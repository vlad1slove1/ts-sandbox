import { Elevator } from '../elevator.class.js';
import { ElevatorEvent, ElevatorSignal, Floor } from '../elevator.enums.js';
import { ElevatorStateStrategy } from '../elevator.types.js';

export class MovingStrategy implements ElevatorStateStrategy {
    handle(
        elevator: Elevator,
        event: ElevatorEvent,
        payload?: { targetFloor?: Floor }
    ): ElevatorSignal {
        switch (event) {
            case ElevatorEvent.RequestFloor: {
                const targetFloor = payload?.targetFloor;
                if (!targetFloor) {
                    return ElevatorSignal.Error;
                }

                const currentDestination = elevator.getDestinationFloor();
                if (currentDestination !== null && targetFloor === currentDestination) {
                    return ElevatorSignal.Ok;
                }

                elevator.addFloorToQueue(targetFloor);
                return ElevatorSignal.Ok;
            }

            case ElevatorEvent.MovedOneFloor: {
                if (!elevator.isMoving()) {
                    return ElevatorSignal.Error;
                }

                if (elevator.hasArrived()) {
                    elevator.useNextItemFromQueue();
                    return ElevatorSignal.Ok;
                }

                elevator.moveOneFloor();
                if (elevator.hasArrived()) {
                    elevator.useNextItemFromQueue();
                }

                return ElevatorSignal.Ok;
            }

            default:
                console.log(`Unknown event: ${event}`);
                return ElevatorSignal.Error;
        }
    }
}
