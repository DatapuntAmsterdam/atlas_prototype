export const NAMESPACE = 'header';
export const NAVIGATE_HOME_REQUEST = `${NAMESPACE}/NAVIGATE_HOME_REQUEST`;
export const SHOW_MODAL = `${NAMESPACE}/SHOW_MODAL`;
export const CLOSE_MODAL = `${NAMESPACE}/CLOSE_MODAL`;
export const REPORT_PROBLEM_REQUEST = `${NAMESPACE}/REPORT_PROBLEM_REQUEST`;
export const REPORT_FEEDBACK_REQUEST = `${NAMESPACE}/REPORT_FEEDBACK_REQUEST`;

// Action creators
export const navigateHomeAction = () => ({
  type: NAVIGATE_HOME_REQUEST,
  meta: {
    tracking: true
  }
});
export const showModalAction = () => ({
  type: SHOW_MODAL,
  meta: {
    tracking: true
  }
});
export const closeModalAction = () => ({
  type: CLOSE_MODAL,
  meta: {
    tracking: true
  }
});
export const reportFeedbackAction = () => ({
  type: REPORT_FEEDBACK_REQUEST,
  meta: {
    tracking: true
  }
});
export const reportProblemAction = () => ({
  type: REPORT_PROBLEM_REQUEST,
  meta: {
    tracking: true
  }
});
