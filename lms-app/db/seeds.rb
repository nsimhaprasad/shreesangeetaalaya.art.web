# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.

puts "Seeding database..."

# Clear existing data (in development only)
if Rails.env.development?
  puts "Cleaning up existing data..."
  BatchEnrollment.destroy_all
  Attendance.destroy_all
  Payment.destroy_all
  ClassSession.destroy_all
  ResourceAssignment.destroy_all
  LearningResource.destroy_all
  Batch.destroy_all
  Student.destroy_all
  Teacher.destroy_all
  FeeOffer.destroy_all
  FeeStructure.destroy_all
  Course.destroy_all
  User.destroy_all
end

# Create Admin User
puts "Creating admin user..."
admin_user = User.create!(
  email: 'admin@example.com',
  password: 'password',
  password_confirmation: 'password',
  role: 'admin',
  first_name: 'Admin',
  last_name: 'User',
  status: 'active'
)
puts "✓ Admin created: #{admin_user.email} / password"

# Create Courses
puts "\nCreating courses..."
carnatic_vocal = Course.create!(
  name: 'Carnatic Vocal',
  description: 'Traditional Carnatic vocal music training covering swaras, ragas, and compositions',
  course_type: 'vocal',
  status: 'active'
)

flute_course = Course.create!(
  name: 'Flute (Carnatic)',
  description: 'Carnatic flute training for beginners and intermediate students',
  course_type: 'instrumental',
  status: 'active'
)
puts "✓ Created #{Course.count} courses"

# Create Teachers
puts "\nCreating teachers..."
teacher1_user = User.create!(
  email: 'teacher1@example.com',
  password: 'password',
  password_confirmation: 'password',
  role: 'teacher',
  first_name: 'Vibha',
  last_name: 'Shree',
  phone: '9876543210',
  status: 'active'
)

teacher1 = Teacher.create!(
  user: teacher1_user,
  specialization: 'Carnatic Vocal',
  years_of_experience: 15,
  qualification: 'Vidwat in Carnatic Music',
  bio: 'Experienced Carnatic vocal teacher with 15 years of teaching experience.',
  is_admin: true
)

teacher2_user = User.create!(
  email: 'teacher2@example.com',
  password: 'password',
  password_confirmation: 'password',
  role: 'teacher',
  first_name: 'Ramesh',
  last_name: 'Kumar',
  phone: '9876543211',
  status: 'active'
)

teacher2 = Teacher.create!(
  user: teacher2_user,
  specialization: 'Flute',
  years_of_experience: 10,
  qualification: 'Master in Carnatic Flute',
  bio: 'Passionate flute instructor specializing in Carnatic music.',
  is_admin: false
)
puts "✓ Teacher 1: #{teacher1_user.email} / password (is_admin: #{teacher1.is_admin})"
puts "✓ Teacher 2: #{teacher2_user.email} / password"

# Create Students
puts "\nCreating students..."
students = []
10.times do |i|
  student_user = User.create!(
    email: "student#{i+1}@example.com",
    password: 'password',
    password_confirmation: 'password',
    role: 'student',
    first_name: "Student#{i+1}",
    last_name: 'Name',
    phone: "987654#{i.to_s.rjust(4, '0')}",
    status: 'active'
  )

  student = Student.create!(
    user: student_user,
    guardian_name: "Guardian #{i+1}",
    guardian_phone: "987655#{i.to_s.rjust(4, '0')}",
    guardian_email: "guardian#{i+1}@example.com",
    emergency_contact: "987656#{i.to_s.rjust(4, '0')}",
    enrollment_date: Date.today - rand(1..365).days,
    preferred_class_time: ['morning', 'afternoon', 'evening'].sample
  )

  students << student
  puts "✓ Student #{i+1}: #{student_user.email} / password"
end

# Create Batches
puts "\nCreating batches..."
batch1 = Batch.create!(
  name: 'Carnatic Vocal - Morning Batch',
  course: carnatic_vocal,
  teacher: teacher1,
  class_type: 'group',
  schedule_day: 'Monday, Wednesday, Friday',
  schedule_time: '09:00',
  max_students: 10,
  status: 'active',
  start_date: Date.today - 30.days
)

