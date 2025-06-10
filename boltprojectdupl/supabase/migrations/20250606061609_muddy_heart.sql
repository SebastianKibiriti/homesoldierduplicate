/*
  # Add Feedback Table

  1. New Tables
    - `feedback`
      - `id` (uuid, primary key)
      - `email` (text)
      - `message` (text)
      - `submitted_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policy for public feedback submission
    - Add policy for admin viewing
*/

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  message text NOT NULL,
  submitted_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Allow public feedback submission
CREATE POLICY "Anyone can submit feedback"
  ON feedback
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users can view feedback
CREATE POLICY "Authenticated users can view feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER set_feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();