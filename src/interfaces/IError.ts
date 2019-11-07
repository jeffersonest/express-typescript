export default interface ErrnoException {
    readonly errno?: number;
    readonly code?: string;
    readonly path?: string;
    readonly syscall?: string;
    readonly stack?: string;
}
