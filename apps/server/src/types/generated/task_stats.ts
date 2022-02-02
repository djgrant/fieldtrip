/**
 * !!! This file is autogenerated do not edit by hand !!!
 *
 * Generated by: @databases/pg-schema-print-types
 * Checksum: qD/GjZ6ZFFKydOUg6IPM2kpNrfQ81tBLAvGD/uCW7jpwh90ePB/aVgE1HyE+9wyySzsMYXC6KDiPy086W2fpdw==
 */

/* eslint-disable */
// tslint:disable

import Tasks from './tasks'

interface TaskStats {
  collection: string
  /**
   * @default 0
   */
  failure: number
  /**
   * @default 0
   */
  locked: number
  /**
   * @default 0
   */
  pending: number
  /**
   * @default 0
   */
  running: number
  /**
   * @default 0
   */
  scheduled: number
  /**
   * @default 0
   */
  success: number
  task_id: (Tasks['id']) | null
  /**
   * @default 0
   */
  timeout: number
  /**
   * @default 0
   */
  total: number
}
export default TaskStats;

interface TaskStats_InsertParameters {
  collection: string
  /**
   * @default 0
   */
  failure?: number
  /**
   * @default 0
   */
  locked?: number
  /**
   * @default 0
   */
  pending?: number
  /**
   * @default 0
   */
  running?: number
  /**
   * @default 0
   */
  scheduled?: number
  /**
   * @default 0
   */
  success?: number
  task_id?: (Tasks['id']) | null
  /**
   * @default 0
   */
  timeout?: number
  /**
   * @default 0
   */
  total?: number
}
export type {TaskStats_InsertParameters}