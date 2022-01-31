export interface Message {
  success: 0|1;
  message: string;
}

function createMessage(message: Message) {
  return Object.freeze(message);
}

const success = Object.freeze({
  general: createMessage({
    success: 1,
    message: 'SUCCESS',
  }),
  loginByEmail: createMessage({
    success: 1,
    message: 'Login Email sent successfully!',
  }),
  loginByPhone: createMessage({
    success: 1,
    message: 'Verification code sent to your phone!',
  }),
  login: createMessage({
    success: 1,
    message: 'Successfully logged in!',
  }),
  register: createMessage({
    success: 1,
    message: 'Successfully registered!',
  }),
  verify: createMessage({
    success: 1,
    message: 'Successfully verified!',
  }),
});

const failed = Object.freeze({
  general: createMessage({
    success: 0,
    message: 'Something went wrong',
  }),
  invalidToken: createMessage({
    success: 0,
    message: 'Your token expired or invalid. Please login again to get new token.',
  }),
  existed: createMessage({
    success: 0,
    message: 'The email or phone number you entered exists already. Please use another one.',
  }),
  existedEmail: createMessage({
    success: 0,
    message: 'The email you entered exists already. Please use another one.',
  }),
  manualUser: Object.freeze({
    existed: createMessage({
      success: 0,
      message: 'The name, email or phone number you entered exists already. Please use another one.',
    }),
  }),
  referral: Object.freeze({
    invalidURL: createMessage({
      success: 0,
      message: 'This referral URL is invalid.',
    }),
    limitURL: createMessage({
      success: 0,
      message: 'This referral reached its limitation already.',
    }),
  }),
});

export const messages = Object.freeze({ success, failed });
