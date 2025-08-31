-- V4: Seed comprehensive band equipment data and enhanced user profiles

-- Update existing users with enhanced profiles
UPDATE users SET 
    grade_level = 10,
    band_section = 'brass',
    primary_instrument = 'trumpet',
    parent_contact = 'parent.student@email.com',
    enrollment_date = '2024-08-15'::timestamp
WHERE email = 'student@band.app';

UPDATE users SET 
    phone_number = '555-0101',
    notification_preferences = '{"email": true, "push": true, "sms": false}'
WHERE email = 'director@band.app';

UPDATE users SET 
    phone_number = '555-0102',
    notification_preferences = '{"email": true, "push": true, "sms": true}'
WHERE email = 'equipment@band.app';

-- Add more diverse student users
INSERT INTO users (email, password, name, role, grade_level, band_section, primary_instrument, parent_contact, enrollment_date, active) VALUES
('student.brass1@band.app', '$2a$12$gqu1xF7dF0bTl1s5aXmyZeu0H8qB0rN7tK.4g3m0m2n1h.4JwN9bS', 'Emma Thompson', 'Student', 11, 'brass', 'french_horn', 'parent.thompson@email.com', '2024-08-15', true),
('student.brass2@band.app', '$2a$12$gqu1xF7dF0bTl1s5aXmyZeu0H8qB0rN7tK.4g3m0m2n1h.4JwN9bS', 'Marcus Johnson', 'Student', 12, 'brass', 'trombone', 'parent.johnson@email.com', '2024-08-15', true),
('student.woodwind1@band.app', '$2a$12$gqu1xF7dF0bTl1s5aXmyZeu0H8qB0rN7tK.4g3m0m2n1h.4JwN9bS', 'Sophia Chen', 'Student', 10, 'woodwind', 'flute', 'parent.chen@email.com', '2024-08-15', true),
('student.woodwind2@band.app', '$2a$12$gqu1xF7dF0bTl1s5aXmyZeu0H8qB0rN7tK.4g3m0m2n1h.4JwN9bS', 'David Rodriguez', 'Student', 11, 'woodwind', 'clarinet', 'parent.rodriguez@email.com', '2024-08-15', true),
('student.percussion1@band.app', '$2a$12$gqu1xF7dF0bTl1s5aXmyZeu0H8qB0rN7tK.4g3m0m2n1h.4JwN9bS', 'Riley Park', 'Student', 12, 'percussion', 'snare_drum', 'parent.park@email.com', '2024-08-15', true),
('student.string1@band.app', '$2a$12$gqu1xF7dF0bTl1s5aXmyZeu0H8qB0rN7tK.4g3m0m2n1h.4JwN9bS', 'Aiden O''Connor', 'Student', 10, 'string', 'violin', 'parent.oconnor@email.com', '2024-08-15', true)
ON CONFLICT (email) DO NOTHING;

-- Insert comprehensive equipment inventory

-- BRASS SECTION
INSERT INTO equipment (qr_code, serial_number, make, model, category, condition, location, purchase_date, purchase_price, maintenance_interval_months, notes) VALUES
('QR_TRUMPET_001', 'TR-2024-001', 'Yamaha', 'YTR-2330', 'BRASS', 'EXCELLENT', 'Storage Room A', '2024-01-15', 450.00, 6, 'Student model trumpet, excellent for beginners'),
('QR_TRUMPET_002', 'TR-2024-002', 'Bach', 'TR300H2', 'BRASS', 'GOOD', 'Practice Room 1', '2023-08-20', 520.00, 6, 'Intermediate trumpet, slight wear on valves'),
('QR_TRUMPET_003', 'TR-2024-003', 'Yamaha', 'YTR-4335GII', 'BRASS', 'EXCELLENT', 'Storage Room A', '2024-02-10', 850.00, 6, 'Advanced student model'),
('QR_TROMBONE_001', 'TB-2024-001', 'Yamaha', 'YSL-354', 'BRASS', 'GOOD', 'Storage Room A', '2023-09-12', 380.00, 6, 'Student trombone with F attachment'),
('QR_TROMBONE_002', 'TB-2024-002', 'Bach', 'TB200B', 'BRASS', 'FAIR', 'Repair Shop', '2022-11-05', 420.00, 4, 'Needs slide alignment, scheduled for maintenance'),
('QR_FRENCHHORN_001', 'FH-2024-001', 'Holton', 'H179', 'BRASS', 'EXCELLENT', 'Storage Room A', '2024-03-22', 1200.00, 8, 'Double horn, professional quality'),
('QR_EUPHONIUM_001', 'EU-2024-001', 'Yamaha', 'YEP-201', 'BRASS', 'GOOD', 'Band Room', '2023-06-18', 980.00, 6, 'Compensating euphonium'),
('QR_TUBA_001', 'TU-2024-001', 'Miraphone', 'M7000S', 'BRASS', 'EXCELLENT', 'Band Room', '2024-01-30', 2100.00, 8, 'Concert tuba, requires careful handling'),

