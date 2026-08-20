
export const AUTH_URLS = {
    sendOtp:{url: '/api/register/send-otp'},
    validateOtp:{url: '/api/register/validate-otp'}
}

export const REGISTER_URLS = {
    register:{url: '/api/register' }
}

export const LOAN_URLS = {
    products: {url: '/api/loans/products'},
    calculate: {url: '/api/loans/calculate'},
    apply: { url: '/api/loans/apply' },
    list: { url: '/api/loans' },
    detail:(id:number | string) =>({url: `/api/loans/${id}`}),
    cancel: (id: number | string) => ({ url: `/api/loans/${id}/cancel` }),
    timeline: (id: number | string) => ({ url: `/api/loans/${id}/timeline` }),
    uploadDocument: (id: number | string) => ({ url: `/api/loans/${id}/documents` }),
    deleteDocument: (id: number | string, docId: number | string) => ({
    url: `/api/loans/${id}/documents/${docId}`,
    }),
    submitGuarantor: (id: number | string) => ({ url: `/api/loans/${id}/guarantor` }),
    submit: (id: number | string) => ({ url: `/api/loans/${id}/submit` }),
}

export const NOTIFICATION_URLS = {
  index: { url: '/api/notifications' },
  read: (id: number | string) => ({ url: `/api/notifications/${id}/read` }),
  readAll: { url: '/api/notifications/read-all' },
}

export const ADMIN_LOAN_URLS = {
  list: { url: '/api/admin/loans' },
  detail: (id: number | string) => ({ url: `/api/admin/loans/${id}` }),
  approve: (id: number | string) => ({ url: `/api/admin/loans/${id}/approve` }),
  reject: (id: number | string) => ({ url: `/api/admin/loans/${id}/reject` }),
}