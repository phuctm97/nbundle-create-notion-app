export interface ErrorLike {
  message: string;
}

export function isErrorLike(err: unknown): err is ErrorLike {
  return (
    typeof err === "object" &&
    err !== null &&
    typeof (err as { message?: unknown }).message === "string"
  );
}
