// Mock band equipment and QR code data for development and testing

export interface MockEquipment {
  id: string;
  qrCode: string;
  serialNumber: string;
  make: string;
  model: string;
  category: 'BRASS' | 'WOODWIND' | 'PERCUSSION' | 'STRING' | 'ELECTRONIC' | 'ACCESSORY';
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'REPAIR_NEEDED';
  status: 'AVAILABLE' | 'CHECKED_OUT' | 'IN_MAINTENANCE' | 'RETIRED' | 'MISSING';
  location: string;
  assignedTo?: string;
  checkoutDate?: string;
  expectedReturn?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  purchasePrice?: number;
  notes?: string;
}

export const MOCK_EQUIPMENT: MockEquipment[] = [
  // BRASS SECTION - Trumpets (B♭)
  {
    id: "eq_trumpet_001", qrCode: "QR_TRUMPET_001", serialNumber: "TR-2024-001",
    make: "Yamaha", model: "YTR-2330", category: "BRASS",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Storage Room A",
    lastMaintenance: "2024-07-15", nextMaintenance: "2025-01-15",
    purchasePrice: 450.00, notes: "Student model trumpet, excellent for beginners"
  },
  {
    id: "eq_trumpet_002", qrCode: "QR_TRUMPET_002", serialNumber: "TR-2024-002", 
    make: "Bach", model: "TR300H2", category: "BRASS",
    condition: "GOOD", status: "CHECKED_OUT", location: "Practice Room 1",
    assignedTo: "student@band.app", checkoutDate: "2024-08-29", expectedReturn: "2024-09-29",
    lastMaintenance: "2024-06-20", nextMaintenance: "2024-12-20",
    purchasePrice: 520.00, notes: "Intermediate trumpet, slight wear on valves"
  },
  {
    id: "eq_trumpet_003", qrCode: "QR_TRUMPET_003", serialNumber: "TR-2024-003",
    make: "Conn", model: "1BR", category: "BRASS",
    condition: "GOOD", status: "AVAILABLE", location: "Storage Room A",
    lastMaintenance: "2024-08-10", nextMaintenance: "2025-02-10",
    purchasePrice: 395.00, notes: "Entry-level student trumpet"
  },
  {
    id: "eq_trumpet_004", qrCode: "QR_TRUMPET_004", serialNumber: "TR-2024-004",
    make: "Jupiter", model: "JTR700", category: "BRASS",
    condition: "EXCELLENT", status: "CHECKED_OUT", location: "Practice Room 3",
    assignedTo: "student.brass2@band.app", checkoutDate: "2024-08-28", expectedReturn: "2024-09-28",
    lastMaintenance: "2024-07-05", nextMaintenance: "2025-01-05",
    purchasePrice: 480.00, notes: "Advanced student model with high-quality valves"
  },

  // BRASS SECTION - Trombones
  {
    id: "eq_trombone_001", qrCode: "QR_TROMBONE_001", serialNumber: "TB-2024-001",
    make: "Yamaha", model: "YSL-354", category: "BRASS",
    condition: "GOOD", status: "AVAILABLE", location: "Storage Room A",
    lastMaintenance: "2024-05-10", nextMaintenance: "2024-11-10",
    purchasePrice: 380.00, notes: "Student trombone with F attachment"
  },
  {
    id: "eq_trombone_002", qrCode: "QR_TROMBONE_002", serialNumber: "TB-2024-002",
    make: "Bach", model: "TB200B", category: "BRASS",
    condition: "FAIR", status: "IN_MAINTENANCE", location: "Repair Shop",
    lastMaintenance: "2024-08-30", nextMaintenance: "2024-10-30",
    purchasePrice: 420.00, notes: "Needs slide alignment, scheduled for maintenance"
  },
  {
    id: "eq_trombone_003", qrCode: "QR_TROMBONE_003", serialNumber: "TB-2024-003",
    make: "Conn", model: "88H", category: "BRASS",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Storage Room A",
    lastMaintenance: "2024-08-15", nextMaintenance: "2025-02-15",
    purchasePrice: 850.00, notes: "Professional-level bass trombone"
  },

  // BRASS SECTION - French Horns
  {
    id: "eq_frenchhorn_001", qrCode: "QR_FRENCHHORN_001", serialNumber: "FH-2024-001",
    make: "Holton", model: "H179", category: "BRASS",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Storage Room A",
    lastMaintenance: "2024-08-01", nextMaintenance: "2025-04-01",
    purchasePrice: 1200.00, notes: "Double horn, professional quality"
  },
  {
    id: "eq_frenchhorn_002", qrCode: "QR_FRENCHHORN_002", serialNumber: "FH-2024-002",
    make: "Yamaha", model: "YHR-314II", category: "BRASS",
    condition: "GOOD", status: "CHECKED_OUT", location: "Practice Room 2",
    assignedTo: "student.brass1@band.app", checkoutDate: "2024-08-25", expectedReturn: "2024-09-25",
    lastMaintenance: "2024-06-15", nextMaintenance: "2024-12-15",
    purchasePrice: 980.00, notes: "Single F horn, excellent for students"
  },

  // BRASS SECTION - Tubas & Euphoniums
  {
    id: "eq_tuba_001", qrCode: "QR_TUBA_001", serialNumber: "TU-2024-001",
    make: "Miraphone", model: "188-4U", category: "BRASS",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Storage Room A",
    lastMaintenance: "2024-07-20", nextMaintenance: "2025-01-20",
    purchasePrice: 3200.00, notes: "4-valve compensating BBb tuba"
  },
  {
    id: "eq_euphonium_001", qrCode: "QR_EUPHONIUM_001", serialNumber: "EU-2024-001",
    make: "Yamaha", model: "YEP-321", category: "BRASS",
    condition: "GOOD", status: "AVAILABLE", location: "Storage Room A",
    lastMaintenance: "2024-06-10", nextMaintenance: "2024-12-10",
    purchasePrice: 1450.00, notes: "3-valve euphonium, student model"
  },

  // WOODWIND SECTION - Flutes
  {
    id: "eq_flute_001", qrCode: "QR_FLUTE_001", serialNumber: "FL-2024-001",
    make: "Gemeinhardt", model: "3OB", category: "WOODWIND",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Storage Room B",
    lastMaintenance: "2024-07-20", nextMaintenance: "2025-01-20",
    purchasePrice: 320.00, notes: "Open hole flute, student model"
  },
  {
    id: "eq_flute_002", qrCode: "QR_FLUTE_002", serialNumber: "FL-2024-002",
    make: "Yamaha", model: "YFL-222", category: "WOODWIND",
    condition: "GOOD", status: "CHECKED_OUT", location: "Practice Room 4",
    assignedTo: "student.woodwind1@band.app", checkoutDate: "2024-08-27", expectedReturn: "2024-09-27",
    lastMaintenance: "2024-07-01", nextMaintenance: "2025-01-01",
    purchasePrice: 385.00, notes: "Closed-hole student flute"
  },
  {
    id: "eq_piccolo_001", qrCode: "QR_PICCOLO_001", serialNumber: "PC-2024-001",
    make: "Pearl", model: "PF-665E", category: "WOODWIND",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Storage Room B",
    lastMaintenance: "2024-08-05", nextMaintenance: "2025-02-05",
    purchasePrice: 485.00, notes: "Silver-plated piccolo with wood headjoint"
  },

  // WOODWIND SECTION - Clarinets
  {
    id: "eq_clarinet_001", qrCode: "QR_CLARINET_001", serialNumber: "CL-2024-001",
    make: "Buffet", model: "B12", category: "WOODWIND",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Storage Room B",
    lastMaintenance: "2024-08-18", nextMaintenance: "2024-12-18",
    purchasePrice: 650.00, notes: "Professional student model"
  },
  {
    id: "eq_clarinet_002", qrCode: "QR_CLARINET_002", serialNumber: "CL-2024-002",
    make: "Yamaha", model: "YCL-255", category: "WOODWIND",
    condition: "GOOD", status: "CHECKED_OUT", location: "Practice Room 5",
    assignedTo: "student.woodwind2@band.app", checkoutDate: "2024-08-26", expectedReturn: "2024-09-26",
    lastMaintenance: "2024-06-25", nextMaintenance: "2024-12-25",
    purchasePrice: 425.00, notes: "ABS body student clarinet"
  },
  {
    id: "eq_bassclarinet_001", qrCode: "QR_BASSCLARINET_001", serialNumber: "BC-2024-001",
    make: "Selmer", model: "1430LP", category: "WOODWIND",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Storage Room B",
    lastMaintenance: "2024-07-10", nextMaintenance: "2025-01-10",
    purchasePrice: 1850.00, notes: "Professional bass clarinet to low C"
  },

  // WOODWIND SECTION - Saxophones
  {
    id: "eq_saxophone_001", qrCode: "QR_SAXOPHONE_001", serialNumber: "SX-2024-001",
    make: "Selmer", model: "AS42", category: "WOODWIND",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Storage Room B",
    lastMaintenance: "2024-06-15", nextMaintenance: "2024-12-15",
    purchasePrice: 1250.00, notes: "Alto saxophone, professional quality"
  },
  {
    id: "eq_saxophone_002", qrCode: "QR_SAXOPHONE_002", serialNumber: "SX-2024-002",
    make: "Yamaha", model: "YAS-280", category: "WOODWIND",
    condition: "GOOD", status: "CHECKED_OUT", location: "Practice Room 6",
    assignedTo: "student.woodwind3@band.app", checkoutDate: "2024-08-24", expectedReturn: "2024-09-24",
    lastMaintenance: "2024-05-20", nextMaintenance: "2024-11-20",
    purchasePrice: 950.00, notes: "Student alto saxophone"
  },
  {
    id: "eq_tenorsax_001", qrCode: "QR_TENORSAX_001", serialNumber: "TS-2024-001",
    make: "Conn", model: "TS650", category: "WOODWIND",
    condition: "GOOD", status: "AVAILABLE", location: "Storage Room B",
    lastMaintenance: "2024-07-08", nextMaintenance: "2025-01-08",
    purchasePrice: 1450.00, notes: "Tenor saxophone with case"
  },
  {
    id: "eq_barisax_001", qrCode: "QR_BARISAX_001", serialNumber: "BS-2024-001",
    make: "Yamaha", model: "YBS-52", category: "WOODWIND",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Storage Room B",
    lastMaintenance: "2024-08-12", nextMaintenance: "2025-02-12",
    purchasePrice: 2850.00, notes: "Baritone saxophone, low A"
  },

  // WOODWIND SECTION - Double Reeds
  {
    id: "eq_oboe_001", qrCode: "QR_OBOE_001", serialNumber: "OB-2024-001",
    make: "Fox", model: "330", category: "WOODWIND",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Storage Room B",
    lastMaintenance: "2024-08-20", nextMaintenance: "2025-02-20",
    purchasePrice: 1680.00, notes: "Student oboe with synthetic wood body"
  },
  {
    id: "eq_bassoon_001", qrCode: "QR_BASSOON_001", serialNumber: "BN-2024-001",
    make: "Fox", model: "220", category: "WOODWIND",
    condition: "GOOD", status: "AVAILABLE", location: "Storage Room B",
    lastMaintenance: "2024-06-30", nextMaintenance: "2024-12-30",
    purchasePrice: 3200.00, notes: "Student bassoon with case and accessories"
  },

  // PERCUSSION SECTION - Snare Drums
  {
    id: "eq_snare_001", qrCode: "QR_SNARE_001", serialNumber: "SD-2024-001",
    make: "Pearl", model: "CRB1455S/C", category: "PERCUSSION",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Band Room",
    lastMaintenance: "2024-07-01", nextMaintenance: "2025-07-01",
    purchasePrice: 280.00, notes: "Concert snare drum with stand"
  },
  {
    id: "eq_snare_002", qrCode: "QR_SNARE_002", serialNumber: "SD-2024-002",
    make: "Ludwig", model: "LM402", category: "PERCUSSION",
    condition: "GOOD", status: "CHECKED_OUT", location: "Practice Room 7",
    assignedTo: "student.percussion1@band.app", checkoutDate: "2024-08-23", expectedReturn: "2024-09-23",
    lastMaintenance: "2024-05-15", nextMaintenance: "2024-11-15",
    purchasePrice: 320.00, notes: "Marching snare drum"
  },

  // PERCUSSION SECTION - Timpani
  {
    id: "eq_timpani_001", qrCode: "QR_TIMPANI_001", serialNumber: "TI-2024-001",
    make: "Adams", model: "Professional 32\"", category: "PERCUSSION",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Band Room",
    lastMaintenance: "2024-08-25", nextMaintenance: "2025-08-25",
    purchasePrice: 4500.00, notes: "Professional timpani, requires tuning"
  },
  {
    id: "eq_timpani_002", qrCode: "QR_TIMPANI_002", serialNumber: "TI-2024-002",
    make: "Ludwig", model: "LKS423FG", category: "PERCUSSION",
    condition: "GOOD", status: "AVAILABLE", location: "Band Room",
    lastMaintenance: "2024-07-18", nextMaintenance: "2025-07-18",
    purchasePrice: 3800.00, notes: "23\" timpani with gauged tuning"
  },

  // PERCUSSION SECTION - Mallet Instruments
  {
    id: "eq_xylophone_001", qrCode: "QR_XYLOPHONE_001", serialNumber: "XY-2024-001",
    make: "Musser", model: "M51", category: "PERCUSSION",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Band Room",
    lastMaintenance: "2024-08-08", nextMaintenance: "2025-08-08",
    purchasePrice: 1200.00, notes: "3.5 octave concert xylophone"
  },
  {
    id: "eq_marimba_001", qrCode: "QR_MARIMBA_001", serialNumber: "MB-2024-001",
    make: "Yamaha", model: "YM-40", category: "PERCUSSION",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Band Room",
    lastMaintenance: "2024-08-15", nextMaintenance: "2025-08-15",
    purchasePrice: 2800.00, notes: "4.3 octave concert marimba"
  },
  {
    id: "eq_vibraphone_001", qrCode: "QR_VIBRAPHONE_001", serialNumber: "VB-2024-001",
    make: "Musser", model: "M55", category: "PERCUSSION",
    condition: "GOOD", status: "AVAILABLE", location: "Band Room",
    lastMaintenance: "2024-06-12", nextMaintenance: "2024-12-12",
    purchasePrice: 2200.00, notes: "3 octave vibraphone with motor"
  },

  // PERCUSSION SECTION - Cymbals & Accessories
  {
    id: "eq_cymbals_001", qrCode: "QR_CYMBALS_001", serialNumber: "CY-2024-001",
    make: "Zildjian", model: "A391", category: "PERCUSSION",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Band Room",
    lastMaintenance: "2024-07-25", nextMaintenance: "2025-07-25",
    purchasePrice: 385.00, notes: "18\" concert crash cymbals pair"
  },
  {
    id: "eq_bassdrum_001", qrCode: "QR_BASSDRUM_001", serialNumber: "BD-2024-001",
    make: "Pearl", model: "PBDM2614", category: "PERCUSSION",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Band Room",
    lastMaintenance: "2024-08-02", nextMaintenance: "2025-08-02",
    purchasePrice: 650.00, notes: "26\" concert bass drum with stand"
  },

  // STRING SECTION - Violins
  {
    id: "eq_violin_001", qrCode: "QR_VIOLIN_001", serialNumber: "VN-2024-001",
    make: "Stentor", model: "Student II", category: "STRING",
    condition: "GOOD", status: "AVAILABLE", location: "Orchestra Room",
    lastMaintenance: "2024-06-05", nextMaintenance: "2024-12-05",
    purchasePrice: 180.00, notes: "4/4 size violin with case"
  },
  {
    id: "eq_violin_002", qrCode: "QR_VIOLIN_002", serialNumber: "VN-2024-002",
    make: "Eastman", model: "VL80", category: "STRING",
    condition: "EXCELLENT", status: "CHECKED_OUT", location: "Orchestra Room",
    assignedTo: "student.string1@band.app", checkoutDate: "2024-08-22", expectedReturn: "2024-09-22",
    lastMaintenance: "2024-07-12", nextMaintenance: "2025-01-12",
    purchasePrice: 285.00, notes: "Intermediate violin with ebony fingerboard"
  },
  {
    id: "eq_violin_003", qrCode: "QR_VIOLIN_003", serialNumber: "VN-2024-003",
    make: "Yamaha", model: "V3SKA", category: "STRING",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Orchestra Room",
    lastMaintenance: "2024-08-01", nextMaintenance: "2025-02-01",
    purchasePrice: 320.00, notes: "3/4 size violin for younger students"
  },

  // STRING SECTION - Violas
  {
    id: "eq_viola_001", qrCode: "QR_VIOLA_001", serialNumber: "VA-2024-001",
    make: "Stentor", model: "Student II", category: "STRING",
    condition: "GOOD", status: "AVAILABLE", location: "Orchestra Room",
    lastMaintenance: "2024-06-15", nextMaintenance: "2024-12-15",
    purchasePrice: 220.00, notes: "16\" viola with case and bow"
  },
  {
    id: "eq_viola_002", qrCode: "QR_VIOLA_002", serialNumber: "VA-2024-002",
    make: "Eastman", model: "VA80", category: "STRING",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Orchestra Room",
    lastMaintenance: "2024-07-22", nextMaintenance: "2025-01-22",
    purchasePrice: 350.00, notes: "Intermediate viola with flamed maple back"
  },

  // STRING SECTION - Cellos
  {
    id: "eq_cello_001", qrCode: "QR_CELLO_001", serialNumber: "VC-2024-001",
    make: "Stentor", model: "Student II", category: "STRING",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Orchestra Room",
    lastMaintenance: "2024-08-10", nextMaintenance: "2025-02-10",
    purchasePrice: 450.00, notes: "4/4 size cello with soft case"
  },
  {
    id: "eq_cello_002", qrCode: "QR_CELLO_002", serialNumber: "VC-2024-002",
    make: "Yamaha", model: "VC5S", category: "STRING",
    condition: "GOOD", status: "CHECKED_OUT", location: "Practice Room 8",
    assignedTo: "student.string2@band.app", checkoutDate: "2024-08-21", expectedReturn: "2024-09-21",
    lastMaintenance: "2024-05-28", nextMaintenance: "2024-11-28",
    purchasePrice: 580.00, notes: "Intermediate cello with ebony fittings"
  },

  // STRING SECTION - Double Bass
  {
    id: "eq_doublebass_001", qrCode: "QR_DOUBLEBASS_001", serialNumber: "DB-2024-001",
    make: "Stentor", model: "Student", category: "STRING",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Orchestra Room",
    lastMaintenance: "2024-07-30", nextMaintenance: "2025-01-30",
    purchasePrice: 850.00, notes: "3/4 size double bass with German bow"
  },

  // ELECTRONIC SECTION
  {
    id: "eq_keyboard_001", qrCode: "QR_KEYBOARD_001", serialNumber: "KB-2024-001",
    make: "Yamaha", model: "P-125", category: "ELECTRONIC",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Music Lab",
    lastMaintenance: "2024-08-05", nextMaintenance: "2025-08-05",
    purchasePrice: 650.00, notes: "88-key weighted digital piano"
  },
  {
    id: "eq_amplifier_001", qrCode: "QR_AMPLIFIER_001", serialNumber: "AMP-2024-001",
    make: "Roland", model: "KC-200", category: "ELECTRONIC",
    condition: "GOOD", status: "AVAILABLE", location: "Music Lab",
    lastMaintenance: "2024-06-18", nextMaintenance: "2024-12-18",
    purchasePrice: 485.00, notes: "4-channel keyboard amplifier"
  },

  // ACCESSORIES
  {
    id: "eq_musicstand_001", qrCode: "QR_MUSICSTAND_001", serialNumber: "MS-2024-001",
    make: "Manhasset", model: "48", category: "ACCESSORY",
    condition: "GOOD", status: "AVAILABLE", location: "Band Room",
    lastMaintenance: "2024-07-01", nextMaintenance: "2025-07-01",
    purchasePrice: 65.00, notes: "Symphony music stand"
  },
  {
    id: "eq_metronome_001", qrCode: "QR_METRONOME_001", serialNumber: "MET-2024-001",
    make: "Korg", model: "MA-2", category: "ACCESSORY",
    condition: "EXCELLENT", status: "CHECKED_OUT", location: "Practice Room 9",
    assignedTo: "student@band.app", checkoutDate: "2024-08-30", expectedReturn: "2024-09-13",
    lastMaintenance: "2024-08-01", nextMaintenance: "2025-08-01",
    purchasePrice: 25.00, notes: "Digital metronome with tap tempo"
  },
  {
    id: "eq_tuner_001", qrCode: "QR_TUNER_001", serialNumber: "TUN-2024-001",
    make: "Boss", model: "TU-30", category: "ACCESSORY",
    condition: "EXCELLENT", status: "AVAILABLE", location: "Band Room",
    lastMaintenance: "2024-07-15", nextMaintenance: "2025-07-15",
    purchasePrice: 45.00, notes: "Chromatic tuner with metronome"
  }
];

