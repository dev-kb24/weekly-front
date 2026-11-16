import type { CreateSeancePayload } from '@/interfaces/CreateSeancePayload';

export enum PartType {
  ECHAUFFEMENT = 'echauffement',
  RUNNING = 'running',
  RECUPERATION = 'recuperation',
}

export enum DurationUnit {
  TIME = 'time',
  DISTANCE = 'distance',
}

export enum CadenceType {
  ZONE = 'zone',
  ALLURE = 'allure',
}

export type UpdateSeancePayload = Partial<CreateSeancePayload>;

