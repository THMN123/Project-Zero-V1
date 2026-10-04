import { TimetableEntry } from '../types';
import { NUL_CATALOGUE } from '../data/nulCatalogue';

export interface ConflictCheckResult {
  hasConflict: boolean;
  reason?: string;
  conflictingEntry?: TimetableEntry;
}

export class TimetableEngine {
  private entries: TimetableEntry[] = [];

  constructor(initialEntries: TimetableEntry[] = []) {
    this.entries = [...initialEntries];
  }

  getEntries(): TimetableEntry[] {
    return [...this.entries];
  }

  setEntries(newEntries: TimetableEntry[]): void {
    this.entries = [...newEntries];
  }

  addEntry(entry: TimetableEntry): ConflictCheckResult {
    const conflict = this.checkConflict(
      entry.dayOfWeek,
      entry.startTime,
      entry.room,
      entry.lecturerID,
      entry.program,
      entry.id
    );

    if (conflict.hasConflict) {
      return conflict;
    }

    this.entries.push(entry);
    return { hasConflict: false };
  }

  removeEntry(id: string): boolean {
    const initialLen = this.entries.length;
    this.entries = this.entries.filter(e => e.id !== id);
    return this.entries.length < initialLen;
  }

  checkConflict(
    day: string,
    startTime: string,
    room: string,
    lecturerID: string,
    programCohort: string,
    ignoreId?: string
  ): ConflictCheckResult {
    for (const e of this.entries) {
      if (ignoreId && e.id === ignoreId) continue;

      if (e.dayOfWeek === day && e.startTime === startTime) {
        if (e.room.toLowerCase() === room.toLowerCase()) {
          return {
            hasConflict: true,
            reason: `Room Conflict: Venue '${room}' is already booked for ${e.courseID} (${e.courseName}) on ${day} at ${startTime}.`,
            conflictingEntry: e
          };
        }

        if (e.lecturerID.toLowerCase() === lecturerID.toLowerCase()) {
          return {
            hasConflict: true,
            reason: `Lecturer Conflict: Lecturer '${lecturerID}' is already conducting ${e.courseID} in ${e.room} on ${day} at ${startTime}.`,
            conflictingEntry: e
          };
        }

        // Cohort conflict: same program cohort at the exact same timeslot
        if (e.program.toLowerCase() === programCohort.toLowerCase()) {
          return {
            hasConflict: true,
            reason: `Student Cohort Conflict: Program cohort '${programCohort}' already has class ${e.courseID} scheduled on ${day} at ${startTime}.`,
            conflictingEntry: e
          };
        }
      }
    }

    return { hasConflict: false };
  }

  // Master Generation Engine matching Timetable.cpp generateMasterTimetable
  generateMasterSchedule(): { insertedCount: number; entries: TimetableEntry[]; skippedCount: number } {
    this.entries = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeslots = ['08:00', '10:00', '12:00', '14:00', '16:00'];
    const endTimes: Record<string, string> = {
      '08:00': '10:00',
      '10:00': '12:00',
      '12:00': '14:00',
      '14:00': '16:00',
      '16:00': '18:00'
    };

    let totalInserted = 0;
    let skipped = 0;

    for (const prog of NUL_CATALOGUE) {
      for (const mod of prog.modules) {
        let scheduled = false;

        // Try to allocate in a conflict-free day & timeslot
        for (let d = 0; d < days.length && !scheduled; d++) {
          for (let t = 0; t < timeslots.length && !scheduled; t++) {
            const day = days[d];
            const startTime = timeslots[t];
            const endTime = endTimes[startTime];
            const cohort = `${prog.name} Yr${mod.year}`;

            const conflict = this.checkConflict(day, startTime, mod.defaultRoom, mod.defaultLecturer, cohort);
            if (!conflict.hasConflict) {
              const entry: TimetableEntry = {
                id: `TT-${prog.code}-${mod.code}-${day.slice(0, 3)}-${startTime.replace(':', '')}`,
                courseID: mod.code,
                courseName: mod.name,
                program: prog.name,
                dayOfWeek: day,
                startTime,
                endTime,
                room: mod.defaultRoom,
                lecturerID: mod.defaultLecturer
              };
              this.entries.push(entry);
              scheduled = true;
              totalInserted++;
            }
          }
        }

        if (!scheduled) {
          skipped++;
        }
      }
    }

    return {
      insertedCount: totalInserted,
      entries: [...this.entries],
      skippedCount: skipped
    };
  }

  filterByLecturer(lecID: string): TimetableEntry[] {
    return this.entries.filter(e => e.lecturerID.toLowerCase() === lecID.toLowerCase());
  }

  filterByProgram(progName: string): TimetableEntry[] {
    return this.entries.filter(e => e.program.toLowerCase() === progName.toLowerCase());
  }

  filterByStudentModules(progName: string, moduleCodes: string[]): TimetableEntry[] {
    const codeSet = new Set(moduleCodes.map(c => c.toUpperCase()));
    return this.entries.filter(
      e => e.program.toLowerCase() === progName.toLowerCase() && codeSet.has(e.courseID.toUpperCase())
    );
  }
}
