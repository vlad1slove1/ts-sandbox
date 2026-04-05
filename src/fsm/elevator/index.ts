import { createInterface } from 'readline';
import { Elevator } from './elevator.class.js';
import { ElevatorState, Floor } from './elevator.enums.js';
import { ElevatorStrategies } from './elevator.types.js';
import {
    IdleDoorClosedStrategy,
    IdleDoorOpenStrategy,
    MovingStrategy,
} from './strategies/index.js';

const rl = createInterface({ input: process.stdin, output: process.stdout });

const idleDoorClosedStrategy = new IdleDoorClosedStrategy();
const idleDoorOpenStrategy = new IdleDoorOpenStrategy();
const movingStrategy = new MovingStrategy();

const strategies: ElevatorStrategies = {
    [ElevatorState.CallButtonPressed]: idleDoorClosedStrategy,
    [ElevatorState.IdleDoorOpen]: idleDoorOpenStrategy,
    [ElevatorState.IdleDoorClosed]: idleDoorClosedStrategy,
    [ElevatorState.FloorButtonPressed]: idleDoorClosedStrategy,
    [ElevatorState.Moving]: movingStrategy,
};

const elevator: Elevator = new Elevator({
    initialState: ElevatorState.IdleDoorClosed,
    currentFloor: Floor.One,
    strategies,
});

async function handleFloorInput(answer: string): Promise<void> {
    const targetFloor: number = parseInt(answer.trim(), 10);

    if (isNaN(targetFloor) || targetFloor < 1 || targetFloor > 9) {
        console.error('Ошибка: введите число от 1 до 9');
        run();
        return;
    }

    await elevator.transit(targetFloor as Floor);
    run();
}

function run(): void {
    rl.question('Этаж (1-9): ', (answer: string) => {
        handleFloorInput(answer).catch((err: unknown) => {
            console.error(err);
            run();
        });
    });
}

run();
