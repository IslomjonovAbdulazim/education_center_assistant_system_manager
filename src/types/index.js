// User Types
export const USER_ROLES = {
  MANAGER: 'manager',
  ASSISTANT: 'assistant',
  STUDENT: 'student'
};

// User interface structure
export const createUser = (data = {}) => ({
  id: data.id || null,
  fullname: data.fullname || '',
  phone: data.phone || '',
  role: data.role || '',
  subject_field: data.subject_field || '',
  photo_url: data.photo_url || null,
  learning_center_id: data.learning_center_id || null,
  created_at: data.created_at || '',
  avg_rating: data.avg_rating || 0,
  total_sessions: data.total_sessions || 0,
  active_status: data.active_status || 'active'
});

// Subject interface structure
export const createSubject = (data = {}) => ({
  id: data.id || null,
  name: data.name || '',
  assistant_count: data.assistant_count || 0,
  student_count: data.student_count || 0,
  created_at: data.created_at || ''
});

// Session interface structure
export const createSession = (data = {}) => ({
  id: data.id || null,
  datetime: data.datetime || '',
  related_user_name: data.related_user_name || '',
  attendance: data.attendance || 'pending',
  status: data.status || 'booked',
  rating: data.rating || null,
  rating_details: data.rating_details || null
});

// Rating details structure
export const createRatingDetails = (data = {}) => ({
  knowledge: data.knowledge || 0,
  communication: data.communication || 0,
  patience: data.patience || 0,
  engagement: data.engagement || 0,
  problem_solving: data.problem_solving || 0,
  comments: data.comments || ''
});

// Stats structure
export const createStats = (data = {}) => ({
  overview: {
    total_assistants: data.overview?.total_assistants || 0,
    total_students: data.overview?.total_students || 0,
    total_subjects: data.overview?.total_subjects || 0,
    sessions_this_month: data.overview?.sessions_this_month || 0,
    total_sessions: data.overview?.total_sessions || 0,
    avg_rating: data.overview?.avg_rating || 0,
    attendance_rate: data.overview?.attendance_rate || 0
  },
  monthly_trends: data.monthly_trends || [],
  subject_popularity: data.subject_popularity || [],
  top_assistants: data.top_assistants || [],
  peak_hours: data.peak_hours || []
});

// Form validation
export const validatePhone = (phone) => {
  const phoneRegex = /^\+998\d{9}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  return password && password.length >= 4;
};

export const validateFullname = (fullname) => {
  return fullname && fullname.trim().length >= 2;
};

// Form initial states
export const createUserFormInitial = {
  fullname: '',
  phone: '+998',
  password: '',
  role: 'assistant',
  subject_field: ''
};

export const createSubjectFormInitial = {
  name: ''
};

export const changePasswordFormInitial = {
  current_password: '',
  new_password: '',
  confirm_password: ''
};

// Constants
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  PENDING: 'kutilmoqda'
};

export const SESSION_STATUS = {
  BOOKED: 'booked',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Helper functions
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB');
};

export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  const date = new Date(dateTimeString);
  return date.toLocaleString('en-GB');
};

export const generateStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push('★');
  }
  if (hasHalfStar) {
    stars.push('☆');
  }
  while (stars.length < 5) {
    stars.push('☆');
  }
  return stars.join('');
};

export const getInitials = (fullname) => {
  if (!fullname) return 'N/A';
  return fullname
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};