export const MOCK_QR_CODES = MOCK_EQUIPMENT.map(eq => eq.qrCode);

export interface MockStudent {
  id: string;
  email: string;
  name: string;
  gradeLevel: number;
  bandSection: string;
  primaryInstrument: string;
  parentContact: string;
  academicStanding: string;
  equipmentHistory: string[];
  currentAssignments: MockEquipment[];
}

export const MOCK_STUDENTS: MockStudent[] = [
  {
    id: "student_001", email: "student@band.app", name: "Student User", gradeLevel: 10,
    bandSection: "brass", primaryInstrument: "trumpet", parentContact: "parent.student@email.com",
    academicStanding: "good_standing", equipmentHistory: ["QR_TRUMPET_002", "QR_METRONOME_001"],
    currentAssignments: MOCK_EQUIPMENT.filter(eq => eq.assignedTo === "student@band.app")
  },
  {
    id: "student_002", email: "student.brass1@band.app", name: "Emma Thompson", gradeLevel: 11,
    bandSection: "brass", primaryInstrument: "french_horn", parentContact: "parent.thompson@email.com",
    academicStanding: "excellent", equipmentHistory: ["QR_FRENCHHORN_002"],
    currentAssignments: MOCK_EQUIPMENT.filter(eq => eq.assignedTo === "student.brass1@band.app")
  },
  {
    id: "student_003", email: "student.brass2@band.app", name: "Michael Rodriguez", gradeLevel: 9,
    bandSection: "brass", primaryInstrument: "trumpet", parentContact: "parent.rodriguez@email.com",
    academicStanding: "good_standing", equipmentHistory: ["QR_TRUMPET_004"],
    currentAssignments: MOCK_EQUIPMENT.filter(eq => eq.assignedTo === "student.brass2@band.app")
  },
  {
    id: "student_004", email: "student.woodwind1@band.app", name: "Sophia Chen", gradeLevel: 10,
    bandSection: "woodwind", primaryInstrument: "flute", parentContact: "parent.chen@email.com",
    academicStanding: "good_standing", equipmentHistory: ["QR_FLUTE_002"],
    currentAssignments: MOCK_EQUIPMENT.filter(eq => eq.assignedTo === "student.woodwind1@band.app")
  },
  {
    id: "student_005", email: "student.woodwind2@band.app", name: "James Park", gradeLevel: 11,
    bandSection: "woodwind", primaryInstrument: "clarinet", parentContact: "parent.park@email.com",
    academicStanding: "excellent", equipmentHistory: ["QR_CLARINET_002"],
    currentAssignments: MOCK_EQUIPMENT.filter(eq => eq.assignedTo === "student.woodwind2@band.app")
  },
  {
    id: "student_006", email: "student.woodwind3@band.app", name: "Isabella Martinez", gradeLevel: 12,
    bandSection: "woodwind", primaryInstrument: "saxophone", parentContact: "parent.martinez@email.com",
    academicStanding: "excellent", equipmentHistory: ["QR_SAXOPHONE_002", "QR_SAXOPHONE_001"],
    currentAssignments: MOCK_EQUIPMENT.filter(eq => eq.assignedTo === "student.woodwind3@band.app")
  },
  {
    id: "student_007", email: "student.percussion1@band.app", name: "David Kim", gradeLevel: 10,
    bandSection: "percussion", primaryInstrument: "snare_drum", parentContact: "parent.kim@email.com",
    academicStanding: "good_standing", equipmentHistory: ["QR_SNARE_002"],
    currentAssignments: MOCK_EQUIPMENT.filter(eq => eq.assignedTo === "student.percussion1@band.app")
  },
  {
    id: "student_008", email: "student.string1@band.app", name: "Olivia Johnson", gradeLevel: 9,
    bandSection: "string", primaryInstrument: "violin", parentContact: "parent.johnson@email.com",
    academicStanding: "good_standing", equipmentHistory: ["QR_VIOLIN_002"],
    currentAssignments: MOCK_EQUIPMENT.filter(eq => eq.assignedTo === "student.string1@band.app")
  },
  {
    id: "student_009", email: "student.string2@band.app", name: "Alexander Brown", gradeLevel: 11,
    bandSection: "string", primaryInstrument: "cello", parentContact: "parent.brown@email.com",
    academicStanding: "excellent", equipmentHistory: ["QR_CELLO_002"],
    currentAssignments: MOCK_EQUIPMENT.filter(eq => eq.assignedTo === "student.string2@band.app")
  },
  {
    id: "student_010", email: "student.brass3@band.app", name: "Ashley Davis", gradeLevel: 12,
    bandSection: "brass", primaryInstrument: "trombone", parentContact: "parent.davis@email.com",
    academicStanding: "excellent", equipmentHistory: ["QR_TROMBONE_001", "QR_TROMBONE_003"],
    currentAssignments: []
  }
];

