export type ValidatorType =
  | string
  | [string, ValidatorCallBack]
  | ObjectValidator;

export type ValidatorCallBack = (
  value: any,
  validate: (
    object: any,
    validators: ValidatorType[],
    error?: string
  ) => boolean | string
) => boolean | string;

export interface ObjectValidator {
  property: string;
  validate: ValidatorCallBack;
}

interface FailInterface {
  missing: string[];
  invalid: { property: string; error: string }[];
  valid: false;
  checked: null;
}

interface PassInterface {
  missing: null;
  invalid: null;
  valid: true;
  checked: { [key: string]: any };
}

function HOC(
  property: string,
  type: "string" | "number" | "object" | "boolean",
  strict: boolean
): ValidatorType {
  return [
    property,
    function (value) {
      if (!strict && value === undefined) return true;
      if (typeof value === type) return true;
      return `'${property}' value is not valid ${type}!`;
    },
  ];
}

export function isString(name: string, strict = true) {
  return HOC(name, "string", strict);
}

export function isNumber(
  name: string,
  checkString = false,
  strict = true
): ValidatorType {
  return [
    name,
    function (value) {
      if (!strict && value === undefined) return true;
      if (typeof value === "number") return true;
      if (checkString && typeof value === "string") {
        const num = parseFloat(value as string);
        if (!isNaN(num)) return true;
      }

      return `'${name}' value is not valid number!`;
    },
  ];
}

export function isBoolean(name: string, strict = true) {
  return HOC(name, "boolean", strict);
}

export function ignoreUndefined(
  name: string,
  callback: (value: any, validate: typeof vs) => boolean | string
): ValidatorType {
  return [
    name,
    function (value, validate) {
      if (value === undefined) return true;
      return callback(value, validate);
    },
  ];
}

function vs(
  object: any,
  validator: ValidatorType[],
  error?: string
): boolean | string {
  const result = validate(object, validator, { strict: false }).valid;
  if (typeof error === "string" && !result) return error;
  return result;
}

function checkCallBack(
  value: boolean | string,
  callback: (v: { property: string; error: string }) => void,
  name: string
) {
  if (typeof value === "boolean") {
    if (value === true) return true;
    callback({ property: name, error: "unknown" });
    return false;
  }

  if (typeof value === "string") {
    callback({ property: name, error: value });
    return false;
  }

  throw new Error("validation function only can return boolean or string!");
}

export function validate(
  object: any,
  validators: ValidatorType[],
  config = { strict: true }
): FailInterface | PassInterface {
  const missings: string[] = [];
  const invalids: { property: string; error: string }[] = [];
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

      if (
        checkCallBack(
          validator[1](object[validator[0]], vs),
          (e) => invalids.push(e),
          validator[0]
        )
      ) {
        if (object[validator[0]] === undefined) continue;
        valids[validator[0]] = object[validator[0]];
      }
    }

    if (validator instanceof Object && !Array.isArray(validator)) {
      if (!object.hasOwnProperty(validator.property) && config.strict) {
        missings.push(validator.property);
        continue;
      }

      if (
        checkCallBack(
          validator.validate(object[validator.property], vs),
          (e) => invalids.push(e),
          validator.property
        )
      ) {
        if (object[validator.property] === undefined) continue;
        valids[validator.property] = object[validator.property];
      }
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