-- WOODWIND SECTION  
('QR_FLUTE_001', 'FL-2024-001', 'Gemeinhardt', '3OB', 'WOODWIND', 'EXCELLENT', 'Storage Room B', '2024-02-14', 320.00, 6, 'Open hole flute, student model'),
('QR_FLUTE_002', 'FL-2024-002', 'Pearl', 'PF505E', 'WOODWIND', 'GOOD', 'Practice Room 2', '2023-10-08', 380.00, 6, 'Solid head joint, needs pad replacement soon'),
('QR_CLARINET_001', 'CL-2024-001', 'Buffet', 'B12', 'WOODWIND', 'EXCELLENT', 'Storage Room B', '2024-01-20', 650.00, 4, 'Professional student model'),
('QR_CLARINET_002', 'CL-2024-002', 'Yamaha', 'YCL-255', 'WOODWIND', 'GOOD', 'Practice Room 3', '2023-07-15', 420.00, 4, 'Needs cork replacement'),
('QR_SAXOPHONE_001', 'SX-2024-001', 'Selmer', 'AS42', 'WOODWIND', 'EXCELLENT', 'Storage Room B', '2024-03-05', 1250.00, 6, 'Alto saxophone, professional quality'),
('QR_SAXOPHONE_002', 'SX-2024-002', 'Yamaha', 'YAS-280', 'WOODWIND', 'GOOD', 'Band Room', '2023-09-28', 890.00, 6, 'Student alto sax'),
('QR_OBOE_001', 'OB-2024-001', 'Fox', '330', 'WOODWIND', 'FAIR', 'Storage Room B', '2022-12-10', 1800.00, 3, 'Requires regular reed maintenance'),
('QR_BASSOON_001', 'BN-2024-001', 'Fox', '220', 'WOODWIND', 'GOOD', 'Storage Room B', '2023-11-22', 3200.00, 8, 'Student bassoon, excellent condition'),

-- PERCUSSION SECTION
('QR_SNARE_001', 'SD-2024-001', 'Pearl', 'CRB1455S/C', 'PERCUSSION', 'EXCELLENT', 'Band Room', '2024-01-12', 280.00, 12, 'Concert snare drum with stand'),
('QR_SNARE_002', 'SD-2024-002', 'Ludwig', 'LM402', 'PERCUSSION', 'GOOD', 'Practice Room 4', '2023-08-30', 320.00, 12, 'Marching snare drum'),
('QR_TIMPANI_001', 'TI-2024-001', 'Adams', 'Professional 32"', 'PERCUSSION', 'EXCELLENT', 'Band Room', '2024-02-25', 4500.00, 12, 'Professional timpani, requires tuning'),
('QR_TIMPANI_002', 'TI-2024-002', 'Adams', 'Professional 29"', 'PERCUSSION', 'EXCELLENT', 'Band Room', '2024-02-25', 4200.00, 12, 'Professional timpani, excellent tone'),
('QR_XYLOPHONE_001', 'XY-2024-001', 'Musser', 'M51', 'PERCUSSION', 'GOOD', 'Band Room', '2023-10-15', 1800.00, 8, '3.5 octave xylophone'),
('QR_VIBRAPHONE_001', 'VB-2024-001', 'Musser', 'M55', 'PERCUSSION', 'EXCELLENT', 'Band Room', '2024-03-18', 3200.00, 8, 'Professional vibraphone with motor'),
('QR_DRUMSET_001', 'DS-2024-001', 'Pearl', 'Export EXX705N', 'PERCUSSION', 'GOOD', 'Practice Room 5', '2023-05-20', 650.00, 6, '5-piece drum set with cymbals'),