batch2 = Batch.create!(
  name: 'Carnatic Vocal - 1-on-1 Advanced',
  course: carnatic_vocal,
  teacher: teacher1,
  class_type: 'one_on_one',
  schedule_day: 'Tuesday, Thursday',
  schedule_time: '16:00',
  max_students: nil,
  status: 'active',
  start_date: Date.today - 60.days
)

batch3 = Batch.create!(
  name: 'Flute - Beginner Group',
  course: flute_course,
  teacher: teacher2,
  class_type: 'group',
  schedule_day: 'Tuesday, Thursday, Saturday',
  schedule_time: '10:00',
  max_students: 8,
  status: 'active',
  start_date: Date.today - 45.days
)
puts "✓ Created #{Batch.count} batches"

# Enroll students in batches
puts "\nEnrolling students in batches..."
# Batch 1 - 6 students
students[0..5].each_with_index do |student, i|
  BatchEnrollment.create!(
    batch: batch1,
    student: student,
    enrollment_date: Date.today - rand(20..30).days,
    status: 'active'
  )
end

# Batch 2 - 1 student (1-on-1)
BatchEnrollment.create!(
  batch: batch2,
  student: students[6],
  enrollment_date: Date.today - 60.days,
  status: 'active'
)

# Batch 3 - 3 students
students[7..9].each do |student|
  BatchEnrollment.create!(
    batch: batch3,
    student: student,
    enrollment_date: Date.today - rand(30..45).days,
    status: 'active'
  )
end
puts "✓ Enrolled #{BatchEnrollment.count} students in batches"

# Create Fee Structures
puts "\nCreating fee structures..."
FeeStructure.create!(
  batch: batch1,
  class_type: 'group',
  fee_type: 'monthly',
  amount: 3000,
  effective_from: Date.today - 30.days,
  effective_to: nil
)

FeeStructure.create!(
  batch: batch2,
  class_type: 'one_on_one',
  fee_type: 'per_class',
  amount: 800,
  effective_from: Date.today - 60.days,
  effective_to: nil
)

FeeStructure.create!(
  batch: batch3,
  class_type: 'group',
  fee_type: 'monthly',
  amount: 2500,
  effective_from: Date.today - 45.days,
  effective_to: nil
)
puts "✓ Created #{FeeStructure.count} fee structures"

# Create Fee Offers
puts "\nCreating fee offers..."
FeeOffer.create!(
  name: '3-Month Package Discount',
  description: 'Get 10% off when you pay for 3 months in advance',
  offer_type: 'percentage_discount',
  duration_months: 3,
  discount_percentage: 10,
  applicable_to: 'all_students',
  valid_from: Date.today - 30.days,
  valid_to: Date.today + 60.days,
  status: 'active'
)

FeeOffer.create!(
  name: '6-Month Special Package',
  description: 'Pay for 6 months and save ₹2000',
  offer_type: 'flat_discount',
  duration_months: 6,
  discount_amount: 2000,
  applicable_to: 'all_students',
  valid_from: Date.today - 15.days,
  valid_to: Date.today + 90.days,
  status: 'active'
)
puts "✓ Created #{FeeOffer.count} fee offers"

# Create Class Sessions and Attendance
puts "\nCreating class sessions and attendance records..."
# Batch 1 - Last 10 classes
10.times do |i|
  class_date = Date.today - (9-i).days
  class_session = ClassSession.create!(
    batch: batch1,
    class_date: class_date,
    class_time: '09:00',
    duration_minutes: 60,
    topic: "Lesson #{i+1}",
    notes: "Covered ragas and compositions",
    status: i < 9 ? 'completed' : 'scheduled'
  )

  # Mark attendance for completed classes
  if i < 9
    batch1.batch_enrollments.each do |enrollment|
      Attendance.create!(
        class_session: class_session,
        student: enrollment.student,
        status: ['present', 'present', 'present', 'absent', 'late'].sample,
        marked_at: class_date + 1.hour,
        marked_by: teacher1_user.id,
        notes: ''
      )
    end
  end
end

# Batch 3 - Last 8 classes
8.times do |i|
  class_date = Date.today - (7-i).days
  class_session = ClassSession.create!(
    batch: batch3,
    class_date: class_date,
    class_time: '10:00',
    duration_minutes: 60,
    topic: "Flute Lesson #{i+1}",
    status: i < 7 ? 'completed' : 'scheduled'
  )

  if i < 7
    batch3.batch_enrollments.each do |enrollment|
      Attendance.create!(
        class_session: class_session,
        student: enrollment.student,
        status: ['present', 'present', 'present', 'absent'].sample,
        marked_at: class_date + 1.hour,
        marked_by: teacher2_user.id
      )
    end
  end