export interface MockBandEvent {
  id: string;
  name: string;
  type: 'CONCERT' | 'REHEARSAL' | 'COMPETITION' | 'PARADE' | 'CLINIC' | 'FUNDRAISER';
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  requiredSections: string[];
  equipmentNeeded: string[];
  expectedAttendance: number;
  specialRequirements?: string;
  contactPerson: string;
}

export const MOCK_BAND_EVENTS: MockBandEvent[] = [
  {
    id: "event_001", name: "Fall Concert", type: "CONCERT", date: "2024-10-15",
    startTime: "19:00", endTime: "21:00", location: "School Auditorium",
    description: "Annual fall concert featuring symphonic band and jazz ensemble",
    status: "SCHEDULED", requiredSections: ["brass", "woodwind", "percussion"],
    equipmentNeeded: ["QR_TIMPANI_001", "QR_MARIMBA_001", "QR_VIBRAPHONE_001"],
    expectedAttendance: 300, contactPerson: "Band Director",
    specialRequirements: "Formal black attire required"
  },
  {
    id: "event_002", name: "Marching Band Practice", type: "REHEARSAL", date: "2024-09-05",
    startTime: "16:00", endTime: "18:00", location: "Football Field",
    description: "Weekly marching band rehearsal for football season",
    status: "COMPLETED", requiredSections: ["brass", "woodwind", "percussion"],
    equipmentNeeded: ["QR_SNARE_002"], expectedAttendance: 85,
    contactPerson: "Assistant Director",
    specialRequirements: "Marching shoes and water required"
  },
  {
    id: "event_003", name: "Regional Band Competition", type: "COMPETITION", date: "2024-11-02",
    startTime: "08:00", endTime: "17:00", location: "State University Concert Hall",
    description: "State regional band competition - Grade AA division",
    status: "SCHEDULED", requiredSections: ["brass", "woodwind", "percussion"],
    equipmentNeeded: ["QR_TUBA_001", "QR_EUPHONIUM_001", "QR_BASSCLARINET_001"],
    expectedAttendance: 65, contactPerson: "Band Director",
    specialRequirements: "Transportation via school bus, lunch provided"
  },
  {
    id: "event_004", name: "Holiday Parade", type: "PARADE", date: "2024-12-14",
    startTime: "10:00", endTime: "12:00", location: "Main Street Downtown",
    description: "Annual holiday parade through downtown",
    status: "SCHEDULED", requiredSections: ["brass", "woodwind", "percussion"],
    equipmentNeeded: ["QR_SNARE_001", "QR_SNARE_002", "QR_BASSDRUM_001"],
    expectedAttendance: 75, contactPerson: "Band Director",
    specialRequirements: "Holiday uniforms, warm weather gear"
  },
  {
    id: "event_005", name: "Orchestra Joint Concert", type: "CONCERT", date: "2024-12-20",
    startTime: "19:30", endTime: "21:30", location: "School Auditorium",
    description: "Combined band and orchestra winter concert",
    status: "SCHEDULED", requiredSections: ["brass", "woodwind", "percussion", "string"],
    equipmentNeeded: ["QR_VIOLIN_001", "QR_VIOLIN_003", "QR_VIOLA_001", "QR_CELLO_001"],
    expectedAttendance: 350, contactPerson: "Music Department Head",
    specialRequirements: "Combined rehearsal required December 18th"
  },
  {
    id: "event_006", name: "Woodwind Sectional", type: "REHEARSAL", date: "2024-09-12",
    startTime: "15:30", endTime: "17:00", location: "Band Room",
    description: "Sectional rehearsal for woodwind players",
    status: "COMPLETED", requiredSections: ["woodwind"],
    equipmentNeeded: ["QR_PICCOLO_001", "QR_OBOE_001", "QR_BASSOON_001"],
    expectedAttendance: 25, contactPerson: "Woodwind Specialist"
  },
  {
    id: "event_007", name: "Jazz Ensemble Clinic", type: "CLINIC", date: "2024-10-25",
    startTime: "13:00", endTime: "16:00", location: "Music Lab",
    description: "Professional jazz clinic with guest artist",
    status: "SCHEDULED", requiredSections: ["brass", "woodwind"],
    equipmentNeeded: ["QR_SAXOPHONE_001", "QR_TENORSAX_001", "QR_BARISAX_001"],
    expectedAttendance: 20, contactPerson: "Jazz Director",
    specialRequirements: "Advanced players only"
  },
  {
    id: "event_008", name: "Band Fundraiser Dinner", type: "FUNDRAISER", date: "2024-11-16",
    startTime: "18:00", endTime: "21:00", location: "School Cafeteria",
    description: "Annual fundraising dinner with performances",
    status: "SCHEDULED", requiredSections: ["brass", "woodwind", "percussion"],
    equipmentNeeded: ["QR_KEYBOARD_001", "QR_AMPLIFIER_001"],
    expectedAttendance: 150, contactPerson: "Parent Coordinator",
    specialRequirements: "Concert attire for performers"
  }
];

