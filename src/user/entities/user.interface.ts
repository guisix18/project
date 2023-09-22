export interface IUser {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  password: string;
  tasks: ITask;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  concludedAt: Date;
  progress: TaskState;
  user?: IUser;
  userId: string;
}

export enum TaskState {
  INPROGRESS = 'In progress',
  NOTSTARTED = 'Not started',
  CONCLUDED = 'Concluded',
}
