export class RetornoDare {
    count: number;
    _shards: Shards;
}

export class Shards {
    Total: number;
    Successful: number;
    Failed: number;
    failures?: number;
}