export interface MockMaintenanceRecord {
  id: string;
  equipmentId: string;
  qrCode: string;
  maintenanceType: 'ROUTINE' | 'REPAIR' | 'DEEP_CLEAN' | 'INSPECTION' | 'EMERGENCY';
  scheduledDate: string;
  completedDate?: string;
  technicianName: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  cost?: number;
  description: string;
  notes?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimatedDuration: number; // in minutes
}

export const MOCK_MAINTENANCE_RECORDS: MockMaintenanceRecord[] = [
  {
    id: "maint_001", equipmentId: "eq_trombone_002", qrCode: "QR_TROMBONE_002",
    maintenanceType: "REPAIR", scheduledDate: "2024-08-30", completedDate: "2024-09-02",
    technicianName: "Mike's Music Repair", status: "COMPLETED", cost: 85.00,
    description: "Slide alignment and tuning", notes: "Slide was binding, now smooth operation",
    priority: "HIGH", estimatedDuration: 120
  },
  {
    id: "maint_002", equipmentId: "eq_timpani_001", qrCode: "QR_TIMPANI_001",
    maintenanceType: "ROUTINE", scheduledDate: "2024-09-15", technicianName: "School Maintenance",
    status: "SCHEDULED", description: "Head replacement and tuning calibration",
    priority: "MEDIUM", estimatedDuration: 90
  },
  {
    id: "maint_003", equipmentId: "eq_saxophone_002", qrCode: "QR_SAXOPHONE_002",
    maintenanceType: "DEEP_CLEAN", scheduledDate: "2024-09-10", technicianName: "Band Director",
    status: "SCHEDULED", description: "Complete disassembly and cleaning",
    priority: "LOW", estimatedDuration: 60
  },
  {
    id: "maint_004", equipmentId: "eq_violin_001", qrCode: "QR_VIOLIN_001",
    maintenanceType: "INSPECTION", scheduledDate: "2024-09-08", technicianName: "String Specialist",
    status: "IN_PROGRESS", description: "Bridge adjustment and string replacement",
    priority: "MEDIUM", estimatedDuration: 45
  },
  {
    id: "maint_005", equipmentId: "eq_flute_002", qrCode: "QR_FLUTE_002",
    maintenanceType: "REPAIR", scheduledDate: "2024-09-20", technicianName: "Woodwind Repair Co",
    status: "SCHEDULED", description: "Key mechanism adjustment", cost: 45.00,
    priority: "MEDIUM", estimatedDuration: 75
  }
];

