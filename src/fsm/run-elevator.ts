import { createInterface } from 'readline';
import { Door, DoorStatus, Elevator, Floor } from './01-fsm.js';

const rl = createInterface({ input: process.stdin, output: process.stdout });

const elevator = new Elevator({
    currentFloor: 1,
    door: new Door(DoorStatus.Closed),
});

function run(): void {
    rl.question('Этаж (1-9): ', (answer) => {
        const targetFloor = parseInt(answer.trim(), 10);

        if (isNaN(targetFloor) || targetFloor < 1 || targetFloor > 9) {
            console.error('Ошибка: введите число от 1 до 9');
            run();
            return;
        }

        elevator.transit(targetFloor as Floor);
        run();
    });
}

run();
