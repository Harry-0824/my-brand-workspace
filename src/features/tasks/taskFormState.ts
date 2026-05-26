import { type TaskRecord, type UpdateTaskInput } from "../../lib/tasks";

export type TaskFormState = UpdateTaskInput;

export const initialFormState: TaskFormState = {
  title: "",
  status: "todo",
  priority: "",
  project_id: "",
  due_date: "",
};

export function toFormState(task: TaskRecord): TaskFormState {
  return {
    title: task.title,
    status: task.status,
    priority: task.priority ?? "",
    project_id: task.project_id ?? "",
    due_date: task.due_date ?? "",
  };
}
