export function generateTaskId(projectKey: string | null | undefined, taskNumber: number): string {
  if (!projectKey) {
    return `#${taskNumber}`;
  }
  return `${projectKey.toUpperCase()}-${String(taskNumber).padStart(3, "0")}`;
}