// Voice recognition mock phrases
export const MOCK_VOICE_PHRASES = [
  "Student ID 12345 checking out trumpet",
  "Equipment condition is excellent",
  "Maintenance required for trombone serial TR-001", 
  "Return date should be next Friday",
  "This instrument needs cleaning",
  "Student completed practice session",
  "Performance ready for fall concert",
  "QR code TR-2024-001 scanned successfully"
];

// Mock scanner results for different QR codes
export const getMockScanResult = (qrCode: string) => {
  const equipment = MOCK_EQUIPMENT.find(eq => eq.qrCode === qrCode);
  
  if (!equipment) {
    return {
      success: false,
      error: "Equipment not found",
      scannedAt: new Date().toISOString()
    };
  }

  return {
    success: true,
    equipment,
    scannedAt: new Date().toISOString(),
    scanLocation: "Mock Scanner",
    confidence: 0.95
  };
};

// Equipment status color mapping
export const getEquipmentStatusColor = (status: string): string => {
  switch (status) {
    case 'AVAILABLE': return 'text-green-600 bg-green-50 border-green-200';
    case 'CHECKED_OUT': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'IN_MAINTENANCE': return 'text-red-600 bg-red-50 border-red-200';
    case 'RETIRED': return 'text-gray-600 bg-gray-50 border-gray-200';
    case 'MISSING': return 'text-purple-600 bg-purple-50 border-purple-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// Equipment condition color mapping
export const getEquipmentConditionColor = (condition: string): string => {
  switch (condition) {
    case 'EXCELLENT': return 'text-green-700 bg-green-100';
    case 'GOOD': return 'text-blue-700 bg-blue-100';
    case 'FAIR': return 'text-yellow-700 bg-yellow-100';
    case 'POOR': return 'text-orange-700 bg-orange-100';
    case 'REPAIR_NEEDED': return 'text-red-700 bg-red-100';
    default: return 'text-gray-700 bg-gray-100';
  }
};