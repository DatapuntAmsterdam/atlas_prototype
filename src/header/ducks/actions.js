export const CLOSE_MODAL = `header/CLOSE_MODAL`
export const REPORT_PROBLEM_REQUEST = `header/REPORT_PROBLEM_REQUEST`
export const REPORT_FEEDBACK_REQUEST = `header/REPORT_FEEDBACK_REQUEST`

export const closeModalAction = () => ({
  type: CLOSE_MODAL,
  meta: {
    tracking: true,
  },
})

export const reportFeedbackAction = () => ({
  type: REPORT_FEEDBACK_REQUEST,
  meta: {
    tracking: true,
  },
})

export const reportProblemAction = () => ({
  type: REPORT_PROBLEM_REQUEST,
  meta: {
    tracking: true,
  },
})
