import { FailInterface, ValidatorType, PassInterface } from "./types";

function vs(object: any, validator: ValidatorType[]): boolean {
  return validate(object, validator, { strict: false }).valid;
}

function validate(
  object: any,
  validators: ValidatorType[],
  config = { strict: true }
): FailInterface | PassInterface {
  const missings: string[] = [];
  const invalids: string[] = [];
  const valids: { [key: string]: any } = {};

  if (!(object instanceof Object && !Array.isArray(object))) {
    return {
      valid: false,
      checked: null,
      missing: ["all properties are missing because this is not object"],
      invalid: invalids,
    };
  }

  for (const validator of validators) {
    if (typeof validator === "string") {
      if (object.hasOwnProperty(validator)) {
        valids[validator] = object[validator];
        continue;
      }

      missings.push(validator);
    }

    if (Array.isArray(validator)) {
      if (!object.hasOwnProperty(validator[0]) && config.strict) {
        missings.push(validator[0]);
        continue;
      }

      if (!validator[1](object[validator[0]], vs)) {
        invalids.push(validator[0]);
        continue;
      }

      if (object[validator[0]] === undefined) continue;
      valids[validator[0]] = object[validator[0]];
    }

    if (validator instanceof Object && !Array.isArray(validator)) {
      if (!object.hasOwnProperty(validator.property) && config.strict) {
        missings.push(validator.property);
        continue;
      }

      if (!validator.validate(object[validator.property], vs)) {
        invalids.push(validator.property);
        continue;
      }

      if (object[validator.property] === undefined) continue;
      valids[validator.property] = object[validator.property];
    }
  }

  if (missings.length > 0 || invalids.length > 0) {
    return {
      valid: false,
      missing: missings,
      invalid: invalids,
      checked: null,
    };
  }

  return { valid: true, checked: valids, missing: null, invalid: null };
}

export default validate;
