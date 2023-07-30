import * as yup from "yup";

import { StepperFormValues } from "./types";

export enum STEPS {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  FOURTH = 4,
}

export const DESCRIPTIONS = {
  firstStep: "It is a name other users will see. You can change it anytime",
  secondStep:
    "Optional: Add short info about yourself (one - two sentences). You can change it anytime",
  thirdStep: "Optional: Add your photo. You can change it anytime",
  fourthStep: "Check and submit. All info can be changed anytime",
};

export const STEPPER_FORM_FIELDS: {
  name: "name";
  description: "description";
  photo: "photo";
} = {
  name: "name",
  description: "description",
  photo: "photo",
};

export const STEPPER_DEFAULT_VALUES: StepperFormValues = {
  name: "",
  description: "",
  photo: "",
};

export const STEPPER_FORM_VALIDATION_SCHEMA = yup.object({
  [STEPPER_FORM_FIELDS.name]: yup.string().required(),
  [STEPPER_FORM_FIELDS.description]: yup.string() as yup.StringSchema<string>,
  [STEPPER_FORM_FIELDS.photo]: yup.string() as yup.StringSchema<string>,
});

export const STEPPER_FORM_PLACEHOLDERS = {
  [STEPPER_FORM_FIELDS.name]: "Your name...",
  [STEPPER_FORM_FIELDS.description]: "Something about yourself...",
};

export const STEPPER_FORM_ERRORS = {
  [STEPPER_FORM_FIELDS.name]: "Name is required",
  [STEPPER_FORM_FIELDS.description]: "",
};
