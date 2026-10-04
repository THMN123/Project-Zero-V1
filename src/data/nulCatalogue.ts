import { ProgramInfo, ModuleInfo } from '../types';

export const NUL_CATALOGUE: ProgramInfo[] = [
  // b01: BSc Information Systems
  {
    code: 'b01',
    name: 'BSc Information Systems',
    durationYears: 4,
    modules: [
      { code: 'IS1501', name: 'Introduction to Information Systems', year: 1, semester: 1, defaultRoom: 'SCILT-101', defaultLecturer: 'LEC_IS01' },
      { code: 'CS1401', name: 'Programming Fundamentals Principles', year: 1, semester: 1, defaultRoom: 'CMP-LAB1', defaultLecturer: 'LEC_CS01' },
      { code: 'M111',   name: 'Introductory Mathematics I',         year: 1, semester: 1, defaultRoom: 'SCILT-102', defaultLecturer: 'LEC_MATH1' },
      { code: 'ST111',  name: 'Introduction to Statistics I',       year: 1, semester: 1, defaultRoom: 'SCILT-103', defaultLecturer: 'LEC_STAT1' },

      { code: 'IS1502', name: 'Database Systems & Design',           year: 1, semester: 2, defaultRoom: 'SCILT-101', defaultLecturer: 'LEC_IS02' },
      { code: 'CS1402', name: 'Object Oriented Programming I',      year: 1, semester: 2, defaultRoom: 'CMP-LAB1', defaultLecturer: 'LEC_CS02' },
      { code: 'M112',   name: 'Calculus & Linear Algebra',          year: 1, semester: 2, defaultRoom: 'SCILT-102', defaultLecturer: 'LEC_MATH2' },

      { code: 'IS2501', name: 'Systems Analysis & Design',           year: 2, semester: 1, defaultRoom: 'SCILT-201', defaultLecturer: 'LEC_IS01' },
      { code: 'CS2401', name: 'Data Structures & Algorithms',        year: 2, semester: 1, defaultRoom: 'CMP-LAB2', defaultLecturer: 'LEC_CS01' },
      { code: 'IS2503', name: 'Enterprise Architecture',             year: 2, semester: 1, defaultRoom: 'SCILT-202', defaultLecturer: 'LEC_IS03' },

      { code: 'IS2502', name: 'Web Systems & Development',           year: 2, semester: 2, defaultRoom: 'CMP-LAB2', defaultLecturer: 'LEC_IS02' },
      { code: 'CS2402', name: 'Database Management Systems',         year: 2, semester: 2, defaultRoom: 'CMP-LAB1', defaultLecturer: 'LEC_CS02' },

      { code: 'IS3501', name: 'IT Project Management',               year: 3, semester: 1, defaultRoom: 'SCILT-301', defaultLecturer: 'LEC_IS03' },
      { code: 'CS3401', name: 'Operating Systems',                   year: 3, semester: 1, defaultRoom: 'CMP-LAB3', defaultLecturer: 'LEC_CS03' },

      { code: 'IS4501', name: 'IS Strategy & Governance',            year: 4, semester: 1, defaultRoom: 'SCILT-401', defaultLecturer: 'LEC_IS01' },
      { code: 'IS4599', name: 'IS Senior Capstone Project',          year: 4, semester: 2, defaultRoom: 'SCILT-401', defaultLecturer: 'LEC_IS01' }
    ]
  },
  // b02: BSc Computer Science
  {
    code: 'b02',
    name: 'BSc Computer Science',
    durationYears: 4,
    modules: [
      { code: 'CS1401', name: 'Programming Fundamentals Principles', year: 1, semester: 1, defaultRoom: 'CMP-LAB1', defaultLecturer: 'LEC_CS01' },
      { code: 'M111',   name: 'Introductory Mathematics I',         year: 1, semester: 1, defaultRoom: 'SCILT-102', defaultLecturer: 'LEC_MATH1' },
      { code: 'P111',   name: 'General Physics I',                  year: 1, semester: 1, defaultRoom: 'SCIENCE-L1', defaultLecturer: 'LEC_PHYS1' },

      { code: 'CS1402', name: 'Object Oriented Programming I',      year: 1, semester: 2, defaultRoom: 'CMP-LAB1', defaultLecturer: 'LEC_CS02' },
      { code: 'CS1404', name: 'Discrete Structures',                year: 1, semester: 2, defaultRoom: 'CMP-102',  defaultLecturer: 'LEC_CS03' },

      { code: 'CS2401', name: 'Data Structures & Algorithms',        year: 2, semester: 1, defaultRoom: 'CMP-LAB2', defaultLecturer: 'LEC_CS01' },
      { code: 'CS2403', name: 'Computer Architecture & Assembly',    year: 2, semester: 1, defaultRoom: 'CMP-103',  defaultLecturer: 'LEC_CS03' },

      { code: 'CS2402', name: 'Database Management Systems',         year: 2, semester: 2, defaultRoom: 'CMP-LAB1', defaultLecturer: 'LEC_CS02' },
      { code: 'CS2404', name: 'Software Engineering Principles',     year: 2, semester: 2, defaultRoom: 'CMP-102',  defaultLecturer: 'LEC_CS01' },

      { code: 'CS3401', name: 'Operating Systems',                   year: 3, semester: 1, defaultRoom: 'CMP-LAB3', defaultLecturer: 'LEC_CS03' },
      { code: 'CS3403', name: 'Computer Networks & Protocols',       year: 3, semester: 1, defaultRoom: 'CMP-LAB2', defaultLecturer: 'LEC_CS02' },

      { code: 'CS4401', name: 'Compiler Construction & Design',      year: 4, semester: 1, defaultRoom: 'CMP-104',  defaultLecturer: 'LEC_CS03' },
      { code: 'CS4499', name: 'Computer Science Research Project',   year: 4, semester: 2, defaultRoom: 'CMP-LAB3', defaultLecturer: 'LEC_CS01' }
    ]
  },
  // b03: BSc Biotechnology
  {
    code: 'b03',
    name: 'BSc Biotechnology',
    durationYears: 4,
    modules: [
      { code: 'B111',   name: 'Introductory Biology I',             year: 1, semester: 1, defaultRoom: 'SCIENCE-L2', defaultLecturer: 'LEC_BIO1' },
      { code: 'C111',   name: 'General Chemistry I',                year: 1, semester: 1, defaultRoom: 'SCIENCE-L1', defaultLecturer: 'LEC_CHEM1' },
      { code: 'B112',   name: 'Cell Biology & Genetics',            year: 1, semester: 2, defaultRoom: 'SCIENCE-L2', defaultLecturer: 'LEC_BIO1' },
      { code: 'B211',   name: 'Microbiology Fundamentals',          year: 2, semester: 1, defaultRoom: 'SCIENCE-L3', defaultLecturer: 'LEC_BIO2' },
      { code: 'C211',   name: 'Organic Chemistry I',                year: 2, semester: 1, defaultRoom: 'SCIENCE-L1', defaultLecturer: 'LEC_CHEM2' },
      { code: 'B311',   name: 'Molecular Biology & Recombinant DNA',year: 3, semester: 1, defaultRoom: 'SCIENCE-L3', defaultLecturer: 'LEC_BIO2' },
      { code: 'B411',   name: 'Industrial Biotechnology',           year: 4, semester: 1, defaultRoom: 'SCIENCE-L3', defaultLecturer: 'LEC_BIO1' }
    ]
  },
  // b04: BBA Business Administration
  {
    code: 'b04',
    name: 'BBA Business Administration',
    durationYears: 4,
    modules: [
      { code: 'BUS111', name: 'Principles of Management',           year: 1, semester: 1, defaultRoom: 'SOC-101', defaultLecturer: 'LEC_BUS1' },
      { code: 'ACC111', name: 'Financial Accounting I',             year: 1, semester: 1, defaultRoom: 'SOC-102', defaultLecturer: 'LEC_ACC1' },
      { code: 'ECO111', name: 'Microeconomics I',                   year: 1, semester: 1, defaultRoom: 'SOC-103', defaultLecturer: 'LEC_ECO1' },
      { code: 'BUS112', name: 'Organizational Behaviour',           year: 1, semester: 2, defaultRoom: 'SOC-101', defaultLecturer: 'LEC_BUS1' },
      { code: 'ACC112', name: 'Financial Accounting II',            year: 1, semester: 2, defaultRoom: 'SOC-102', defaultLecturer: 'LEC_ACC1' },
      { code: 'BUS211', name: 'Marketing Management',               year: 2, semester: 1, defaultRoom: 'SOC-201', defaultLecturer: 'LEC_BUS2' },
      { code: 'BUS311', name: 'Corporate Finance',                  year: 3, semester: 1, defaultRoom: 'SOC-301', defaultLecturer: 'LEC_ACC1' },
      { code: 'BUS411', name: 'Strategic Management',               year: 4, semester: 1, defaultRoom: 'SOC-401', defaultLecturer: 'LEC_BUS1' }
    ]
  },
  // b05: BEng Electronics Engineering
  {
    code: 'b05',
    name: 'BEng Electronics Engineering',
    durationYears: 5,
    modules: [
      { code: 'EG101',  name: 'Engineering Drawing & CAD',          year: 1, semester: 1, defaultRoom: 'ENG-LAB1', defaultLecturer: 'LEC_ENG1' },
      { code: 'M111',   name: 'Introductory Mathematics I',         year: 1, semester: 1, defaultRoom: 'SCILT-102', defaultLecturer: 'LEC_MATH1' },
      { code: 'P111',   name: 'General Physics I',                  year: 1, semester: 1, defaultRoom: 'SCIENCE-L1', defaultLecturer: 'LEC_PHYS1' },
      { code: 'EG201',  name: 'Circuit Theory I',                   year: 2, semester: 1, defaultRoom: 'ENG-LAB2', defaultLecturer: 'LEC_ENG1' },
      { code: 'EG202',  name: 'Analogue Electronics',               year: 2, semester: 2, defaultRoom: 'ENG-LAB2', defaultLecturer: 'LEC_ENG2' },
      { code: 'EG301',  name: 'Digital Signal Processing',          year: 3, semester: 1, defaultRoom: 'ENG-LAB3', defaultLecturer: 'LEC_ENG2' },
      { code: 'EG401',  name: 'Microcontroller Systems',            year: 4, semester: 1, defaultRoom: 'ENG-LAB3', defaultLecturer: 'LEC_ENG1' },
      { code: 'EG501',  name: 'Telecommunication Systems',          year: 5, semester: 1, defaultRoom: 'ENG-HALL', defaultLecturer: 'LEC_ENG2' }
    ]
  }
];

export function getProgramNameByCode(code: string): string {
  const found = NUL_CATALOGUE.find(p => p.code.toLowerCase() === code.toLowerCase() || p.name.toLowerCase() === code.toLowerCase());
  return found ? found.name : code;
}

export function getModulesForStudent(progIdentifier: string, year: number, semester: number): ModuleInfo[] {
  const program = NUL_CATALOGUE.find(
    p => p.code.toLowerCase() === progIdentifier.toLowerCase() || p.name.toLowerCase() === progIdentifier.toLowerCase()
  );
  if (!program) return [];
  return program.modules.filter(m => m.year === year && m.semester === semester);
}
