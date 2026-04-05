import { Elevator } from '../elevator.class.js';
import { ElevatorEvent, ElevatorSignal, Floor } from '../elevator.enums.js';
import { ElevatorStateStrategy } from '../elevator.types.js';

export class IdleDoorClosedStrategy implements ElevatorStateStrategy {
    handle(
        elevator: Elevator,
        event: ElevatorEvent,
        payload?: { targetFloor?: Floor }
    ): ElevatorSignal {
        switch (event) {
            case ElevatorEvent.RequestFloor: {
                const targetFloor = payload?.targetFloor;

                if (targetFloor === undefined) {
                    return ElevatorSignal.Error;
                }

                if (targetFloor === elevator.getCurrentFloor()) {
                    elevator.openDoorsAtCurrentFloor();
                    return ElevatorSignal.Ok;
                }

                elevator.startMovingTo(targetFloor);
                return ElevatorSignal.Ok;
            }

            default:
                return ElevatorSignal.Error;
        }
    }
}
