export enum ElevatorState {
    CallButtonPressed,
    IdleDoorOpen,
    IdleDoorClosed,
    FloorButtonPressed,
    Moving,
}

export enum ElevatorEvent {
    RequestFloor,
    MovedOneFloor,
    DoorsFullyClosed,
    DoorsFullyOpened,
}

export enum ElevatorSignal {
    Ok,
    Error,
}

export enum Floor {
    One = 1,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
}

export enum DoorStatus {
    Open,
    Closed,
}