-- STRING SECTION
('QR_VIOLIN_001', 'VN-2024-001', 'Stentor', 'Student II', 'STRING', 'GOOD', 'Orchestra Room', '2023-09-05', 180.00, 6, '4/4 size violin with case'),
('QR_VIOLIN_002', 'VN-2024-002', 'Eastman', 'VL80', 'STRING', 'EXCELLENT', 'Orchestra Room', '2024-01-28', 320.00, 6, 'Step-up violin, excellent tone'),
('QR_VIOLA_001', 'VA-2024-001', 'Scherl & Roth', 'R30E4H', 'STRING', 'GOOD', 'Orchestra Room', '2023-11-12', 250.00, 6, '16" viola with case'),
('QR_CELLO_001', 'CE-2024-001', 'Stentor', 'Student II', 'STRING', 'EXCELLENT', 'Orchestra Room', '2024-02-08', 450.00, 6, '4/4 cello with bow'),
('QR_BASS_001', 'DB-2024-001', 'Engelhardt', 'ES1', 'STRING', 'GOOD', 'Orchestra Room', '2023-07-25', 980.00, 8, '3/4 upright bass'),

-- ELECTRONIC & ACCESSORIES
('QR_KEYBOARD_001', 'KB-2024-001', 'Yamaha', 'P-125', 'ELECTRONIC', 'EXCELLENT', 'Band Room', '2024-03-10', 650.00, 12, '88-key digital piano'),
('QR_AMP_001', 'AM-2024-001', 'Fender', 'Champion 40', 'ELECTRONIC', 'GOOD', 'Practice Room 6', '2023-12-05', 180.00, 12, 'Guitar amplifier'),
('QR_METRONOME_001', 'MT-2024-001', 'Korg', 'MA-2', 'ACCESSORY', 'EXCELLENT', 'Equipment Storage', '2024-01-08', 25.00, 24, 'Digital metronome'),
('QR_STAND_001', 'ST-2024-001', 'K&M', '100/1', 'ACCESSORY', 'GOOD', 'Equipment Storage', '2023-08-15', 35.00, 24, 'Music stand, adjustable height')
ON CONFLICT (qr_code) DO NOTHING;

-- Insert some equipment assignments (current checkouts)
INSERT INTO equipment_assignments (student_id, equipment_id, checkout_date, expected_return_date, status, assignment_purpose, checkout_condition, checkout_notes) 
SELECT 
    u.id,
    e.id,
    now() - INTERVAL '3 days',
    now() + INTERVAL '27 days',
    'CHECKED_OUT',
    'practice',
    e.condition,
    'Regular practice assignment'
FROM users u, equipment e 
WHERE u.email = 'student@band.app' AND e.qr_code = 'QR_TRUMPET_002';

INSERT INTO equipment_assignments (student_id, equipment_id, checkout_date, expected_return_date, status, assignment_purpose, checkout_condition, checkout_notes) 
SELECT 
    u.id,
    e.id,
    now() - INTERVAL '5 days',
    now() + INTERVAL '25 days',
    'CHECKED_OUT',
    'practice',
    e.condition,
    'Advanced student assignment'
FROM users u, equipment e 
WHERE u.email = 'student.woodwind1@band.app' AND e.qr_code = 'QR_FLUTE_002';

-- Update equipment status for checked out items
UPDATE equipment SET 
    status = 'CHECKED_OUT',
    assigned_to_id = (SELECT id FROM users WHERE email = 'student@band.app'),
    assignment_date = now() - INTERVAL '3 days',
    expected_return_date = now() + INTERVAL '27 days'
WHERE qr_code = 'QR_TRUMPET_002';

