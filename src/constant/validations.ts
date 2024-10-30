export const ONLY_ALPHABET = /^[a-zA-Z\s]+$/;
export const MAX_NAME_CHARACTERS = 30;
export const MIN_NAME_CHARACTERS = 3;
export const EMAIL_VALIDATION =
  /^[-a-zA-Z0-9._]+@([a-zA-Z0-9-]+?\.)+[A-Za-z]+$/;

const messageTemplate = {
  req: 'is Required',
  min: 'must be at least',
  max: 'must be smaller than',
};
export const Validations = {
  contests: {
    name: {
      min: 5,
      max: 40,
    },
    slots: {
      min: 1,
    },
    minCap: {
      min: 1,
    },
    maxCap: {
      min: 1,
    },
    teamsPerUser: {
      min: 1,
    },
  },
};

export const Messages = {
  contest: {
    name: {
      req: `Contest Name ${messageTemplate.req}`,
      min: `Contest Name ${messageTemplate.min} ${Validations.contests.name.min}`,
      max: `Contest Name ${messageTemplate.max} ${Validations.contests.name.max}`,
    },
    slots: {
      req: `Slots are required`,
      min: `Slots ${messageTemplate.min} ${Validations.contests.slots.min}`,
    },
    minCap: {
      req: `Min Cap ${messageTemplate.req}`,
      min: `Min Cap can not be less than ${Validations.contests.minCap.min}`,
    },
    maxCap: {
      req: `Max Cap ${messageTemplate.req}`,
      min: `Max Cap can not be less than ${Validations.contests.maxCap.min}`,
    },
    teamsPerUser: {
      req: `Teams Per User ${messageTemplate.req}`,
      min: `Teams Per User can not be less than ${Validations.contests.teamsPerUser.min}`,
    },
    rules: {
      req: `Contest Rule ${messageTemplate.req}`,
    },
  },
};