end
puts "✓ Created #{ClassSession.count} class sessions"
puts "✓ Created #{Attendance.count} attendance records"

# Create Payments
puts "\nCreating payment records..."
# Batch 1 payments (monthly)
batch1.batch_enrollments.each do |enrollment|
  Payment.create!(
    student: enrollment.student,
    batch_enrollment: enrollment,
    amount: 3000,
    payment_date: Date.today - 20.days,
    payment_method: 'upi',
    months_covered: 1,
    recorded_by: teacher1_user.id
  )
end

# Batch 2 payments (per class)
2.times do
  Payment.create!(
    student: students[6],
    batch_enrollment: BatchEnrollment.find_by(batch: batch2, student: students[6]),
    amount: 800,
    payment_date: Date.today - rand(10..20).days,
    payment_method: 'cash',
    classes_covered: 1,
    recorded_by: teacher1_user.id
  )
end

# Batch 3 payments
batch3.batch_enrollments.each do |enrollment|
  Payment.create!(
    student: enrollment.student,
    batch_enrollment: enrollment,
    amount: 2500,
    payment_date: Date.today - 25.days,
    payment_method: ['upi', 'cash', 'bank_transfer'].sample,
    months_covered: 1,
    recorded_by: teacher2_user.id
  )
end
puts "✓ Created #{Payment.count} payment records"

# Create Learning Resources
puts "\nCreating learning resources..."
resource1 = LearningResource.create!(
  title: 'Mayamalavagowla Raga Introduction',
  description: 'Comprehensive guide to Mayamalavagowla raga with exercises',
  resource_type: 'video',
  resource_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  uploaded_by: teacher1_user.id
)

resource2 = LearningResource.create!(
  title: 'Flute Breathing Exercises',
  description: 'Essential breathing exercises for flute players',
  resource_type: 'video',
  resource_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  uploaded_by: teacher2_user.id
)

resource3 = LearningResource.create!(
  title: 'Carnatic Vocal Practice Track',
  description: 'Audio practice track for daily riyaz',
  resource_type: 'audio',
  resource_url: 'https://example.com/audio/practice1.mp3',
  uploaded_by: teacher1_user.id
)

# Assign resources to batches
ResourceAssignment.create!(
  learning_resource: resource1,
  assignable: batch1,
  assigned_by: teacher1_user.id,
  assigned_at: Date.today - 5.days,
  notes: 'Practice this raga daily'
)

ResourceAssignment.create!(
  learning_resource: resource2,
  assignable: batch3,
  assigned_by: teacher2_user.id,
  assigned_at: Date.today - 3.days,
  notes: 'Important for breath control'
)

ResourceAssignment.create!(
  learning_resource: resource3,
  assignable: students[6],
  assigned_by: teacher1_user.id,
  assigned_at: Date.today - 1.day,
  notes: 'Use this for your morning practice'
)
puts "✓ Created #{LearningResource.count} learning resources"
puts "✓ Created #{ResourceAssignment.count} resource assignments"

puts "\n" + "="*80
puts "Database seeded successfully!"
puts "="*80
puts "\nLOGIN CREDENTIALS:"
puts "-"*80
puts "Admin:"
puts "  Email: admin@example.com"
puts "  Password: password"
puts "\nTeachers:"
puts "  Email: teacher1@example.com (Admin Teacher)"
puts "  Password: password"
puts "  Email: teacher2@example.com"
puts "  Password: password"
puts "\nStudents:"
puts "  Email: student1@example.com through student10@example.com"
puts "  Password: password"
puts "-"*80
puts "\nSTATISTICS:"
puts "  Users: #{User.count}"
puts "  Students: #{Student.count}"
puts "  Teachers: #{Teacher.count}"
puts "  Courses: #{Course.count}"
puts "  Batches: #{Batch.count}"
puts "  Enrollments: #{BatchEnrollment.count}"
puts "  Class Sessions: #{ClassSession.count}"
puts "  Attendance Records: #{Attendance.count}"
puts "  Payments: #{Payment.count}"
puts "  Learning Resources: #{LearningResource.count}"
puts "="*80