UPDATE equipment SET 
    status = 'CHECKED_OUT',
    assigned_to_id = (SELECT id FROM users WHERE email = 'student.woodwind1@band.app'),
    assignment_date = now() - INTERVAL '5 days',
    expected_return_date = now() + INTERVAL '25 days'
WHERE qr_code = 'QR_FLUTE_002';

-- Insert some maintenance records
INSERT INTO equipment_maintenance (equipment_id, maintenance_type, scheduled_date, status, priority, work_description, created_by) 
SELECT 
    e.id,
    'CLEANING',
    current_date + INTERVAL '7 days',
    'SCHEDULED',
    'MEDIUM',
    'Deep cleaning and inspection of trombone slide',
    u.id
FROM equipment e, users u 
WHERE e.qr_code = 'QR_TROMBONE_002' AND u.email = 'equipment@band.app';

INSERT INTO equipment_maintenance (equipment_id, maintenance_type, scheduled_date, completed_date, status, priority, work_description, work_performed, actual_cost, condition_after, created_by, completed_by) 
SELECT 
    e.id,
    'REPAIR',
    '2024-08-15'::date,
    '2024-08-18'::date,
    'COMPLETED',
    'HIGH',
    'Replace clarinet pads and corks',
    'Replaced 3 pads and upper joint cork. Adjusted spring tension.',
    85.50,
    'EXCELLENT',
    u.id,
    u.id
FROM equipment e, users u 
WHERE e.qr_code = 'QR_CLARINET_002' AND u.email = 'equipment@band.app';

-- Insert some band events
INSERT INTO band_events (name, event_date, event_type, venue, director_id, status, equipment_requirements, created_by) 
SELECT 
    'Fall Concert',
    '2024-12-15 19:00:00'::timestamp,
    'CONCERT',
    'School Auditorium',
    d.id,
    'PLANNED',
    '{"brass": 15, "woodwind": 12, "percussion": 8, "string": 6}',
    d.id
FROM users d WHERE d.email = 'director@band.app';

INSERT INTO band_events (name, event_date, event_type, venue, director_id, status, equipment_requirements, rehearsal_required, rehearsal_date, created_by) 
SELECT 
    'Regional Competition',
    '2025-03-20 10:00:00'::timestamp,
    'COMPETITION',
    'Regional Music Center',
    d.id,
    'PLANNED',
    '{"brass": 18, "woodwind": 15, "percussion": 10, "string": 8}',
    true,
    '2025-03-18 15:00:00'::timestamp,
    d.id
FROM users d WHERE d.email = 'director@band.app';

INSERT INTO band_events (name, event_date, event_type, venue, director_id, status, equipment_requirements, created_by) 
SELECT 
    'Weekly Practice Session',
    now() + INTERVAL '2 days',
    'PRACTICE',
    'Band Room',
    d.id,
    'CONFIRMED',
    '{"brass": 10, "woodwind": 8, "percussion": 5, "string": 4}',
    d.id
FROM users d WHERE d.email = 'director@band.app';

-- Insert some digital signatures
INSERT INTO digital_signatures (user_id, signature_data, signature_type, signature_name, legal_name, intent_statement) 
SELECT 
    u.id,
    '<svg width="200" height="60"><path d="M10,30 Q50,10 90,30 Q130,50 170,30" stroke="#000" stroke-width="2" fill="none"/></svg>',
    'GENERAL',
    'Primary Signature',
    u.name,
    'I acknowledge that this is my electronic signature and has the same legal effect as my handwritten signature.'
FROM users u WHERE u.email = 'student@band.app';

INSERT INTO digital_signatures (user_id, signature_data, signature_type, signature_name, legal_name, intent_statement) 
SELECT 
    u.id,
    '<svg width="200" height="60"><path d="M10,40 Q40,10 70,40 Q100,20 130,40 Q160,10 190,40" stroke="#000" stroke-width="2" fill="none"/></svg>',
    'EQUIPMENT_CHECKOUT',
    'Equipment Signature',
    u.name,
    'I acknowledge receipt of band equipment and agree to return it in good condition.'
FROM users u WHERE u.email = 'student@band.app';