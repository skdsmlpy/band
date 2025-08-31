CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(64) NOT NULL,
  priority VARCHAR(32) NOT NULL,
  due_date TIMESTAMP NULL,
  assignee_id UUID NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS queues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(128) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS queue_tasks (
  queue_id UUID NOT NULL REFERENCES queues(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  PRIMARY KEY (queue_id, task_id)
);

-- seed users (password: password)
INSERT INTO users (email, password, name, role) VALUES
('admin@band.app', '$2a$12$gqu1xF7dF0bTl1s5aXmyZeu0H8qB0rN7tK.4g3m0m2n1h.4JwN9bS', 'Admin User', 'Admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password, name, role) VALUES
('operator@band.app', '$2a$12$gqu1xF7dF0bTl1s5aXmyZeu0H8qB0rN7tK.4g3m0m2n1h.4JwN9bS', 'Operator One', 'Operator')
ON CONFLICT (email) DO NOTHING;

-- queues
INSERT INTO queues (id, name) VALUES (uuid_generate_v4(), 'STUDENT_EQUIPMENT_QUEUE') ON CONFLICT DO NOTHING;
INSERT INTO queues (id, name) VALUES (uuid_generate_v4(), 'DIRECTOR_MANAGEMENT_QUEUE') ON CONFLICT DO NOTHING;
INSERT INTO queues (id, name) VALUES (uuid_generate_v4(), 'EQUIPMENT_MAINTENANCE_QUEUE') ON CONFLICT DO NOTHING;

-- tasks
INSERT INTO tasks (title, status, priority)
VALUES ('Verify student eligibility', 'new', 'high')
ON CONFLICT DO NOTHING;
INSERT INTO tasks (title, status, priority)
VALUES ('Scan equipment QR', 'in_progress', 'medium')
ON CONFLICT DO NOTHING;
