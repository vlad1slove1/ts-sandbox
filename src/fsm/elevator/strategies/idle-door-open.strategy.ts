import { Elevator } from '../elevator.class.js';
import { ElevatorEvent, ElevatorSignal, ElevatorState, Floor } from '../elevator.enums.js';
import { ElevatorStateStrategy } from '../elevator.types.js';

export class IdleDoorOpenStrategy implements ElevatorStateStrategy {
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

                if (targetFloor === elevator.getCurrentFloor()) {
                    return ElevatorSignal.Ok;
                }

                elevator.addFloorToQueue(targetFloor);
                return ElevatorSignal.Ok;
            }

            case ElevatorEvent.DoorsFullyClosed: {
                elevator.changeStateTo(ElevatorState.IdleDoorClosed);
                const nextDestination = elevator.removeFloorFromQueue();

                if (nextDestination !== undefined) {
                    elevator.startMovingTo(nextDestination);
                }

                return ElevatorSignal.Ok;
            }

            case ElevatorEvent.DoorsFullyOpened: {
                return ElevatorSignal.Ok;
            }

            default:
                return ElevatorSignal.Error;
        }
    }
}
